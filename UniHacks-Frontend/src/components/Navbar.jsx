import React from "react";
import { Link } from "react-router-dom";
import { Bell, LogOut } from "lucide-react";

export default function Navbar() {
  return (
    // Container: keeps the navbar centered and floating
    <div className="fixed top-0 left-0 right-0 z-[100] flex justify-center pt-6 pointer-events-none">

      <nav className="
        pointer-events-auto 
        flex justify-between items-center 
        px-6 py-3 md:px-8 md:py-3.5 
        /* GLASS EFFECT START */
        bg-white/20 
        backdrop-blur-xl 
        -webkit-backdrop-blur-xl 
        border border-white/40 
        shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]
        /* GLASS EFFECT END */
        rounded-full 
        w-[92%] max-w-5xl 
        transition-all duration-500 hover:border-white/60
      ">

        {/* Logo */}
        <Link to="/" className="text-2xl font-black text-[#10b981] tracking-tighter hover:scale-105 transition-transform">
          Queue<span className="text-gray-900/80">Nest</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex gap-8 text-[13px] font-black uppercase tracking-widest text-gray-700/80">
          <Link to="/search" className="hover:text-[#10b981] transition-all relative group">
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#10b981] transition-all group-hover:width-full"></span>
          </Link>
          <Link to="/ar" className="hover:text-[#10b981] transition-all relative group">
            Activity Room
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#10b981] transition-all group-hover:width-full"></span>
          </Link>
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-4 text-gray-700">
          {/* Notifications */}
          <Link to="/notifications" className="p-2 rounded-full hover:bg-white/40 hover:text-[#10b981] transition-all relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 bg-red-500 w-2 h-2 rounded-full border-2 border-white/50 animate-pulse"></span>
          </Link>

          {/* Logout Button */}
          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/";
            }}
            className="p-2 rounded-full hover:bg-rose-50 hover:text-rose-500 transition-all cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>

      </nav>
    </div>
  );
}