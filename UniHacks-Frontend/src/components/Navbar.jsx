import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Bell, Home, LogOut, Sparkles } from "lucide-react";
import Dock from "./Dock";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const dockItems = [
    {
      label: "Home",
      onClick: () => navigate("/"),
      className: location.pathname === "/" ? "dock-item-active" : "",
      icon: <Home className="w-5 h-5" />
    },
    {
      label: "Activity Room",
      onClick: () => navigate("/ar"),
      className: location.pathname === "/ar" ? "dock-item-active" : "",
      icon: <Sparkles className="w-5 h-5" />
    },
    {
      label: "Notifications",
      onClick: () => navigate("/notifications"),
      className: location.pathname === "/notifications" ? "dock-item-active" : "",
      icon: (
        <div className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 bg-red-500 w-2 h-2 rounded-full border border-white animate-pulse"></span>
        </div>
      )
    },
    {
      label: "Logout",
      onClick: () => {
        localStorage.removeItem("token");
        window.location.href = "/";
      },
      icon: <LogOut className="w-5 h-5" />
    }
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] flex justify-center pt-6 pointer-events-none">
      <nav className="
        pointer-events-auto 
        flex justify-center items-center 
        px-5 py-3 md:px-6 md:py-3.5 
        bg-white/20 
        backdrop-blur-xl 
        -webkit-backdrop-blur-xl 
        border border-white/40 
        shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]
        rounded-full 
        w-[94%] max-w-6xl 
        transition-all duration-500 hover:border-white/60
      ">
        <div className="hidden md:flex justify-center">
          <Dock items={dockItems} />
        </div>

        <div className="md:hidden flex items-center gap-3 text-gray-700">
          <button
            onClick={() => navigate("/")}
            className="p-2 rounded-full bg-white/55 border border-white/50 shadow-sm hover:text-[#10b981] transition-all cursor-pointer"
          >
            <Home className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate("/ar")}
            className="p-2 rounded-full bg-white/55 border border-white/50 shadow-sm hover:text-[#10b981] transition-all cursor-pointer"
          >
            <Sparkles className="w-5 h-5" />
          </button>
        </div>
      </nav>
    </div>
  );
}
