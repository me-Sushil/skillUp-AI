import { useState, useRef, useEffect } from "react";
import service from "../../services/service";
import { Link } from "react-router-dom";
import FormattedAIResponse from "../FormattedAIResponse"; // Import the new component

const url = import.meta.env.VITE_AI_URL;

const ChatInterface = () => {
  const [userRequest, setUserRequest] = useState("");
  // const [aiResponse, setAiResponse] = useState([]);
  const [messages, setMessages] = useState([]); // array of { sender: "user" | "ai", text: string }
  const [topic, setTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef(null); // Added ref for textarea
  const messagesContainerRef = useRef(null); // Add ref for auto-scroll

  
  console.log(userRequest, "the user search is ?");

  useEffect(() => {
    const topicLocal = JSON.parse(localStorage.getItem("topic"));
    setTopic(topicLocal || "");
  }, []);

  // Auto-scroll to bottom function
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]); // Also scroll when loading state changes

  // Auto-resize textarea function
  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height to get proper scrollHeight
      textarea.style.height = "auto";

      // Get the scroll height
      const scrollHeight = textarea.scrollHeight;
      const maxHeight = 200; // Match your maxHeight

      // Set height, but don't exceed maxHeight
      if (scrollHeight <= maxHeight) {
        textarea.style.height = `${scrollHeight}px`;
        textarea.style.overflowY = "hidden"; // Hide scrollbar when not needed
      } else {
        textarea.style.height = `${maxHeight}px`;
        textarea.style.overflowY = "auto"; // Show scrollbar when content exceeds maxHeight
      }
    }
  };

  // Adjust height when userRequest changes
  useEffect(() => {
    adjustHeight();
  }, [userRequest]);

 

  useEffect(() => {
    const userfromlocal = JSON.parse(localStorage.getItem("user"));
    const userId = userfromlocal.id;
    console.log(userId, " id before send backend");

    async function fetchdata(userId) {
      const result = await service.getAllchats(userId);
      result.chats.map((chat) => {
        setMessages((prev) => [
          ...prev,
          { sender: "user", text: chat.userRequest },
          { sender: "ai", text: chat.answer },
        ]);
      });
    }
    fetchdata(userId);
  }, []);

  const handleRequest = async () => {
    setIsLoading(true);
    if (!topic) return console.log("Select topic first");
    if (!userRequest || userRequest.trim() === "") {
       setIsLoading(false);
      return console.log("type your question");
    }

    localStorage.setItem("topic", JSON.stringify(topic));
    const currentRequest = userRequest.trim();
    setUserRequest(""); 

    // push user message into conversation
    setMessages((prev) => [...prev, { sender: "user", text: currentRequest }]);
    const user = JSON.parse(localStorage.getItem("user"));
    try {
      const result = await service.create(url, {
        topic,
        userRequest: currentRequest,
        user: user.id,
      });

      if (result) {
        const aiText = result.data[0].answer;
        setIsLoading(false);
        // push AI response into conversation
        setMessages((prev) => [...prev, { sender: "ai", text: aiText }]);
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error, "Error to connect with AI");
    }
  };
// Loading animation component
  const LoadingAnimation = () => (
    <div className="flex justify-start">
      <div className="bg-gradient-to-r from-cyan-500/10 via-violet-500/10 to-fuchsia-500/10 backdrop-blur-sm border border-violet-400/30 p-3 rounded-xl max-w-3xl relative overflow-hidden">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400/5 via-violet-400/5 to-fuchsia-400/5"></div>
        <div className="flex items-center space-x-2 relative z-10">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-fuchsia-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <span className="text-slate-300 text-sm">AI is thinking...</span>
        </div>
      </div>
    </div>
  );


  return (
    <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 relative overflow-hidden">
      {/* Decorative elements - same as login */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400"></div>
      <div className="absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-br from-violet-400/20 to-fuchsia-400/20 rounded-full blur-xl"></div>

      <div className="flex flex-col h-[600px] p-6 relative z-10">
        {/* Row: header + select */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 -mt-4">
          {/* Left: Chat Header (keeps natural width) //  */}
          <div className="sm:mr-2">
            <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent mb-0">
              SkillUp-AI Chat Assistant
            </h3>
            <p className="text-slate-300 text-sm mb-1">
              {topic ? `Learning ${topic}` : "Select a topic to start chatting"}
            </p>
          </div>

          {/* Right: select takes remaining space */}
          <div className="flex-1">
            <div className="relative">
              <select
                value={topic || ""}
                onChange={(e) => setTopic(e.target.value)}
                aria-label="Choose a language to study"
                className="w-1xl h-9 px-4 py-1 bg-gradient-to-r from-slate-700/70 via-slate-800/70 to-slate-700/70 backdrop-blur-sm border border-slate-600/50 rounded-xl text-white font-semibold focus:ring-2 focus:ring-violet-400/50 focus:border-violet-400/50 hover:from-slate-600/70 hover:via-slate-700/70 hover:to-slate-600/70 transition-all duration-300"
              >
                <option
                  value=""
                  disabled
                  hidden
                  className="bg-slate-800 text-slate-300"
                >
                  Select a language to study
                </option>
                <option
                  value="JavaScript"
                  className="bg-slate-800 text-white font-medium py-2 hover:bg-slate-700"
                >
                  JavaScript
                </option>
                <option
                  value="React"
                  className="bg-slate-800 text-white font-medium py-2 hover:bg-slate-700"
                >
                  React
                </option>
                <option
                  value="Python"
                  className="bg-slate-800 text-white font-medium py-2 hover:bg-slate-700"
                >
                  Python
                </option>
                <option
                  value="HTML/CSS"
                  className="bg-slate-800 text-white font-medium py-2 hover:bg-slate-700"
                >
                  HTML/CSS
                </option>
              </select>

              {/* decorative overlay */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400/5 via-violet-400/5 to-fuchsia-400/5 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          </div>
           <Link 
                to="/quiz" 
                className="w-20 px-4 py-2 text-sm text-white font-semibold rounded-xl shadow-lg bg-gradient-to-r hover:scale-105 hover:shadow-xl active:scale-95 transform transition duration-300 ease-in-out"
              >
                Quiz
              </Link>
        </div>

 <div ref={messagesContainerRef} className="flex-1 overflow-y-auto space-y-3 pr-2 mb-4 custom-scrollbar">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`p-4 rounded-xl max-w-4xl relative overflow-hidden ${
                  msg.sender === "user"
                    ? "bg-slate-700/50 backdrop-blur-sm border border-slate-600/50"
                    : "bg-gradient-to-r from-cyan-500/10 via-violet-500/10 to-fuchsia-500/10 backdrop-blur-sm border border-violet-400/30"
                }`}
              >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400/5 via-violet-400/5 to-fuchsia-400/5"></div>
                <div className="relative z-10">
                  {msg.sender === "user" ? (
                    <p className="text-slate-200">{msg.text}</p>
                  ) : (
                    <FormattedAIResponse text={msg.text} />
                  )}
                </div>
              </div>
            </div>
          ))}
          {isLoading && <LoadingAnimation />}
        </div>
        {/* Input box with send button inside textarea */}
        <div className="relative">
          <textarea
            ref={textareaRef}
            placeholder="Ask your question..."
            className="w-full px-4 py-3 pr-16 custom-scrollbar bg-slate-700/50 backdrop-blur-sm border border-slate-600/50 rounded-xl focus:ring-2 focus:ring-violet-400/50 focus:border-violet-400/50 transition-all duration-300 placeholder-slate-400 text-white hover:bg-slate-700/70 hover:border-slate-500/50 resize-none"
            value={userRequest}
            rows={1}
            style={{
              minHeight: "48px",
              maxHeight: "200px",
            }}
            onChange={(e) => {
              setUserRequest(e.target.value);
              setTimeout(adjustHeight, 0);
            }}
            onKeyDown={(e) =>
              e.key === "Enter" && !e.shiftKey && handleRequest()
            }
            disabled={isLoading}
          />

          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400/5 via-violet-400/5 to-fuchsia-400/5 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

          <button
            className="absolute bottom-2 right-4 bg-gradient-to-r from-cyan-500 via-violet-500 to-fuchsia-500 hover:from-cyan-600 hover:via-violet-600 hover:to-fuchsia-600 text-white font-semibold px-3 py-1.5 rounded-lg transition-all duration-300 focus:ring-2 focus:ring-violet-400/50 shadow-lg transform hover:scale-105 group text-sm z-10"
            onClick={handleRequest}
          >
            <span className="relative z-10">Send</span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;