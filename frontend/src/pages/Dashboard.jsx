// src/pages/Dashboard.jsx
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import ChatInterface from "../components/chat/ChatInterface.jsx";
import ChatHistory from "../components/chat/ChatHistory.jsx";
// import { useState } from "react";

const Dashboard = () => {

  const { user } = useContext(AuthContext);
  console.log("log name ", user.fullName);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements - same as login */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 via-violet-400/10 to-fuchsia-400/10 animate-pulse"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-r from-yellow-400 to-red-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-gradient-to-r from-blue-400 to-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 flex gap-x-7 p-6 h-screen overflow-hidden">
        {/* Chat History Sidebar */}
        <div className="w-1/4">
          <ChatHistory user={user} />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col space-y-6">
          {/* Chat Interface  topic={topic}*/}
          <ChatInterface  user={user} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
