import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import CurvedLoop from "../components/CurvedLoop";
import ElectricBorder from "../components/ElectricBorder";

const API_BASE = "http://localhost:8080/api";
const categories = ["All", "Bank", "Hospital", "Government", "Education", "Utilities"];

const getCategory = (name = "") => {
  const value = name.toLowerCase();
  if (value.includes("bank") || value.includes("sbi") || value.includes("hdfc") || value.includes("icici")) return "Bank";
  if (value.includes("hospital") || value.includes("clinic")) return "Hospital";
  if (value.includes("passport") || value.includes("rto")) return "Government";
  if (value.includes("university")) return "Education";
  if (value.includes("electricity")) return "Utilities";
  return "All";
};

const Search = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [offices, setOffices] = useState([]);

  useEffect(() => {
    const fetchOffices = async () => {
      try {
        const response = await fetch(`${API_BASE}/queue/organizations`);
        const data = await response.json();
        setOffices(Array.isArray(data) ? data : []);
      } catch {
        setOffices([]);
      }
    };

    fetchOffices();
  }, []);

  const processedOffices = useMemo(() => {
    return offices
      .map((office) => ({ ...office, category: getCategory(office.name) }))
      .filter((office) => {
        const matchesSearch =
          office.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          office.location.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTag = activeTag === "All" || office.category === activeTag;
        return matchesSearch && matchesTag;
      })
      .sort((a, b) => {
        if (sortBy === "wait") return a.estimatedWaitTime - b.estimatedWaitTime;
        if (sortBy === "queue") return a.queueLength - b.queueLength;
        if (sortBy === "name") return a.name.localeCompare(b.name);
        return 0;
      });
  }, [activeTag, offices, searchQuery, sortBy]);

  const handleJoin = (officeId) => {
    const destination = `/joinqueue?organizationId=${encodeURIComponent(officeId)}`;
    const token = localStorage.getItem("token");

    if (token) {
      navigate(destination);
      return;
    }

    navigate(`/login?redirect=${encodeURIComponent(destination)}`);
  };

  return (
    <div className="min-h-screen w-full bg-[#feffe0] text-gray-800 relative overflow-x-hidden flex flex-col items-center">
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="findQueueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#111827" />
            <stop offset="45%" stopColor="#111827" />
            <stop offset="55%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
      </svg>
      <div className="container mx-auto mt-36 md:mt-40 px-4 max-w-[1400px] relative z-10 flex flex-col items-center">
        <div className="text-center mb-8">
          <div className="mx-auto w-full max-w-4xl">
            <CurvedLoop
              marqueeText="Find Queue"
              speed={1.3}
              curveAmount={80}
              interactive={false}
              jacketClassName="min-h-0"
              className="curved-loop-find"
            />
          </div>
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
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm outline-none focus:border-emerald-400 font-bold text-sm transition-all"
            />
          </div>

          <div className="w-full md:w-1/3">
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
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
          {categories.map((category) => (
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
            {processedOffices.map((office) => (
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
                        #{office.currentToken || 0}
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
                      onClick={() => handleJoin(office._id)}
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
      </div>
      <style>{`
        .curved-loop-find {
          fill: url(#findQueueGradient);
          font-size: clamp(2.8rem, 8vw, 6rem);
          letter-spacing: -0.06em;
          font-weight: 900;
          text-transform: none;
        }
      `}</style>
    </div>
  );
};

export default Search;
