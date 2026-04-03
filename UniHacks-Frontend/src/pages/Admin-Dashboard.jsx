import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  AlertCircle,
  Bell,
  CheckCircle2,
  ChevronRight,
  Clock,
  Layers,
  Pause,
  Play,
  Plus,
  Settings,
  Square,
  TrendingUp,
  Users,
  X
} from "lucide-react";

const API_BASE = "http://localhost:8080/api/admin";

const INITIAL_FORM = {
  organizationName: "",
  category: "Bank",
  location: "",
  avgServiceTime: 5,
  maxQueueLimit: 50,
  swapEnabled: true,
  maxSwapsPerUser: 2
};

const STATUS_LABELS = {
  active: "Active",
  paused: "Paused",
  closed: "Closed"
};

export default function AdminDashboard() {
  const token = localStorage.getItem("token");

  const [organization, setOrganization] = useState(null);
  const [dashboard, setDashboard] = useState({
    activeQueues: 0,
    totalWaiting: 0,
    avgServiceTime: 0,
    currentToken: 0,
    upcoming: [],
    users: []
  });
  const [form, setForm] = useState(INITIAL_FORM);
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [isBooting, setIsBooting] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCallingNext, setIsCallingNext] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const requestConfig = useMemo(
    () => ({
      headers: { Authorization: `Bearer ${token}` }
    }),
    [token]
  );

  useEffect(() => {
    hydrateDashboard();
  }, []);

  const hydrateDashboard = async () => {
    if (!token) {
      setError("Admin login required to access workspace.");
      setIsBooting(false);
      return;
    }

    try {
      setError("");
      const orgResponse = await axios.get(`${API_BASE}/organizations`, requestConfig);
      const adminOrganization = orgResponse.data?.[0] ?? null;
      setOrganization(adminOrganization);

      if (adminOrganization?._id) {
        await fetchDashboard(adminOrganization._id);
      } else {
        setDashboard({
          activeQueues: 0,
          totalWaiting: 0,
          avgServiceTime: 0,
          currentToken: 0,
          upcoming: [],
          users: []
        });
      }
    } catch (fetchError) {
      setError(fetchError.response?.data?.message || "Unable to load admin workspace.");
    } finally {
      setIsBooting(false);
    }
  };

  const fetchDashboard = async (organizationId) => {
    const response = await axios.get(
      `${API_BASE}/dashboard`,
      {
        ...requestConfig,
        params: { organizationId }
      }
    );

    setDashboard({
      activeQueues: response.data.activeQueues ?? 0,
      totalWaiting: response.data.totalWaiting ?? 0,
      avgServiceTime: response.data.avgServiceTime ?? 0,
      currentToken: response.data.currentToken ?? 0,
      upcoming: response.data.upcoming ?? [],
      users: response.data.users ?? []
    });

    if (response.data.office) {
      setOrganization(response.data.office);
    }
  };

  const refreshActiveOrganization = async () => {
    if (!organization?._id) return;
    await fetchDashboard(organization._id);
  };

  const updateForm = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value
    }));
  };

  const handleCreateOrganization = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");
    setMessage("");

    try {
      const response = await axios.post(
        `${API_BASE}/organizations`,
        form,
        requestConfig
      );

      setOrganization(response.data.office);
      setIsSetupOpen(false);
      setForm(INITIAL_FORM);
      setMessage("Organization created successfully.");
      await fetchDashboard(response.data.office._id);
    } catch (submitError) {
      setError(
        submitError.response?.data?.message || "Unable to create organization."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCallNext = async () => {
    if (!organization?._id) return;
    setIsCallingNext(true);
    setError("");
    setMessage("");

    try {
      const response = await axios.post(
        `${API_BASE}/call-next`,
        { organizationId: organization._id },
        requestConfig
      );
      setMessage(response.data.message || "Moved queue forward.");
      await refreshActiveOrganization();
    } catch (callError) {
      setError(callError.response?.data?.message || "Unable to call next token.");
    } finally {
      setIsCallingNext(false);
    }
  };

  const handleStatusChange = async (queueStatus) => {
    if (!organization?._id) return;
    setError("");
    setMessage("");

    try {
      const response = await axios.post(
        `${API_BASE}/status`,
        { organizationId: organization._id, queueStatus },
        requestConfig
      );
      setOrganization(response.data.office);
      setMessage(response.data.message || `Queue ${queueStatus}.`);
      await refreshActiveOrganization();
    } catch (statusError) {
      setError(statusError.response?.data?.message || "Unable to update queue status.");
    }
  };

  const currentStatus = organization?.queueStatus ?? "closed";
  const canCreateOrganization = !organization;

  return (
    <div className="min-h-screen bg-[#fdfdf2] px-6 pb-12 pt-20 text-gray-800">
      <div className="fixed left-0 top-0 -z-10 h-[500px] w-[500px] rounded-full bg-yellow-200/30 blur-[120px]" />
      <div className="fixed bottom-0 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-emerald-200/20 blur-[120px]" />

      <div className="mx-auto max-w-7xl">
        <header className="mb-8 mt-9 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-full border border-emerald-200 bg-emerald-100 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-700">
                Live Console
              </span>
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                System Operational
              </span>
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-gray-900 md:text-5xl">
              Admin <span className="text-emerald-600">Workspace</span>
            </h1>
            {organization ? (
              <p className="mt-3 text-sm font-medium text-gray-500">
                Managing {organization.name} in {organization.location}
              </p>
            ) : (
              <p className="mt-3 text-sm font-medium text-gray-500">
                Create your one organization to start managing the queue.
              </p>
            )}
          </div>
          <div className="flex gap-3">
            <button className="rounded-2xl border border-gray-100 bg-white p-4 text-gray-400 shadow-sm transition-all hover:text-emerald-600">
              <Bell className="h-5 w-5" />
            </button>
            <button className="rounded-2xl border border-gray-100 bg-white p-4 text-gray-400 shadow-sm transition-all hover:text-emerald-600">
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </header>

        {message ? (
          <div className="mb-4 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            <CheckCircle2 className="h-4 w-4" />
            {message}
          </div>
        ) : null}

        {error ? (
          <div className="mb-4 flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        ) : null}

        <main className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-8">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {[
                { label: "Active Queues", val: organization ? 1 : 0, icon: Layers, trend: organization ? "+1" : "0" },
                { label: "Waiting Now", val: dashboard.totalWaiting, icon: Users, trend: `${dashboard.totalWaiting}` },
                { label: "Avg Service", val: organization?.avgServiceTime ?? dashboard.avgServiceTime, icon: Clock, trend: `~${organization?.avgServiceTime ?? dashboard.avgServiceTime}m`, unit: "m" }
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-[2rem] border border-gray-50 bg-white p-6 shadow-sm transition-all hover:shadow-xl"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                      <stat.icon className="h-6 w-6" />
                    </div>
                    <span className="flex items-center gap-1 text-[10px] font-black text-emerald-500">
                      <TrendingUp className="h-3 w-3" /> {stat.trend}
                    </span>
                  </div>
                  <div className="mb-1 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    {stat.label}
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-gray-900">
                      {isBooting ? "..." : stat.val}
                    </span>
                    {stat.unit ? (
                      <span className="text-sm font-bold text-gray-400">{stat.unit}</span>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>

            <div className="overflow-hidden rounded-[2.5rem] bg-gray-900 p-8 text-white shadow-2xl">
              <div className="grid items-center gap-10 md:grid-cols-2">
                <div>
                  <h2 className="mb-6 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-emerald-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    Now Serving
                  </h2>
                  <div className="mb-2 flex items-baseline gap-4">
                    <span className="text-8xl font-black tracking-tighter">
                      #{dashboard.currentToken || 0}
                    </span>
                    <span className="text-xl font-black uppercase text-emerald-500/60">
                      {STATUS_LABELS[currentStatus]}
                    </span>
                  </div>
                  <p className="mb-8 font-medium text-gray-400">
                    {organization
                      ? `Queue status is ${currentStatus}. Call next when the counter is ready.`
                      : "Create an organization first, then your live queue controls will appear here."}
                  </p>

                  <div className="flex flex-wrap gap-3">
                    <button
                      disabled={!organization || currentStatus !== "active" || isCallingNext}
                      onClick={handleCallNext}
                      className="rounded-2xl bg-emerald-500 px-6 py-4 font-black text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-gray-700"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <Play className="h-5 w-5 fill-current" />
                        {isCallingNext ? "Calling..." : "Call Next"}
                      </span>
                    </button>
                    <button
                      disabled={!organization}
                      onClick={() => handleStatusChange("paused")}
                      className="rounded-2xl border border-white/10 px-5 py-4 font-black text-white transition-all hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Pause className="h-5 w-5" />
                    </button>
                    <button
                      disabled={!organization}
                      onClick={() => handleStatusChange("active")}
                      className="rounded-2xl border border-white/10 px-5 py-4 font-black text-white transition-all hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Play className="h-5 w-5" />
                    </button>
                    <button
                      disabled={!organization}
                      onClick={() => handleStatusChange("closed")}
                      className="rounded-2xl border border-white/10 px-5 py-4 font-black text-white transition-all hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Square className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="rounded-3xl border border-white/5 bg-white/5 p-6 backdrop-blur-md">
                  <h3 className="mb-4 text-xs font-black uppercase tracking-widest text-gray-500">
                    Up Next
                  </h3>
                  <div className="space-y-3">
                    {(dashboard.upcoming.length ? dashboard.upcoming : ["No waiting tokens"]).map((token) => (
                      <div
                        key={token}
                        className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-3"
                      >
                        <span className="text-lg font-black">{token}</span>
                        <span className="text-[10px] font-black uppercase text-gray-500">
                          {organization ? `Wait ~${organization.avgServiceTime ?? dashboard.avgServiceTime}m` : "--"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <section className="rounded-[2.5rem] border border-gray-50 bg-white p-8 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black text-gray-900">Queue Overview</h3>
                  <p className="mt-2 text-sm font-medium text-gray-500">
                    Current serving token, live members, and queue order for your organization.
                  </p>
                </div>
                {organization ? (
                  <span className="rounded-full bg-emerald-50 px-4 py-2 text-xs font-black uppercase tracking-widest text-emerald-700">
                    {STATUS_LABELS[currentStatus]}
                  </span>
                ) : null}
              </div>

              {organization ? (
                <>
                  <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="rounded-2xl bg-[#f7f8fb] p-5">
                      <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        Current Serving Token
                      </div>
                      <div className="mt-2 text-4xl font-black text-gray-900">
                        #{dashboard.currentToken || 0}
                      </div>
                    </div>
                    <div className="rounded-2xl bg-[#f7f8fb] p-5">
                      <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        Total People In Queue
                      </div>
                      <div className="mt-2 text-4xl font-black text-gray-900">
                        {dashboard.totalWaiting}
                      </div>
                    </div>
                    <div className="rounded-2xl bg-[#f7f8fb] p-5">
                      <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        Organization Rules
                      </div>
                      <div className="mt-2 space-y-1 text-sm font-semibold text-gray-600">
                        <div>Queue limit: {organization.maxQueueLimit}</div>
                        <div>Swap enabled: {organization.swapEnabled ? "Yes" : "No"}</div>
                        <div>Max swaps per user: {organization.maxSwapsPerUser}</div>
                      </div>
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-3xl border border-gray-100">
                    <div className="grid grid-cols-[1.2fr_0.6fr_0.8fr] bg-[#f7f8fb] px-5 py-4 text-[11px] font-black uppercase tracking-widest text-gray-400">
                      <span>User</span>
                      <span>Token</span>
                      <span>Status</span>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {dashboard.users.length ? (
                        dashboard.users.map((user) => (
                          <div
                            key={user.id}
                            className="grid grid-cols-[1.2fr_0.6fr_0.8fr] items-center px-5 py-4 text-sm font-semibold text-gray-700"
                          >
                            <span>{user.name}</span>
                            <span>#{user.tokenNumber}</span>
                            <span className="capitalize">{user.status}</span>
                          </div>
                        ))
                      ) : (
                        <div className="px-5 py-8 text-sm font-medium text-gray-500">
                          No users in queue yet.
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="rounded-3xl border border-dashed border-emerald-200 bg-emerald-50/40 p-8 text-sm font-medium text-gray-600">
                  Use <span className="font-black text-emerald-700">Add New Venue</span> to create your organization.
                  One admin can create only one organization.
                </div>
              )}
            </section>
          </div>

          <div className="space-y-6 lg:col-span-4">
            <button
              onClick={() => canCreateOrganization && setIsSetupOpen(true)}
              disabled={!canCreateOrganization}
              className={`w-full rounded-[2.5rem] border border-gray-50 p-8 text-left shadow-sm transition-all ${
                canCreateOrganization
                  ? "cursor-pointer bg-white hover:shadow-xl"
                  : "cursor-not-allowed bg-gray-100/70 opacity-80"
              }`}
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Plus className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-black text-gray-900">
                {canCreateOrganization ? "Add New Venue" : "Organization Created"}
              </h3>
              <p className="text-sm font-medium leading-relaxed text-gray-500">
                {canCreateOrganization
                  ? "Expand the QueueNest network by registering your branch or office."
                  : "This admin already owns one organization, so additional venue creation is locked."}
              </p>
              <div className="mt-6 flex items-center gap-2 text-xs font-black uppercase text-emerald-600">
                {canCreateOrganization ? "Begin Setup" : "Limit Reached"}
                <ChevronRight className="h-4 w-4" />
              </div>
            </button>

            <div className="rounded-[2.5rem] border border-amber-100 bg-amber-50 p-7 shadow-sm shadow-amber-500/5">
              <div className="flex items-start gap-4">
                <AlertCircle className="h-6 w-6 shrink-0 text-amber-500" />
                <div>
                  <h4 className="mb-1 text-sm font-black uppercase text-amber-900">
                    Queue Policy
                  </h4>
                  <p className="text-xs font-medium leading-relaxed text-amber-700">
                    Joining is allowed only when queue status is active and the queue is below max capacity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {isSetupOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/45 px-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-[2rem] bg-white p-8 shadow-2xl">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <div className="mb-2 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-700">
                  New Organization
                </div>
                <h2 className="text-3xl font-black tracking-tight text-gray-900">
                  Add Your Venue
                </h2>
                <p className="mt-2 text-sm font-medium text-gray-500">
                  Fill in the organization details. One admin can create only one organization.
                </p>
              </div>
              <button
                onClick={() => setIsSetupOpen(false)}
                className="rounded-full border border-gray-200 p-2 text-gray-500 transition hover:text-gray-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form className="grid grid-cols-1 gap-4 md:grid-cols-2" onSubmit={handleCreateOrganization}>
              <label className="md:col-span-2">
                <span className="mb-2 block text-xs font-black uppercase tracking-widest text-gray-400">
                  Organization Name
                </span>
                <input
                  required
                  value={form.organizationName}
                  onChange={(event) => updateForm("organizationName", event.target.value)}
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-emerald-400"
                  placeholder="SBI Main Branch"
                />
              </label>

              <label>
                <span className="mb-2 block text-xs font-black uppercase tracking-widest text-gray-400">
                  Category
                </span>
                <select
                  value={form.category}
                  onChange={(event) => updateForm("category", event.target.value)}
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-emerald-400"
                >
                  <option>Bank</option>
                  <option>Hospital</option>
                  <option>Government</option>
                  <option>Education</option>
                  <option>Utilities</option>
                </select>
              </label>

              <label>
                <span className="mb-2 block text-xs font-black uppercase tracking-widest text-gray-400">
                  Location
                </span>
                <input
                  required
                  value={form.location}
                  onChange={(event) => updateForm("location", event.target.value)}
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-emerald-400"
                  placeholder="Mumbai"
                />
              </label>

              <label>
                <span className="mb-2 block text-xs font-black uppercase tracking-widest text-gray-400">
                  Avg Service Time (Minutes)
                </span>
                <input
                  required
                  min="1"
                  type="number"
                  value={form.avgServiceTime}
                  onChange={(event) => updateForm("avgServiceTime", Number(event.target.value))}
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-emerald-400"
                />
              </label>

              <label>
                <span className="mb-2 block text-xs font-black uppercase tracking-widest text-gray-400">
                  Max Queue Limit
                </span>
                <input
                  required
                  min="1"
                  type="number"
                  value={form.maxQueueLimit}
                  onChange={(event) => updateForm("maxQueueLimit", Number(event.target.value))}
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-emerald-400"
                />
              </label>

              <label>
                <span className="mb-2 block text-xs font-black uppercase tracking-widest text-gray-400">
                  Swap Enabled
                </span>
                <select
                  value={String(form.swapEnabled)}
                  onChange={(event) => updateForm("swapEnabled", event.target.value === "true")}
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-emerald-400"
                >
                  <option value="true">True</option>
                  <option value="false">False</option>
                </select>
              </label>

              <label>
                <span className="mb-2 block text-xs font-black uppercase tracking-widest text-gray-400">
                  Max Swaps Per User
                </span>
                <input
                  required
                  min="0"
                  type="number"
                  value={form.maxSwapsPerUser}
                  onChange={(event) => updateForm("maxSwapsPerUser", Number(event.target.value))}
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-emerald-400"
                />
              </label>

              <div className="mt-4 flex items-center justify-end gap-3 md:col-span-2">
                <button
                  type="button"
                  onClick={() => setIsSetupOpen(false)}
                  className="rounded-2xl border border-gray-200 px-5 py-3 text-sm font-black text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-black text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  {isSubmitting ? "Creating..." : "Create Organization"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
