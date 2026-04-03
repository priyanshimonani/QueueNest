import React, { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Bell,
  CheckCircle2,
  Clock3,
  Info,
  Sparkles
} from "lucide-react";
import CurvedLoop from "../components/CurvedLoop";

const API_BASE = "http://localhost:8080/api";

const typeStyles = {
  info: {
    icon: Info,
    iconWrap: "bg-sky-100 text-sky-600",
    ring: "border-sky-200"
  },
  success: {
    icon: CheckCircle2,
    iconWrap: "bg-emerald-100 text-emerald-600",
    ring: "border-emerald-200"
  },
  warning: {
    icon: Clock3,
    iconWrap: "bg-amber-100 text-amber-600",
    ring: "border-amber-200"
  },
  alert: {
    icon: AlertCircle,
    iconWrap: "bg-rose-100 text-rose-500",
    ring: "border-rose-200"
  }
};

const formatRelativeTime = (dateString) => {
  const timestamp = new Date(dateString).getTime();
  const diff = Date.now() - timestamp;
  const minutes = Math.max(1, Math.floor(diff / 60000));

  if (minutes < 60) {
    return `${minutes} min${minutes === 1 ? "" : "s"} ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }

  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
};

export default function Notifications() {
  const token = localStorage.getItem("token");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const authHeaders = useMemo(
    () =>
      token
        ? {
            Authorization: `Bearer ${token}`
          }
        : null,
    [token]
  );

  const fetchNotifications = async () => {
    if (!authHeaders) {
      setError("Please login to view your notifications.");
      setLoading(false);
      return;
    }

    try {
      setError("");
      const response = await fetch(`${API_BASE}/queue/notifications`, {
        headers: authHeaders
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.message || "Unable to load notifications");
      }

      setNotifications(Array.isArray(payload) ? payload : []);
    } catch (nextError) {
      setError(nextError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [token]);

  useEffect(() => {
    if (!authHeaders) return undefined;

    const interval = setInterval(fetchNotifications, 8000);
    return () => clearInterval(interval);
  }, [authHeaders]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fefce8] via-[#fffdf4] to-[#ecfdf5] px-6 pb-20 pt-28 text-gray-900">
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="notificationsGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="36%" stopColor="#0f172a" />
            <stop offset="44%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
      </svg>
      <div className="mx-auto max-w-5xl">
        <header className="mb-10 rounded-[2.75rem] border border-white/70 bg-white/80 px-8 py-8 shadow-[0_20px_60px_rgba(16,185,129,0.08)] backdrop-blur-xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-[11px] font-black uppercase tracking-[0.25em] text-emerald-700">
            <Sparkles className="h-4 w-4" />
            Alerts Center
          </div>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="w-full max-w-3xl title1">
                Notifications
              </div>
              <p className="mt-3 text-sm font-medium text-gray-500 md:text-base">
                Queue updates, swap confirmations, and important alerts appear here.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-2xl bg-gray-900 px-4 py-3 text-sm font-black text-white">
              <Bell className="h-4 w-4" />
              {notifications.length} updates
            </div>
          </div>
        </header>

        {error ? (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        ) : null}

        <section className="space-y-5">
          {loading ? (
            [1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-36 animate-pulse rounded-[2rem] border border-white/80 bg-white/70 shadow-sm"
              />
            ))
          ) : notifications.length ? (
            notifications.map((notification, index) => {
              const style = typeStyles[notification.type] ?? typeStyles.info;
              const Icon = style.icon;
              const highlighted = index === 0;

              return (
                <article
                  key={notification._id}
                  className={`rounded-[2rem] border bg-white/90 p-6 shadow-sm transition hover:shadow-lg ${
                    highlighted ? style.ring : "border-gray-100"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${style.iconWrap}`}>
                      <Icon className="h-6 w-6" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h2 className="text-2xl font-black text-gray-900">
                            {notification.title}
                          </h2>
                          <p className="mt-2 text-base text-gray-500">
                            {notification.message}
                          </p>
                          {notification.organizationName ? (
                            <p className="mt-2 text-xs font-black uppercase tracking-[0.18em] text-gray-400">
                              {notification.organizationName}
                              {notification.organizationLocation
                                ? ` • ${notification.organizationLocation}`
                                : ""}
                            </p>
                          ) : null}
                        </div>

                        {highlighted ? (
                          <div className="mt-1 h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(16,185,129,0.65)]" />
                        ) : null}
                      </div>

                      <div className="mt-4 flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-gray-400">
                        <Clock3 className="h-3.5 w-3.5" />
                        {formatRelativeTime(notification.createdAt)}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="rounded-[2rem] border border-dashed border-emerald-200 bg-white/70 p-10 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <Bell className="h-7 w-7" />
              </div>
              <h2 className="text-2xl font-black text-gray-900">No notifications yet</h2>
              <p className="mt-3 text-sm font-medium text-gray-500">
                When you join a queue or receive queue updates, they will appear here.
              </p>
            </div>
          )}
        </section>
      </div>
      <style>{`
        .curved-loop-notifications {
          fill: url(#notificationsGradient);
          font-size: clamp(2.5rem, 7vw, 5rem);
          letter-spacing: -0.06em;
          font-weight: 900;
          text-transform: none;
        }
      `}</style>
    </div>
  );
}
