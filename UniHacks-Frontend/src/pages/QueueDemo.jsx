import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRightLeft, Building2, CircleAlert, Clock3, Ticket, Users } from "lucide-react";

const API_BASE = "http://localhost:8080/api";

const QueueDemo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const eventSourceRef = useRef(null);

  const [organizations, setOrganizations] = useState([]);
  const [state, setState] = useState(null);
  const [swapMessage, setSwapMessage] = useState("");
  const [error, setError] = useState("");
  const [busyAction, setBusyAction] = useState("");

  const token = localStorage.getItem("token");
  const organizationId = new URLSearchParams(location.search).get("organizationId") || "";

  const authHeaders = token
    ? {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    : null;

  const selectedOrganization = useMemo(
    () => organizations.find((org) => org._id === organizationId) ?? null,
    [organizations, organizationId]
  );

  const fetchOrganizations = async () => {
    const response = await fetch(`${API_BASE}/queue/organizations`);
    const payload = await response.json();
    setOrganizations(Array.isArray(payload) ? payload : []);
  };

  const fetchState = async () => {
    if (!organizationId || !authHeaders) return;

    const response = await fetch(
      `${API_BASE}/queue/state?organizationId=${organizationId}`,
      { headers: authHeaders }
    );
    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.message || "Unable to load queue state");
    }

    setState(payload);
  };

  useEffect(() => {
    if (!token) {
      navigate(`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`, { replace: true });
      return;
    }

    if (!organizationId) {
      navigate("/search", { replace: true });
      return;
    }

    fetchOrganizations().catch((nextError) => setError(nextError.message));
    fetchState().catch((nextError) => setError(nextError.message));
  }, [token, organizationId, location.pathname, location.search, navigate]);

  useEffect(() => {
    if (!token || !organizationId) return undefined;

    const interval = setInterval(() => {
      fetchState().catch(() => {});
      fetchOrganizations().catch(() => {});
    }, 5000);

    return () => clearInterval(interval);
  }, [token, organizationId]);

  useEffect(() => {
    if (!token || !organizationId) return undefined;

    eventSourceRef.current?.close();
    const source = new EventSource(
      `${API_BASE}/queue/stream?organizationId=${organizationId}&token=${encodeURIComponent(token)}`
    );

    source.addEventListener("queue-state", (event) => {
      setState(JSON.parse(event.data));
    });

    source.onerror = () => source.close();
    eventSourceRef.current = source;

    return () => source.close();
  }, [organizationId, token]);

  const runAction = async (label, url, options = {}) => {
    if (!authHeaders) return;

    setBusyAction(label);
    setError("");

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...(options.body ? { "Content-Type": "application/json" } : {}),
          Authorization: authHeaders.Authorization
        }
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.message || "Action failed");
      }

      if (payload.state) {
        setState(payload.state);
      } else {
        await fetchState();
      }

      await fetchOrganizations();
      setSwapMessage("");
    } catch (nextError) {
      setError(nextError.message);
    } finally {
      setBusyAction("");
    }
  };

  const myEntry = state?.myEntry;
  const swapRequests = state?.swapRequests ?? [];
  const acceptedRequestsForMe = swapRequests.filter(
    (request) => String(request.requesterUserId) === String(myEntry?.userId)
  );
  const activeOrganization = state?.organization
    ? {
        ...selectedOrganization,
        ...state.organization,
        currentToken:
          state.organization.currentServingToken ?? selectedOrganization?.currentToken ?? 0,
        queueLength: state?.queue?.length ?? selectedOrganization?.queueLength ?? 0,
        estimatedWaitTime:
          (state?.queue?.length ?? selectedOrganization?.queueLength ?? 0) *
          (state.organization.avgWaitingTime ?? 0)
      }
    : selectedOrganization;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fefce8] via-[#fffdf4] to-[#ecfdf5] px-6 pb-20 pt-28 text-gray-900">
      <div className="mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-emerald-700 shadow-sm">
            <Building2 className="h-4 w-4" />
            Organization Queue
          </p>
          <h1 className="text-4xl font-black tracking-tight md:text-5xl">
            {selectedOrganization?.name || "Queue"}
          </h1>
          <p className="mt-3 max-w-3xl text-sm text-gray-600 md:text-base">
            Join this organization queue, track your token live, and swap within the allowed range.
          </p>
        </motion.div>

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            <CircleAlert className="h-4 w-4" />
            {error}
          </div>
        )}

        {activeOrganization && (
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <section className="space-y-6">
              <div className="rounded-[1.75rem] bg-white/85 p-6 shadow-sm">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => navigate("/search")}
                    className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm font-black text-gray-700"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Organizations
                  </button>
                  <div className="rounded-2xl bg-emerald-50 px-3 py-2 text-sm font-black text-emerald-700">
                    #{activeOrganization.currentToken || 0}
                  </div>
                </div>

                <div className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">
                  {activeOrganization.location}
                </div>
                <h2 className="mt-2 text-3xl font-black">{activeOrganization.name}</h2>

                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  <div className="rounded-2xl bg-gray-50 p-4">
                    <div className="text-xs font-bold uppercase tracking-[0.18em] text-gray-400">
                      Active Queue
                    </div>
                    <div className="mt-2 text-3xl font-black">
                      {activeOrganization.queueLength ?? 0}
                    </div>
                  </div>
                  <div className="rounded-2xl bg-gray-50 p-4">
                    <div className="text-xs font-bold uppercase tracking-[0.18em] text-gray-400">
                      Wait
                    </div>
                    <div className="mt-2 text-3xl font-black">
                      {activeOrganization.estimatedWaitTime ?? 0}m
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-[1.75rem] bg-white/80 p-5 shadow-sm">
                  <div className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Now Serving</div>
                  <div className="mt-3 text-5xl font-black text-emerald-700">
                    #{state?.organization?.currentServingToken ?? activeOrganization.currentToken ?? 0}
                  </div>
                </div>
                <div className="rounded-[1.75rem] bg-white/80 p-5 shadow-sm">
                  <div className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Your Token</div>
                  <div className="mt-3 text-5xl font-black">
                    {myEntry ? `#${myEntry.tokenNumber}` : "--"}
                  </div>
                </div>
                <div className="rounded-[1.75rem] bg-white/80 p-5 shadow-sm">
                  <div className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">People Ahead</div>
                  <div className="mt-3 text-5xl font-black">{myEntry?.peopleAhead ?? 0}</div>
                </div>
              </div>

              <div className="rounded-[2rem] bg-white/80 p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-black">Queue Actions</h2>
                    <p className="text-sm text-gray-500">
                      Token numbers are strictly sequential for this organization only.
                    </p>
                  </div>
                  <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
                    Swaps left: {myEntry?.swapsRemaining ?? 2}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      runAction("join", `${API_BASE}/queue/join`, {
                        method: "POST",
                        body: JSON.stringify({ organizationId })
                      })
                    }
                    disabled={!!myEntry || busyAction === "join"}
                    className="rounded-2xl bg-gray-900 px-5 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:bg-gray-300"
                  >
                    {busyAction === "join" ? "Joining..." : "Join Queue"}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      runAction("leave", `${API_BASE}/queue/leave`, {
                        method: "POST",
                        body: JSON.stringify({ organizationId })
                      })
                    }
                    disabled={!myEntry || busyAction === "leave"}
                    className="rounded-2xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-black text-red-700 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-400"
                  >
                    {busyAction === "leave" ? "Leaving..." : "Leave Queue"}
                  </button>
                </div>
              </div>

              <div className="rounded-[2rem] bg-white/80 p-6 shadow-sm">
                <div className="mb-5 flex items-center gap-3">
                  <Users className="h-5 w-5 text-emerald-600" />
                  <h2 className="text-xl font-black">Live Queue</h2>
                </div>
                <div className="space-y-3">
                  {(state?.queue ?? []).map((entry) => (
                    <div
                      key={entry._id}
                      className={`flex items-center justify-between rounded-2xl border px-4 py-4 ${
                        myEntry?._id === entry._id
                          ? "border-emerald-300 bg-emerald-50"
                          : "border-gray-100 bg-white"
                      }`}
                    >
                      <div>
                        <div className="text-sm font-black text-gray-500">{entry.userName}</div>
                        <div className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
                          {entry.status} • swaps used {entry.swapCount}/2
                        </div>
                      </div>
                      <div className="text-3xl font-black">#{entry.tokenNumber}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="rounded-[2rem] bg-white/80 p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <ArrowRightLeft className="h-5 w-5 text-emerald-600" />
                  <h2 className="text-xl font-black">Broadcast Swap Request</h2>
                </div>
                <textarea
                  value={swapMessage}
                  onChange={(event) => setSwapMessage(event.target.value)}
                  placeholder="Need to swap with someone within +/-2 positions? Ask the queue here."
                  className="min-h-28 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-400"
                />
                <button
                  type="button"
                  onClick={() =>
                    runAction("swap-create", `${API_BASE}/queue/swap-requests`, {
                      method: "POST",
                      body: JSON.stringify({
                        organizationId,
                        message: swapMessage
                      })
                    })
                  }
                  disabled={!myEntry || myEntry.status !== "waiting" || myEntry.swapsRemaining <= 0}
                  className="mt-4 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  Broadcast Swap Request
                </button>
              </div>

              <div className="rounded-[2rem] bg-white/80 p-6 shadow-sm">
                <div className="mb-5 flex items-center gap-3">
                  <Ticket className="h-5 w-5 text-emerald-600" />
                  <h2 className="text-xl font-black">Organization Swap Board</h2>
                </div>
                <div className="space-y-4">
                  {swapRequests.map((request) => {
                    const isRequester = String(request.requesterUserId) === String(myEntry?.userId);
                    const myResponse = request.responses.find(
                      (response) => String(response.responderUserId) === String(myEntry?.userId)
                    );
                    const acceptedResponses = request.responses.filter(
                      (response) => response.status === "accepted"
                    );
                    const withinRange = myEntry
                      ? Math.abs(request.requesterToken - myEntry.tokenNumber) <= 2
                      : false;

                    return (
                      <div key={request._id} className="rounded-[1.5rem] border border-gray-100 bg-white p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Requester</div>
                            <div className="mt-2 text-lg font-black">
                              {request.requesterName} • #{request.requesterToken}
                            </div>
                            <p className="mt-2 text-sm text-gray-600">
                              {request.message || "No message provided."}
                            </p>
                          </div>
                          <div className="rounded-2xl bg-amber-50 px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-amber-700">
                            {acceptedResponses.length} accepted
                          </div>
                        </div>

                        {acceptedResponses.length > 0 && (
                          <div className="mt-4 space-y-2 rounded-2xl bg-gray-50 p-3">
                            {acceptedResponses.map((response) => (
                              <div key={response.responderUserId} className="flex items-center justify-between rounded-2xl bg-white px-3 py-3">
                                <div className="text-sm font-bold">
                                  {response.responderName} • #{response.responderToken}
                                </div>
                                {isRequester && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      runAction(
                                        `finalize-${request._id}`,
                                        `${API_BASE}/queue/swap-requests/${request._id}/finalize`,
                                        {
                                          method: "POST",
                                          body: JSON.stringify({
                                            responderUserId: response.responderUserId
                                          })
                                        }
                                      )
                                    }
                                    className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-black text-white"
                                  >
                                    Choose
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {!isRequester && myEntry && (
                          <div className="mt-4 flex flex-wrap gap-3">
                            <button
                              type="button"
                              onClick={() =>
                                runAction(
                                  `accept-${request._id}`,
                                  `${API_BASE}/queue/swap-requests/${request._id}/respond`,
                                  {
                                    method: "POST",
                                    body: JSON.stringify({ decision: "accepted" })
                                  }
                                )
                              }
                              disabled={!!myResponse || !withinRange || myEntry.swapsRemaining <= 0 || myEntry.status !== "waiting"}
                              className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white disabled:cursor-not-allowed disabled:bg-gray-300"
                            >
                              Accept
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                runAction(
                                  `decline-${request._id}`,
                                  `${API_BASE}/queue/swap-requests/${request._id}/respond`,
                                  {
                                    method: "POST",
                                    body: JSON.stringify({ decision: "declined" })
                                  }
                                )
                              }
                              disabled={!!myResponse}
                              className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-gray-700 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
                            >
                              Decline
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-[2rem] bg-white/80 p-6 shadow-sm">
                <div className="mb-5 flex items-center gap-3">
                  <Clock3 className="h-5 w-5 text-emerald-600" />
                  <h2 className="text-xl font-black">Requester Final Choice</h2>
                </div>
                <div className="space-y-3">
                  {acceptedRequestsForMe.map((request) => (
                    <div key={request._id} className="rounded-2xl bg-gray-50 p-4">
                      <div className="text-sm font-bold text-gray-700">
                        Multiple users accepted your request for token #{request.requesterToken}.
                      </div>
                      <div className="mt-3 space-y-2">
                        {request.responses
                          .filter((response) => response.status === "accepted")
                          .map((response) => (
                            <button
                              key={response.responderUserId}
                              type="button"
                              onClick={() =>
                                runAction(
                                  `finalize-choice-${request._id}`,
                                  `${API_BASE}/queue/swap-requests/${request._id}/finalize`,
                                  {
                                    method: "POST",
                                    body: JSON.stringify({
                                      responderUserId: response.responderUserId
                                    })
                                  }
                                )
                              }
                              className="flex w-full items-center justify-between rounded-2xl bg-white px-4 py-3 text-left text-sm font-bold"
                            >
                              <span>
                                {response.responderName} can swap token #{response.responderToken}
                              </span>
                              <span className="text-emerald-600">Finalize</span>
                            </button>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default QueueDemo;
