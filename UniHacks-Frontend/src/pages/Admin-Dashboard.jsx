import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, Clock, Layers, Plus, Play, Pause, 
  Settings, TrendingUp, ChevronRight, AlertCircle, 
  Bell 
} from "lucide-react";

export default function AdminDashboard() {
  const [data, setData] = useState({
    activeQueues: 0,
    totalWaiting: 0,
    avgServiceTime: 0,
    currentToken: 104, 
    upcoming: ["#105", "#106", "#107"] 
  });

  const [paused, setPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchDashboard();
    const interval = setInterval(fetchDashboard, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(prev => ({ ...prev, ...res.data }));
    } catch (error) {
      console.error("Dashboard fetch error", error);
    }
  };

  const handleCallNext = async () => {
    setIsLoading(true);
    try {
      await axios.post("http://localhost:5000/api/admin/call-next", {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchDashboard();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePauseQueue = async () => {
    try {
      await axios.post("http://localhost:5000/api/admin/pause", {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPaused(!paused);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-10 bg-[#fdfdf2] text-gray-800 font-sans selection:bg-emerald-100 ">
      
      {/* Background Blobs - Unified Green/Yellow Palette */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-yellow-200/30 rounded-full blur-[120px] -z-10 animate-blob " ></div>
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-emerald-200/20 rounded-full blur-[120px] -z-10 animate-blob animation-delay-2000"></div>

      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8  mt-9 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest border border-emerald-200">
                Live Console
              </span>
              <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">System Operational</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter">
              Admin <span className="text-emerald-600">Workspace</span>
            </h1>
          </div>
          <div className="flex gap-3">
             <button className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all text-gray-400 hover:text-emerald-600">
               <Bell className="w-5 h-5" />
             </button>
             <button className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all text-gray-400 hover:text-emerald-600">
               <Settings className="w-5 h-5" />
             </button>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* STATS AREA (Left 8 Columns) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: "Active Queues", val: data.activeQueues, icon: Layers, trend: "+2" },
                { label: "Waiting Now", val: data.totalWaiting, icon: Users, trend: "+12%" },
                { label: "Avg Service", val: data.avgServiceTime, icon: Clock, trend: "-3m", unit: "m" },
              ].map((stat, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                  key={i} className="bg-white rounded-[2rem] p-6 border border-gray-50 shadow-sm group hover:shadow-xl transition-all"
                >
                   <div className="flex justify-between items-start mb-4">
                      <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-110 transition-transform">
                        <stat.icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-black text-emerald-500 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> {stat.trend}
                      </span>
                   </div>
                   <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</div>
                   <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black text-gray-900">{stat.val}</span>
                      {stat.unit && <span className="text-sm font-bold text-gray-400">{stat.unit}</span>}
                   </div>
                </motion.div>
              ))}
            </div>

            {/* Main Operations Terminal */}
            <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
              
              <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
                <div>
                  <h2 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400 mb-6 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Now Serving
                  </h2>
                  <div className="flex items-baseline gap-4 mb-2">
                    <span className="text-8xl font-black tracking-tighter">#{data.currentToken}</span>
                    <span className="text-emerald-500/50 font-black text-xl uppercase">Live</span>
                  </div>
                  <p className="text-gray-400 font-medium mb-8">Queue is moving at a steady pace. Call next when counter is ready.</p>
                  
                  <div className="flex gap-4">
                    <button 
                      disabled={isLoading || paused}
                      onClick={handleCallNext}
                      className={`flex-1 py-4 px-6 rounded-2xl font-black flex items-center justify-center gap-2 transition-all ${
                        isLoading ? 'bg-gray-700' : 'bg-emerald-500 hover:bg-emerald-400 active:scale-95 shadow-lg shadow-emerald-500/20'
                      }`}
                    >
                      {isLoading ? 'Calling...' : <><Play className="w-5 h-5 fill-current" /> Call Next</>}
                    </button>
                    <button 
                      onClick={handlePauseQueue}
                      className={`px-6 py-4 rounded-2xl font-black border-2 transition-all ${
                        paused ? 'bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/20' : 'border-white/10 hover:bg-white/5 text-white'
                      }`}
                    >
                      {paused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Up Next List */}
                <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/5">
                   <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-4">Up Next</h3>
                   <div className="space-y-3">
                      {data.upcoming.map((token, i) => (
                        <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-colors">
                           <span className="font-black text-lg">{token}</span>
                           <span className="text-[10px] font-black text-gray-500 uppercase">Wait ~4m</span>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            </div>
          </div>

          {/* ACTION SIDEBAR (Right 4 Columns) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Unified Emerald Sidebar Card */}
            <div className="bg-white border border-gray-50 rounded-[2.5rem] p-8 shadow-sm group cursor-pointer hover:shadow-xl transition-all">
               <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
                 <Plus className="w-6 h-6" />
               </div>
               <h3 className="text-xl font-black text-gray-900 mb-2">Add New Venue</h3>
               <p className="text-sm text-gray-500 font-medium leading-relaxed">Expand the QueueNest network by registering a new branch or office.</p>
               <div className="mt-6 flex items-center gap-2 text-emerald-600 font-black text-xs uppercase">
                 Begin Setup <ChevronRight className="w-4 h-4" />
               </div>
            </div>

            {/* Warning remains Amber as it's a standard alert color, but styled to match */}
            <div className="bg-amber-50 border border-amber-100 rounded-[2.5rem] p-7 flex items-start gap-4 shadow-sm shadow-amber-500/5">
               <AlertCircle className="w-6 h-6 text-amber-500 shrink-0" />
               <div>
                 <h4 className="text-sm font-black text-amber-900 uppercase mb-1">Peak Hour Warning</h4>
                 <p className="text-xs text-amber-700 font-medium leading-relaxed">Traffic is higher than usual. Average wait times are increasing.</p>
               </div>
            </div>

          </div>

        </main>
      </div>
      
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.05); }
          66% { transform: translate(-20px, 20px) scale(0.95); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 12s infinite alternate ease-in-out; }
        .animation-delay-2000 { animation-delay: 2s; }
      `}</style>
    </div>
  );
}