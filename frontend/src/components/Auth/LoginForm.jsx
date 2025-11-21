// src/components/Auth/LoginForm.jsx

import { useState } from "react";
import { useContext } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import service from "../../services/service";
import { AuthContext } from "../../context/AuthContext.jsx";
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";

const loginURL = import.meta.env.VITE_LOGIN_URL;

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loginData = { email: email.trim(), password: password.trim() };
    if ((!email.trim(), !password.trim())) {
      setError("All fields are required");
      setTimeout(() => {
        setError("");
      }, 500);
      return;
    }
    try {
      const response = await service.create(loginURL, loginData);
      if (!response.token) {
        console.log("this is error no token");
        return;
      } else {
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));

        console.log(response.token, "token after login");

        setIsAuthenticated(true); // Update auth state
        navigate("/dashboard");

        setEmail("");
        setPassword("");
      }
    } catch (error) {
      setError(error.error);
      console.log(error.error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 via-violet-400/10 to-fuchsia-400/10 animate-pulse"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-r from-yellow-400 to-red-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-gradient-to-r from-blue-400 to-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="max-w-md w-full space-y-4 relative z-10">
        <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-slate-700/50 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400"></div>
          <div className="absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-br from-violet-400/20 to-fuchsia-400/20 rounded-full blur-xl"></div>

          {/* Header */}
          <div className="text-center mb-6 relative">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-cyan-400 to-violet-500 rounded-xl mb-3 shadow-lg">
              <span className="text-xl font-bold text-white">S</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent mb-1">
              SkillUp AI
            </h1>
            <p className="text-slate-300 text-sm">
              Welcome back! Please sign in to your account
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-400/30 rounded-xl backdrop-blur-sm relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-pink-500/5"></div>
              <p className="text-red-300 text-sm font-medium relative z-10">
                {error}
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="relative">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-200 mb-1"
              >
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full px-4 py-2.5 bg-slate-700/50 backdrop-blur-sm border border-slate-600/50 rounded-xl focus:ring-2 focus:ring-violet-400/50 focus:border-violet-400/50 transition-all duration-300 placeholder-slate-400 text-white hover:bg-slate-700/70 hover:border-slate-500/50"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400/5 via-violet-400/5 to-fuchsia-400/5 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>

            {/* Password Field */}
            <div className="relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-200 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full px-4 py-2.5 bg-slate-700/50 backdrop-blur-sm border border-slate-600/50 rounded-xl focus:ring-2 focus:ring-violet-400/50 focus:border-violet-400/50 transition-all duration-300 placeholder-slate-400 text-white hover:bg-slate-700/70 hover:border-slate-500/50"
                />
                {/* Eye Icon Button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-white"
                >
                  {/* {showPassword ? "🙈" : "👁️"} */}
                  {showPassword ? (
        <HiOutlineEyeOff size={22} />
      ) : (
        <HiOutlineEye size={22} />
      )}
                </button>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400/5 via-violet-400/5 to-fuchsia-400/5 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full relative overflow-hidden bg-gradient-to-r from-cyan-500 via-violet-500 to-fuchsia-500 hover:from-cyan-600 hover:via-violet-600 hover:to-fuchsia-600 text-white font-semibold py-2.5 px-4 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-violet-400/50 focus:ring-offset-2 focus:ring-offset-slate-800 shadow-xl transform hover:scale-105 hover:shadow-2xl group"
            >
              <span className="relative z-10">Sign In</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-4 text-center">
            <p className="text-slate-300 text-sm">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-transparent bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text font-semibold hover:from-cyan-300 hover:to-violet-300 transition-all duration-300 underline-offset-2 hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>

        {/* Add custom keyframes for animations */}
        {/* <style>{`
          @keyframes blob {
            0% {
              transform: translate(0px, 0px) scale(1);
            }
            33% {
              transform: translate(30px, -50px) scale(1.1);
            }
            66% {
              transform: translate(-20px, 20px) scale(0.9);
            }
            100% {
              transform: translate(0px, 0px) scale(1);
            }
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
        `}</style> */}
      </div>
    </div>
  );
};

export default LoginForm;
