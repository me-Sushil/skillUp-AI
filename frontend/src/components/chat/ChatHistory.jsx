import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import service from "../../services/service";

const ChatHistory = () => {
  const navigate = useNavigate();

  const { setIsAuthenticated} = useContext(AuthContext);
  const [user, setUser] = useState({});
  const [allChatsSummary, setAllChatsSummary] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setIsAuthenticated(false);
    navigate("/login");
  };

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user")));
  }, []);

  useEffect(() => {
    const userfromlocal = JSON.parse(localStorage.getItem("user"))
    const userId = userfromlocal?.id;
    console.log(userId, " id before send backend");

    async function fetchdata(userId){
    const result = await service.getAllchats(userId);
    const arr = result.chats.slice().reverse().map((chat)=>chat.summary)
    setAllChatsSummary(arr);
  }
  fetchdata(userId);
  },[user]);

  return (
    <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 relative overflow-hidden h-full flex flex-col ">
      {/* Decorative elements - same as login */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400"></div>
      <div className="absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-br from-violet-400/20 to-fuchsia-400/20 rounded-full blur-xl"></div>

      <div className="p-6 relative z-10 flex flex-col h-full -mt-4">
        {/* Welcome Section - Fixed at top // mb-6 flex-shrink-0*/}
        <div className=" flex items-center gap-4">
          <div className="relative flex-1">
            <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent mb-1">
              Welcome back!
            </h2>
            <p className="text-slate-300 text-sm">{user.fullName}</p>
          </div>
        </div>
        {/* Chat History Header - Fixed */}
        <div className="mb-4 flex-shrink-0">
          <h3 className="text-lg font-semibold text-slate-200 mb-2">
            Chat History
          </h3>
          <div className="w-full h-px bg-gradient-to-r from-cyan-400/30 via-violet-400/30 to-fuchsia-400/30"></div>
        </div>

        {/* Chat History Items - Scrollable //scrollbar-thin  //scrollbar-thumb-violet-400/50 scrollbar-track-slate-700/50 */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
          {allChatsSummary.map((item, index) => (
            <div
              key={index}
              className="bg-slate-700/50 backdrop-blur-sm border border-slate-600/50 rounded-xl p-2 relative overflow-hidden hover:bg-slate-700/70 hover:border-slate-500/50 transition-all duration-300 cursor-pointer group flex-shrink-0"
            >
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400/5 via-violet-400/5 to-fuchsia-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                {/* <div className="flex justify-between items-start mb-1">
                   <p className="text-slate-200 text-sm font-medium">
                    Chat Session #{item}
                  </p> 
                  <button className="text-red-400 hover:text-red-300 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    ✕
                  </button>
                </div> */}
                <p className="text-slate-400 text-xs">
                  {item}
                </p>
                {/* <div className="flex justify-between items-center mt-2">
                  <button className="text-violet-400 hover:text-violet-300 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    View
                  </button>
                </div> */}
              </div>
            </div>
          ))}
        </div>

        {/* New Chat Button - Fixed at bottom */}
        <div className="mt-4 flex flex-col gap-3 flex-shrink-0">
          {/* New Chat */}
          <button className="w-full relative overflow-hidden bg-gradient-to-r from-cyan-500 via-violet-500 to-fuchsia-500 hover:from-cyan-600 hover:via-violet-600 hover:to-fuchsia-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-violet-400/50 focus:ring-offset-2 focus:ring-offset-slate-800 shadow-xl transform hover:scale-105 hover:shadow-2xl group">
            <span className="relative z-10">+ New Chat</span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-20 px-4 py-2 text-sm text-white font-semibold rounded-xl shadow-lg bg-gradient-to-r hover:scale-105 hover:shadow-xl active:scale-95 transform transition duration-300 ease-in-out"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHistory;
