import React from "react";
import { Link } from "react-router-dom";
import ElectricBorder from "../components/ElectricBorder";
import {
  ArrowLeft,
  Bell,
  CheckCircle,
  Clock,
  AlertCircle,
  Repeat,
  Check
} from "lucide-react";

export default function Notifications() {

  // Mock Data
  const mockNotifications = [
    {
      id: 1,
      type: "turn_soon",
      title: "Your turn is near",
      message: "Only 3 people ahead of you. Please be ready.",
      time: "2 mins ago",
      read: false
    },
    {
      id: 2,
      type: "swap_success",
      title: "Swap successful",
      message: "Your token swap request has been accepted.",
      time: "10 mins ago",
      read: true
    },
    {
      id: 3,
      type: "queue_paused",
      title: "Queue paused",
      message: "The queue has been temporarily paused by admin.",
      time: "30 mins ago",
      read: true
    }
  ];

  // Helper to get styles based on type
  const getNotificationStyle = (type) => {
    switch (type) {
      case "swap_success":
      case "swap_accepted":
        return {
          icon: <CheckCircle className="w-6 h-6" />,
          colorClass: "text-[#10b981]",
          bgClass: "bg-emerald-100",
          borderClass: "group-hover:border-[#10b981]"
        };
      case "turn_soon":
        return {
          icon: <Clock className="w-6 h-6" />,
          colorClass: "text-amber-500",
          bgClass: "bg-amber-100",
          borderClass: "group-hover:border-amber-500"
        };
      case "queue_paused":
        return {
          icon: <AlertCircle className="w-6 h-6" />,
          colorClass: "text-red-500",
          bgClass: "bg-red-100",
          borderClass: "group-hover:border-red-500"
        };
      case "swap_request":
        return {
          icon: <Repeat className="w-6 h-6" />,
          colorClass: "text-purple-500",
          bgClass: "bg-purple-100",
          borderClass: "group-hover:border-purple-500"
        };
      default:
        return {
          icon: <Bell className="w-6 h-6" />,
          colorClass: "text-indigo-500",
          bgClass: "bg-indigo-100",
          borderClass: "group-hover:border-indigo-500"
        };
    }
  };

  return (
    <div className="min-h-screen pt-36 md:pt-40 pb-20 bg-gradient-to-br from-[#feffe0] via-yellow-50 to-orange-50 relative overflow-hidden font-sans text-gray-800">

      {/* Background Blobs */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob -z-10"></div>
      <div className="fixed top-0 right-0 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000 -z-10"></div>
      <div className="fixed -bottom-32 left-20 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000 -z-10"></div>

      <div className="max-w-[92rem] mx-auto px-6 md:px-10 relative z-10">

        {/* Header Section */}
        <div className="flex items-center justify-start mb-10">
          <div className="flex items-center gap-4">
             <Link to="/search">
              <button className="p-3 bg-white/60 backdrop-blur-md border border-white/60 rounded-xl hover:bg-white hover:shadow-md transition-all group">
                <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-gray-900" />
              </button>
            </Link>
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-none">Notifications</h1>
            </div>
          </div>
          
          
        </div>

        {/* Notifications List */}
        <div className="space-y-6">
          {mockNotifications.map((notification) => {
            const styles = getNotificationStyle(notification.type);
            
            return (
              <ElectricBorder
                key={notification.id}
                color={notification.type === "turn_soon" ? "#ffe483" : notification.type === "queue_paused" ? "#ffd7dd" : "#b8f2df"}
                borderRadius={28}
                speed={0.95}
                chaos={0.07}
                className="rounded-3xl"
              >
              <div
                className={`group relative w-full bg-white/70 backdrop-blur-xl border border-white/80 rounded-3xl p-6 md:p-7 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${!notification.read ? 'ring-2 ring-emerald-400/30' : ''}`}
              >
                {/* Unread Dot Indicator */}
                {!notification.read && (
                  <span className="absolute top-5 right-5 w-3 h-3 bg-[#10b981] rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></span>
                )}

                <div className="flex items-start gap-5">
                  
                  {/* Icon Box */}
                  <div className={`shrink-0 w-14 h-14 ${styles.bgClass} ${styles.colorClass} rounded-2xl flex items-center justify-center shadow-inner`}>
                    {styles.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-1">
                    <div className="flex justify-between items-start mb-1 pr-6">
                      <h3 className={`font-bold text-lg ${!notification.read ? 'text-gray-900' : 'text-gray-600'}`}>
                        {notification.title}
                      </h3>
                    </div>

                    <p className="text-gray-500 leading-relaxed text-sm mb-3">
                      {notification.message}
                    </p>

                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wide">
                      <Clock className="w-3 h-3" />
                      {notification.time}
                    </div>
                  </div>
                </div>
              </div>
              </ElectricBorder>
            );
          })}
        </div>

        {/* Empty State */}
        {mockNotifications.length === 0 && (
          <div className="bg-white/50 backdrop-blur-md rounded-[2.5rem] p-12 text-center mt-10 border border-white/50 shadow-lg">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
              🔔
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              All caught up!
            </h3>
            <p className="text-gray-500">
              You have no new notifications at the moment.
            </p>
          </div>
        )}

      </div>

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
  );
}
