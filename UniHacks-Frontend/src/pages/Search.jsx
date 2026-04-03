import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ElectricBorder from "../components/ElectricBorder";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [offices, setOffices] = useState([]);

  const categories = ["All", "Bank", "Hospital", "Government", "Education", "Utilities"];

  const dummyOffices = [
    { _id: "1", name: "SBI Main Branch", location: "Mumbai", tags: ["bank"], queueLength: 12, estimatedWaitTime: 25, currentToken: 104 },
    { _id: "2", name: "HDFC Bank Branch", location: "Mumbai", tags: ["bank"], queueLength: 8, estimatedWaitTime: 18, currentToken: 56 },
    { _id: "3", name: "ICICI Bank", location: "Mumbai", tags: ["bank"], queueLength: 15, estimatedWaitTime: 30, currentToken: 89 },
    { _id: "4", name: "City Care Hospital", location: "Mumbai", tags: ["hospital"], queueLength: 20, estimatedWaitTime: 40, currentToken: 210 },
    { _id: "5", name: "Apollo Clinic", location: "Mumbai", tags: ["hospital"], queueLength: 6, estimatedWaitTime: 12, currentToken: 23 },
    { _id: "7", name: "Passport Office", location: "Mumbai", tags: ["government"], queueLength: 9, estimatedWaitTime: 20, currentToken: 72 },
    { _id: "10", name: "RTO Mumbai Central", location: "Mumbai", tags: ["government"], queueLength: 10, estimatedWaitTime: 22, currentToken: 67 },
    { _id: "11", name: "Mumbai University", location: "Mumbai", tags: ["education"], queueLength: 7, estimatedWaitTime: 15, currentToken: 48 },
    { _id: "15", name: "Electricity Board", location: "Mumbai", tags: ["utilities"], queueLength: 16, estimatedWaitTime: 32, currentToken: 120 }
  ];

  useEffect(() => {
    const fetchOffices = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/offices");
        const data = await response.json();
        setOffices(data && data.length > 0 ? data : dummyOffices);
      } catch (error) {
        setOffices(dummyOffices);
      }
    };

    fetchOffices();
  }, []);

  const processedOffices = offices
    .filter(office => {
      const matchesSearch =
        office.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        office.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTag = activeTag === "All" || office.tags?.some(tag => tag.toLowerCase() === activeTag.toLowerCase());
      return matchesSearch && matchesTag;
    })
    .sort((a, b) => {
      if (sortBy === "wait") return a.estimatedWaitTime - b.estimatedWaitTime;
      if (sortBy === "queue") return a.queueLength - b.queueLength;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <div className="min-h-screen w-full bg-[#feffe0] text-gray-800 relative overflow-x-hidden flex flex-col items-center">
      <div className="container mx-auto mt-36 md:mt-40 px-4 max-w-[1400px] relative z-10 flex flex-col items-center">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-gray-900 mb-1">
            Find <span className="text-[#10b981]">Queue</span>
          </h1>
        </div>

        <div className="w-full max-w-4xl flex flex-col md:flex-row gap-3 mb-6 items-center justify-center">
          <div className="relative w-full md:w-2/3 group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search offices..."
              value={searchQuery}
              onChange={event => setSearchQuery(event.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm outline-none focus:border-emerald-400 font-bold text-sm transition-all"
            />
          </div>

          <div className="w-full md:w-1/3">
            <select
              value={sortBy}
              onChange={event => setSortBy(event.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm font-black text-xs text-emerald-600 outline-none cursor-pointer"
            >
              <option value="default">SORT BY: RELEVANCE</option>
              <option value="wait">SORT BY: WAIT TIME (LOW)</option>
              <option value="queue">SORT BY: QUEUE SIZE (SMALL)</option>
              <option value="name">SORT BY: NAME (A-Z)</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-10 overflow-x-auto py-1 max-w-full">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveTag(category)}
              className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider transition-all border-2 ${
                activeTag === category
                  ? "bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-200"
                  : "bg-white border-gray-100 text-gray-400 hover:border-emerald-200 hover:text-emerald-600"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <motion.div layout className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-20">
          <AnimatePresence mode="popLayout">
            {processedOffices.map(office => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={office._id}
              >
                <ElectricBorder color="#d8fbe8" borderRadius={24} speed={0.95} chaos={0.07} className="rounded-[1.5rem]">
                  <div className="group bg-white border border-gray-100 rounded-[1.5rem] p-5 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all duration-300 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1 truncate">
                        <h3 className="text-lg font-black text-gray-900 group-hover:text-emerald-600 transition-colors truncate">{office.name}</h3>
                        <p className="text-[10px] font-black text-gray-400 uppercase">{office.location}</p>
                      </div>
                      <div className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded-lg text-[10px] font-black border border-emerald-100">
                        #{office.currentToken}
                      </div>
                    </div>

                    <div className="flex gap-2 mb-6">
                      <div className="flex-1 bg-gray-50 rounded-xl p-2 text-center">
                        <span className="text-[9px] font-black text-gray-400 block uppercase">Wait</span>
                        <span className="text-sm font-black text-emerald-600">{office.estimatedWaitTime}m</span>
                      </div>
                      <div className="flex-1 bg-gray-50 rounded-xl p-2 text-center">
                        <span className="text-[9px] font-black text-gray-400 block uppercase">People</span>
                        <span className="text-sm font-black text-gray-800">{office.queueLength}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        window.location.href = localStorage.getItem("token") ? "/joinqueue" : "/login";
                      }}
                      className="mt-auto w-full py-2.5 rounded-xl bg-gray-900 text-white font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all active:scale-95"
                    >
                      Join Queue
                    </button>
                  </div>
                </ElectricBorder>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {processedOffices.length === 0 && (
          <div className="text-center py-20 bg-white/50 rounded-3xl w-full border border-dashed border-gray-200">
            <h2 className="text-xl font-black text-gray-300">NO RESULTS FOUND</h2>
          </div>
        )}
      </div>

      <style>{`
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-thumb { background: #10b981; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default Search;
