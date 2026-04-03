import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Bell, Home, LogOut, Search, Sparkles } from "lucide-react";
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
      label: "Search",
      onClick: () => navigate("/search"),
      className: location.pathname === "/search" ? "dock-item-active" : "",
      icon: <Search className="w-5 h-5" />
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
        px-2 py-2 
        w-fit 
        transition-all duration-500 hover:border-white/60
      ">
        {/* Desktop View */}
        <div className="hidden md:flex items-center">
          <Dock items={dockItems} />
        </div>

        {/* Mobile View */}
        <div className="md:hidden flex items-center gap-3 text-gray-700 px-2">
          <button
            onClick={() => navigate("/")}
            className="p-2 rounded-full hover:text-[#10b981] transition-all cursor-pointer"
          >
            <Home className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate("/search")}
            className="p-2 rounded-full hover:text-[#10b981] transition-all cursor-pointer"
          >
            <Search className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate("/ar")}
            className="p-2 rounded-full hover:text-[#10b981] transition-all cursor-pointer"
          >
            <Sparkles className="w-5 h-5" />
          </button>
        </div>
      </nav>
    </div>
  );
}