import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import confetti from "canvas-confetti"
import ElectricBorder from "../components/ElectricBorder"

export function JoinQueue() {

  const [currentToken, setCurrentToken] = useState(142)
  const yourToken = 148
  const [showSwap, setShowSwap] = useState(false)
  const [showLeave, setShowLeave] = useState(false)

  const navigate = useNavigate()
  const [swapMessage, setSwapMessage] = useState("")

  const handleSwapRequest = () => {
    // In a real application, you would send the swap request to the backend here
    console.log("Sending swap request:", swapMessage);

    // Simulating API call
    setTimeout(() => {
      setShowSwap(false);
      // Navigate to the Token Swap page, optionally passing the message if needed
      navigate('/tokenswap', {
        state: {
          newRequest: { message: swapMessage, timestamp: new Date() },
          sourceToken: yourToken
        }
      });
    }, 500);
  };

  const peopleAhead = Math.max(yourToken - currentToken, 0)
  const estimatedWait = peopleAhead * 3
  const isYourTurn = currentToken >= yourToken

  /* Simulated Queue Movement */
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentToken(prev =>
        prev < yourToken ? prev + 1 : prev
      )
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  /* Confetti when turn */
  useEffect(() => {
    if (isYourTurn) {
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 }
      })
    }
  }, [isYourTurn])

  /* Progress Calculation */
  const progress =
    ((yourToken - currentToken) / (yourToken - (yourToken - 20))) * 100

  const getStatusMessage = () => {
    if (isYourTurn) return "🎉 It's your turn! Please proceed."
    if (peopleAhead <= 2) return "⚡ Almost your turn. Please be nearby."
    if (peopleAhead <= 5) return "⏳ You're getting close."
    return "🕒 Sit back and relax."
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#feffe0] via-yellow-50 to-orange-50  pt-24 px-6 relative overflow-hidden text-gray-800">

      {/* Background Blobs */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob -z-10"></div>
      <div className="fixed top-0 right-0 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000 -z-10"></div>
      <div className="fixed -bottom-32 left-20 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000 -z-10"></div>

      {/* Sticky Bar */}


      <div className="max-w-4xl mx-auto relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="inline-block p-3 rounded-2xl bg-white/40 backdrop-blur-md border border-white/60 shadow-sm mb-4 mt-10">
            <svg className="w-8 h-8 text-[#10b981] mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 mb-2">
            SBI Main Branch
          </h1>
          <p className="text-gray-500 font-medium text-lg">
            Mumbai
          </p>
        </motion.div>

        {/* Token Card */}
        <ElectricBorder color="#b8f2df" borderRadius={40} speed={0.9} chaos={0.08} className="rounded-[2.5rem] mb-8">
        <motion.div
          layout
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`relative bg-white/60 backdrop-blur-2xl border border-white/60 rounded-[2.5rem] p-8 text-center shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] overflow-hidden group transition-all duration-500 ${isYourTurn ? "ring-4 ring-emerald-400/30" : ""}`}
        >
          {/* Subtle glow behind number */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-emerald-400/20 blur-[60px] rounded-full group-hover:bg-emerald-400/30 transition-all duration-700"></div>

          <p className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-3">
  Now Serving
</p>

<div className="text-3xl font-bold text-gray-700 mb-2">
  #{currentToken}
</div>

<motion.div
  key={currentToken}
  initial={{ scale: 0.9, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  className={`relative text-7xl font-black mb-6 tracking-tight ${
    isYourTurn ? "text-emerald-600" : "text-gray-800"
  }`}
>
  #{yourToken}
</motion.div>

{isYourTurn && (
  <div className="inline-block px-5 py-2 rounded-full bg-emerald-100 text-emerald-700 font-bold text-lg animate-pulse">
    👉 Your Turn!
  </div>
)}

          {/* Fancy Progress Bar */}
          <div className="relative w-full h-3 bg-gray-200/50 rounded-full overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full stripe-pattern"
              initial={{ width: 0 }}
              animate={{ width: `${100 - progress}%` }}
              transition={{ type: "spring", stiffness: 50 }}
            />
          </div>
          <div className="flex justify-between text-xs font-bold text-gray-400 mt-3 px-1">
            <span>Queue Started</span>
            <span>Your Turn</span>
          </div>

        </motion.div>
        </ElectricBorder>

        {/* Status Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-12"
        >
          <span className={`inline-block px-6 py-3 rounded-full text-lg font-bold shadow-md transition-all ${
  isYourTurn
    ? "bg-emerald-500 text-white animate-bounce"
    : "bg-white/70 text-gray-700"
}`}>
  {getStatusMessage()}
</span>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            { label: "Now Serving", value: `#${currentToken}`, icon: "📢" },
  { label: "People Ahead", value: peopleAhead === 0 ? "None" : peopleAhead, icon: "👥" },
  { label: "Wait Time", value: peopleAhead === 0 ? "No wait" : `${estimatedWait} min`, icon: "⏱️" }
          ].map((item, index) => (
            <ElectricBorder
              key={index}
              color={index === 0 ? "#b8f2df" : index === 1 ? "#d8fbe8" : "#ffe483"}
              borderRadius={24}
              speed={1}
              chaos={0.07}
              className="rounded-2xl"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/60 backdrop-blur-lg border border-white/60 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                  {item.label}
                </div>
                <div className="text-3xl font-bold text-gray-800">
                  {item.value}
                </div>
              </motion.div>
            </ElectricBorder>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 pb-20">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowSwap(true)}
            className="px-8 py-3.5 bg-white text-[#10b981] border-2 border-[#10b981] rounded-xl font-bold text-lg shadow-sm hover:bg-[#10b981] hover:text-white transition-colors"
          >
            Request Swap
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowLeave(true)}
            className="px-8 py-3.5 bg-red-50 text-red-500 border-2 border-red-100 rounded-xl font-bold text-lg shadow-sm hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors"
          >
            Leave Queue
          </motion.button>
        </div>

      </div>

      {/* Modals with AnimatePresence */}
      <AnimatePresence>
        {showSwap && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSwap(false)}
              className="absolute inset-0 bg-gray-900/20 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl"
            >
              <h2 className="text-2xl font-bold mb-2 text-gray-800">Request Swap</h2>
              <p className="text-gray-500 mb-6 text-sm">Ask someone ahead to swap positions.</p>

              <textarea
                placeholder="Ex: I'm running 5 mins late, can we swap?"
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl mb-6 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#10b981] resize-none h-32"
                value={swapMessage}
                onChange={(e) => setSwapMessage(e.target.value)}
              />

              <div className="flex gap-3">
                <button
                  onClick={() => setShowSwap(false)}
                  className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSwapRequest}
                  className="flex-1 py-3 bg-[#10b981] text-white rounded-xl font-bold shadow-lg shadow-green-200 hover:bg-emerald-600 transition-colors"
                >
                  Send Request
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {showLeave && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLeave(false)}
              className="absolute inset-0 bg-gray-900/20 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl text-center"
            >
              <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              </div>
              <h2 className="text-2xl font-bold mb-2 text-gray-800">Leave Queue?</h2>
              <p className="text-gray-500 mb-8 text-sm">You will lose your spot and have to start over.</p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowLeave(false)}
                  className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-xl transition-colors"
                >
                  Stay
                </button>
                <button className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold shadow-lg shadow-red-200 hover:bg-red-600 transition-colors">
                  Confirm
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
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
      `}</style>
    </div>
  )
}
