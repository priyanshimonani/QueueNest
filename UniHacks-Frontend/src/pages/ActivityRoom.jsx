import React, { useState, useEffect, useRef } from "react"
import axios from "axios"

export default function ActivityRoom() {
  /* ---------------- LOGIC (UNCHANGED) ---------------- */
  const mockNewsData = [
    { title: "Major drug bust in city center; 3 arrested", description: "Police seized 50kg of narcotics in a raid conducted late last night.", link: "#", source_id: "local_news" },
    { title: "Cybercrime unit warns of new phishing scam", description: "A sophisticated phishing campaign targeting bank customers has been identified.", link: "#", source_id: "tech_daily" },
    { title: "Traffic alert: Highway 402 cleared", description: "Normal traffic flow has resumed after the morning incident.", link: "#", source_id: "traffic_alert" }
  ];

  const [newsData, setNewsData] = useState([])
  const [loadingNews, setLoadingNews] = useState(true)
  const [selectedLanguage, setSelectedLanguage] = useState("en")
  const [selectedNews, setSelectedNews] = useState(null)
  const languages = [{ code: "en", label: "EN" }, { code: "hi", label: "HI" }, { code: "kn", label: "KN" }, { code: "ml", label: "ML" }, { code: "mr", label: "MR" }]

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get("https://newsdata.io/api/1/news", {
          params: { apikey: "pub_e3c662ea415f4da9b9c76a5f7e1d4ec7", q: "news", country: "in", language: selectedLanguage }
        })
        setNewsData(res.data.results || mockNewsData)
      } catch (err) { setNewsData(mockNewsData) } finally { setLoadingNews(false) }
    }
    fetchNews()
  }, [selectedLanguage])

  const [board, setBoard] = useState(Array(9).fill(null))
  const [winner, setWinner] = useState(null)
  const calculateWinner = (s) => {
    const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]
    for (let l of lines) { const [a,b,c] = l; if (s[a] && s[a] === s[b] && s[a] === s[c]) return s[a] }
    return null
  }
  const handleMove = (i) => {
    if (board[i] || winner) return
    const nb = [...board]; nb[i] = "X"; setBoard(nb)
    const win = calculateWinner(nb)
    if (win) return setWinner(win)
    const empty = nb.map((v, i) => v === null ? i : null).filter(v => v !== null)
    if (empty.length === 0) return
    nb[empty[Math.floor(Math.random() * empty.length)]] = "O"
    setBoard([...nb]); const bWin = calculateWinner(nb); if (bWin) setWinner(bWin)
  }

  const [memoryCards] = useState([...["🍎", "🍌", "🍇", "🍒", "🍉", "🥝", "🍍", "🍑"], ...["🍎", "🍌", "🍇", "🍒", "🍉", "🥝", "🍍", "🍑"]].sort(() => Math.random() - 0.5))
  const [flipped, setFlipped] = useState([]); const [matched, setMatched] = useState([])
  const handleFlip = (i) => {
    if (flipped.length === 2 || flipped.includes(i) || matched.includes(i)) return
    const nf = [...flipped, i]; setFlipped(nf)
    if (nf.length === 2) {
      if (memoryCards[nf[0]] === memoryCards[nf[1]]) setMatched([...matched, ...nf])
      setTimeout(() => setFlipped([]), 800)
    }
  }

  const [num1] = useState(Math.floor(Math.random() * 10)); const [num2] = useState(Math.floor(Math.random() * 10))
  const [answer, setAnswer] = useState(""); const [mathResult, setMathResult] = useState("")
  const checkMath = () => setMathResult(parseInt(answer) === num1 + num2 ? "✅ Correct!" : "❌ Try Again!")

  const choices = ["Rock", "Paper", "Scissors"]; const [rpsResult, setRpsResult] = useState("")
  const playRPS = (c) => {
    const b = choices[Math.floor(Math.random() * 3)];
    if (c === b) setRpsResult(`Draw! (Bot: ${b})`);
    else if ((c === "Rock" && b === "Scissors") || (c === "Paper" && b === "Rock") || (c === "Scissors" && b === "Paper")) setRpsResult(`Win! (Bot: ${b})`);
    else setRpsResult(`Lost! (Bot: ${b})`);
  }

  const Modal = ({ news }) => {
    const speechRef = useRef(new SpeechSynthesisUtterance())
    const startSpeech = () => {
      speechRef.current.text = news.description || "No description available."
      speechRef.current.lang = selectedLanguage === "hi" ? "hi-IN" : "en-US"
      window.speechSynthesis.speak(speechRef.current)
    }
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-fade-in">
        <div className="bg-white p-6 rounded-3xl w-full max-w-md shadow-2xl relative">
          <button onClick={() => {window.speechSynthesis.cancel(); setSelectedNews(null)}} className="absolute top-4 right-5 text-2xl text-gray-400 hover:text-red-500 transition-colors">×</button>
          <h2 className="text-xl font-bold mb-3 pr-6 text-gray-900 leading-tight">{news.title}</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-6 line-clamp-6">{news.description || "No preview available."}</p>
          <div className="flex gap-3">
            <button onClick={startSpeech} className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition">🔊 Listen</button>
            <button onClick={() => window.speechSynthesis.cancel()} className="px-4 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold">Stop</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fefcf0] p-4 md:p-8 selection:bg-emerald-200">
      
      {/* Condensed Header */}
      <header className="max-w-[1600px] mx-auto flex justify-between items-end mb-10 mt-16">
        <div className="text-left">
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-gray-900 leading-none">
            Activity <span className="text-emerald-600">Room</span>
          </h1>
          <p className="text-gray-500 font-bold text-sm mt-1">Wait smart. Play hard.</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-xl border border-gray-200 shadow-sm">
            <span className="text-[10px] font-black text-gray-400">LANG</span>
            <select value={selectedLanguage} onChange={(e) => {setLoadingNews(true); setSelectedLanguage(e.target.value)}} className="bg-transparent font-black text-emerald-600 text-sm outline-none cursor-pointer">
                {languages.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
            </select>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* LEFT COLUMN: Games Grid (8/12 space) */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Tic Tac Toe - Condense Horizontal */}
          <div className="md:col-span-2 p-5 rounded-[2rem] bg-emerald-50 border-2 border-emerald-100 flex items-center justify-between shadow-sm">
            <div className="flex-1">
                <h3 className="text-xl font-black text-emerald-900 mb-1">Tic Tac Toe</h3>
                <p className="text-xs text-emerald-700 font-bold mb-3">X vs Bot</p>
                {winner ? (
                  <button onClick={() => {setBoard(Array(9).fill(null)); setWinner(null)}} className="bg-emerald-600 text-white text-xs px-4 py-2 rounded-full font-black shadow-md hover:bg-emerald-700">{winner} Wins! Restart</button>
                ) : (
                  <span className="text-[10px] bg-white/60 px-2 py-1 rounded text-emerald-800 font-black">X TURN</span>
                )}
            </div>
            <div className="grid grid-cols-3 gap-2 w-48 shrink-0">
              {board.map((v, i) => (
                <button key={i} onClick={() => handleMove(i)} className={`h-14 rounded-xl text-xl font-black transition-all ${!v ? 'bg-white/80 hover:bg-white text-emerald-900' : 'bg-emerald-600 text-white'}`}>{v}</button>
              ))}
            </div>
          </div>

          {/* Quick Math */}
          <div className="p-5 rounded-[2rem] bg-amber-50 border-2 border-amber-100 flex flex-col justify-between">
            <h3 className="text-lg font-black text-amber-900 mb-2">Quick Math</h3>
            <div className="bg-white/80 p-3 rounded-2xl text-2xl font-black text-center text-amber-900 mb-3 border border-amber-200">
                {num1} + {num2}
            </div>
            <div className="flex gap-2">
                <input value={answer} onChange={(e) => setAnswer(e.target.value)} className="w-full bg-white border-2 border-amber-200 rounded-xl p-2 text-center text-sm font-black outline-none focus:border-amber-500" placeholder="?" />
                <button onClick={checkMath} className="bg-amber-600 text-white px-4 rounded-xl font-black hover:bg-amber-700 transition text-sm">Go</button>
            </div>
            <div className={`mt-2 text-center text-[10px] font-black ${mathResult.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>{mathResult}</div>
          </div>

          {/* Memory Match */}
          <div className="p-5 rounded-[2rem] bg-indigo-50 border-2 border-indigo-100 flex flex-col">
            <h3 className="text-lg font-black text-indigo-900 mb-3">Memory</h3>
            <div className="grid grid-cols-8 gap-1.5 flex-1">
              {memoryCards.map((card, i) => (
                <button key={i} onClick={() => handleFlip(i)} className={`aspect-square rounded-lg text-xs flex items-center justify-center transition-all shadow-sm ${flipped.includes(i) || matched.includes(i) ? 'bg-white' : 'bg-indigo-600 text-transparent hover:bg-indigo-500'}`}>
                  {flipped.includes(i) || matched.includes(i) ? card : "?"}
                </button>
              ))}
            </div>
          </div>

          {/* RPS */}
          <div className="md:col-span-2 p-5 rounded-[2rem] bg-rose-50 border-2 border-rose-100 flex items-center justify-between gap-4">
            <div className="flex-1">
                <h3 className="text-xl font-black text-rose-900">Battle RPS</h3>
                <div className="text-[10px] font-black text-rose-600 mt-1 uppercase tracking-wider">{rpsResult || "Choose weapon!"}</div>
            </div>
            <div className="flex gap-2">
              {choices.map(c => (
                <button key={c} onClick={() => playRPS(c)} className="w-14 h-14 rounded-2xl bg-white border-2 border-rose-100 hover:bg-rose-600 hover:text-white transition-all shadow-sm flex flex-col items-center justify-center gap-1">
                   <span className="text-xl">{c === "Rock" ? "🪨" : c === "Paper" ? "📄" : "✂️"}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: News Feed Sidebar (4/12 space) */}
        <div className="lg:col-span-4 bg-white rounded-[2rem] border border-gray-100 shadow-sm flex flex-col h-[600px] overflow-hidden">
          <div className="p-5 border-b flex justify-between items-center bg-gray-50/50">
            <h2 className="text-xl font-black text-gray-900">Live Feed</h2>
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {loadingNews ? (
              <div className="flex flex-col gap-3">
                 {[1,2,3,4,5].map(i => <div key={i} className="h-20 bg-gray-50 animate-pulse rounded-2xl"></div>)}
              </div>
            ) : (
              newsData.map((item, i) => (
                <div key={i} onClick={() => setSelectedNews(item)} className="p-4 rounded-2xl bg-gray-50/50 hover:bg-emerald-50 border border-transparent hover:border-emerald-100 transition-all cursor-pointer group">
                  <div className="text-[9px] font-black uppercase text-emerald-500 mb-1">{item.source_id || 'Global'}</div>
                  <h4 className="text-sm font-bold text-gray-900 leading-snug group-hover:text-emerald-800 line-clamp-2">{item.title}</h4>
                </div>
              ))
            )}
          </div>
        </div>

      </main>

      <footer className="mt-8 text-center text-gray-400 font-bold text-xs pb-6">
        © 2025 QueueNest. Position tracked live.
      </footer>

      {selectedNews && <Modal news={selectedNews} />}

      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #10b981; }
      `}</style>
    </div>
  )
}