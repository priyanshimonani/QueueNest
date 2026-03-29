import React, { useState, useEffect } from "react";
import { Repeat, Check, X, Sparkles } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";

/* ---------------- MOCK DATA ---------------- */

const swapsRemaining = 1;

const initialOpenSwapRequests = [
  {
    id: "1",
    name: "David Lee",
    token: 29,
    message: "Need to leave early for appointment",
    positionDiff: 2,
    time: "5 mins ago",
  },
  {
    id: "2",
    name: "Aisha Khan",
    token: 30,
    message: "Can come back in 30 mins",
    positionDiff: 1,
    time: "2 mins ago",
  }
];

const yourRequests = [
  {
    id: "3",
    name: "Rahul",
    token: 27,
    status: "Pending"
  }
];

/* ---------------- COMPONENT ---------------- */

export function TokenSwap() {

  const [activeTab, setActiveTab] = useState("open");
  const [acceptedSwap, setAcceptedSwap] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [myRequests, setMyRequests] = useState(yourRequests);
  const [openRequests, setOpenRequests] = useState(initialOpenSwapRequests);

  // Initialize yourToken from location state or default, and manage it in state
  const [currentToken, setCurrentToken] = useState(location.state?.sourceToken || 31);

  useEffect(() => {
    if (location.state?.newRequest) {
      const newReq = {
        id: Date.now().toString(), // simplistic unique id
        name: "You (Demo)",
        token: Math.floor(Math.random() * 20) + 10,
        status: "Pending",
        message: location.state.newRequest.message
      };
      setMyRequests(prev => [...prev, newReq]);
      setActiveTab("your");

      // Clear state to prevent adding duplicate on re-render/refresh loop if logic was different
      // navigate(location.pathname, { replace: true, state: {} });
      // Actually, calling navigate here causes a re-render. 
      // Ensuring we simply consume it is enough if we don't persist it. 
      // But to be clean:
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

  const handleAccept = (request) => {
    // 1. Swap tokens: User gets the requester's token (request.token)
    // The requester presumably gets the user's old token (currentToken), though we only show user's perspective here.
    const newRequestToken = request.token; // The token user is accepting to take

    // Update local state to show new token
    setAcceptedSwap(newRequestToken);
    setCurrentToken(newRequestToken);

    // 2. Remove the request from the list
    setOpenRequests(prev => prev.filter(r => r.id !== request.id));

    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleDecline = (id) => {
    setOpenRequests(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#feffe0] via-yellow-50 to-green-100 pt-24 px-6 text-gray-800">

      {/* Header */}
      <div className="text-center mb-10">
        <Repeat size={40} className="mx-auto mb-3 text-[#10b981]" />
        <h1 className="text-4xl font-bold text-gray-900">Token Swap</h1>
        <p className="text-gray-500">
          Exchange positions with consent and transparency
        </p>
      </div>

      {/* Token Card */}
      <div className="max-w-5xl mx-auto bg-white/70 backdrop-blur border border-white rounded-3xl p-6 mb-8 flex justify-between items-center shadow-md">

        <div>
          <p className="text-gray-500 text-sm">Your Current Token</p>
          <h2 className="text-4xl font-bold text-gray-900">#{currentToken}</h2>
        </div>

        <div className="text-right">
          <p className="flex items-center gap-2 text-sm text-gray-500">
            <Sparkles size={16} /> Swaps Remaining Today
          </p>
          <div className="mt-2 bg-[#10b981] text-white w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold">
            {swapsRemaining}
          </div>
        </div>

      </div>

      {/* Tabs */}
      <div className="max-w-5xl mx-auto flex gap-4 mb-8">

        <button
          onClick={() => setActiveTab("open")}
          className={`flex-1 py-3 rounded-2xl font-semibold transition ${activeTab === "open"
            ? "bg-white shadow"
            : "bg-white/60 hover:bg-white"
            }`}
        >
          Open Swap Requests
        </button>

        <button
          onClick={() => setActiveTab("your")}
          className={`flex-1 py-3 rounded-2xl font-semibold transition relative ${activeTab === "your"
            ? "bg-white shadow"
            : "bg-white/60 hover:bg-white"
            }`}
        >
          Your Requests
          {myRequests.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 w-6 h-6 rounded-full text-xs text-white flex items-center justify-center">
              {myRequests.length}
            </span>
          )}
        </button>

      </div>

      {/* OPEN REQUESTS */}
      {activeTab === "open" && (
        <div className="max-w-5xl mx-auto space-y-4">

          {openRequests.map((req) => (
            <div
              key={req.id}
              className="bg-white/70 backdrop-blur border border-white rounded-3xl p-6 flex justify-between items-center shadow-sm hover:shadow-md transition"
            >

              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-semibold">{req.name}</h3>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                    PENDING
                  </span>
                </div>

                <p className="text-sm text-gray-500">
                  Token #{req.token} → Your Token #{currentToken}
                </p>

                <p className="text-sm text-gray-500">
                  Position change: {req.positionDiff} places forward
                </p>

                <p className="text-sm text-gray-400">{req.time}</p>

                <div className="bg-gray-100 rounded-xl px-4 py-2 mt-3 italic text-sm">
                  "{req.message}"
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleAccept(req)}
                  className="bg-[#10b981] hover:bg-emerald-600 text-white px-5 py-2 rounded-xl flex items-center gap-2"
                >
                  <Check size={16} /> Accept
                </button>

                <button
                  onClick={() => handleDecline(req.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl flex items-center gap-2"
                >
                  <X size={16} /> Decline
                </button>
              </div>

            </div>
          ))}

        </div>
      )}

      {/* YOUR REQUESTS */}
      {activeTab === "your" && (
        <div className="max-w-5xl mx-auto space-y-4">

          {myRequests.map((req) => (
            <div
              key={req.id}
              className="bg-white/70 backdrop-blur border border-white rounded-3xl p-6 flex justify-between items-center shadow-sm"
            >
              <div>
                <h3 className="font-semibold text-lg text-gray-800">
  Swap Request → Token #{req.token || "--"}
</h3>
                <p className="text-sm text-gray-500 mt-1">
  Waiting for response
</p>
                <button className="text-xs text-red-500 mt-3 hover:underline">
  Cancel request
</button>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                Pending
              </span>
            </div>
          ))}

        </div>
      )}

      {/* Success Modal */}
      {acceptedSwap && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 text-center w-80 shadow-xl">
            <Check size={50} className="mx-auto text-[#10b981] mb-3" />
            <h2 className="text-xl font-bold">Swap Accepted</h2>
            <p className="text-gray-500 mb-4">
              Your new token: #{acceptedSwap}
            </p>

            <button
              onClick={() => setAcceptedSwap(null)}
              className="bg-[#10b981] text-white px-6 py-2 rounded-lg hover:bg-emerald-600"
            >
              Continue
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
