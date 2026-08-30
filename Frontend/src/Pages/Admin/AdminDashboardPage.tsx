import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/Routes/paths";
import {
  fetchAdminDashboardApi,
  fetchAdminHelpRequestsApi,
  fetchAdminRescueTeamsApi,
} from "@/api/adminApi";
import { updateHelpRequestStatusApi } from "@/api/helpRequestApi";
import FloodRiskMap from "@/components/Map/FloodRiskMap";
import {
  mockBlockedRoads,
  mockMapOverlays,
  mockNearestRescueTeam,
  mockNearestShelter,
  mockUserLocation,
} from "@/data/mockUserDashboardData";

interface EmergencyRequestItem {
  id: string;
  location: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM";
  peopleCount: number;
  status: "Waiting" | "Assigned" | "Resolved";
  assignedTeam?: string;
}

interface AlertItem {
  id: string;
  title: string;
  message: string;
  severity: "CRITICAL" | "WARNING" | "INFO";
  timestamp: string;
}

const initialEmergencies: EmergencyRequestItem[] = [
  {
    id: "REQ-2026-8841",
    location: "Riverside District, Guwahati, Assam",
    severity: "CRITICAL",
    peopleCount: 4,
    status: "Waiting",
    assignedTeam: "Unassigned",
  },
  {
    id: "REQ-2026-8842",
    location: "North Causeway, Assam",
    severity: "HIGH",
    peopleCount: 2,
    status: "Assigned",
    assignedTeam: "Rescue Unit 04",
  },
  {
    id: "REQ-2026-8843",
    location: "Lowland Basin Sector 2, Assam",
    severity: "MEDIUM",
    peopleCount: 3,
    status: "Waiting",
    assignedTeam: "Unassigned",
  },
];

const availableTeams = [
  { id: "team-1", name: "Rescue Unit 04 — Assam Marine Alpha", status: "Available", crew: 4 },
  { id: "team-2", name: "Rescue Unit 02 — Rapid Water Rescue", status: "Available", crew: 5 },
  { id: "team-3", name: "Rescue Unit 01 — Medical Air Patrol", status: "Busy", crew: 3 },
];

const initialAlerts: AlertItem[] = [
  {
    id: "alt-1",
    title: "Critical Flood Risk Warning",
    message: "High water levels along Brahmaputra riverbank in Guwahati Sector 4, Assam.",
    severity: "CRITICAL",
    timestamp: "5 min ago",
  },
  {
    id: "alt-2",
    title: "North Bridge Road Blocked",
    message: "Submerged under 1.5m flood water. Vehicles prohibited.",
    severity: "WARNING",
    timestamp: "12 min ago",
  },
  {
    id: "alt-3",
    title: "Green Valley Shelter Open",
    message: "Accepting evacuees with 120 beds available.",
    severity: "INFO",
    timestamp: "20 min ago",
  },
];


function AdminDashboardPage() {
  const [emergencies, setEmergencies] = useState<EmergencyRequestItem[]>(initialEmergencies);
  const [alerts, setAlerts] = useState<AlertItem[]>(initialAlerts);
  const [stats, setStats] = useState({
    activeRequests: 3,
    availableTeams: 3,
    totalTeams: 5,
    sheltersAtCapacity: 1,
  });
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    Promise.all([fetchAdminDashboardApi(), fetchAdminHelpRequestsApi(), fetchAdminRescueTeamsApi()])
      .then(([dash, reqs]) => {
        if (dash) {
          setStats({
            activeRequests: dash.activeRequests,
            availableTeams: dash.availableTeams,
            totalTeams: dash.totalTeams,
            sheltersAtCapacity: dash.sheltersAtCapacity,
          });
        }
        if (reqs && reqs.length > 0) {
          const mapped: EmergencyRequestItem[] = reqs.map((r) => ({
            id: r._id,
            location: r.location?.address || "Guwahati Basin Sector, Assam",
            severity: r.severity === "CRITICAL" ? "CRITICAL" : r.severity === "HIGH" ? "HIGH" : "MEDIUM",
            peopleCount: r.peopleCount,
            status: r.status === "PENDING" ? "Waiting" : r.status === "RESOLVED" ? "Resolved" : "Assigned",
            assignedTeam: typeof r.assignedTeamId === "object" && r.assignedTeamId ? r.assignedTeamId.teamName : "Unassigned",
          }));
          setEmergencies(mapped);
        }
        setIsLive(true);
      })
      .catch(() => {
        setIsLive(false);
      });
  }, []);

  // Assign Team Modal State
  const [selectedEmergency, setSelectedEmergency] = useState<EmergencyRequestItem | null>(null);
  const [assignedTeamSelect, setAssignedTeamSelect] = useState("Rescue Unit 04");

  // Create Alert Modal State
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [newAlertTitle, setNewAlertTitle] = useState("");
  const [newAlertMessage, setNewAlertMessage] = useState("");
  const [newAlertSeverity, setNewAlertSeverity] = useState<"CRITICAL" | "WARNING" | "INFO">("WARNING");

  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmergency) return;

    try {
      await updateHelpRequestStatusApi(selectedEmergency.id, "ASSIGNED");
    } catch {
      // Fallback local update
    }

    setEmergencies((prev) =>
      prev.map((item) =>
        item.id === selectedEmergency.id
          ? { ...item, status: "Assigned", assignedTeam: assignedTeamSelect }
          : item
      )
    );
    setSelectedEmergency(null);
  };


  const handleCreateAlertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlertTitle || !newAlertMessage) return;

    const createdAlert: AlertItem = {
      id: `alt-${Date.now()}`,
      title: newAlertTitle,
      message: newAlertMessage,
      severity: newAlertSeverity,
      timestamp: "Just now",
    };

    setAlerts([createdAlert, ...alerts]);
    setNewAlertTitle("");
    setNewAlertMessage("");
    setIsAlertModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Sub-Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Central Admin Dashboard
          </h1>
          <p className="text-sm text-slate-300">
            Emergency Monitoring & Rescue Team Dispatch Coordination
          </p>
        </div>
        <span
          className={`rounded px-3 py-1 font-mono text-xs font-bold border ${
            isLive
              ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
              : "bg-amber-500/10 text-amber-400 border-amber-500/20"
          }`}
        >
          {isLive ? "LIVE API" : "DEMO DATA"}
        </span>

      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active Emergencies */}
        <div className="rounded-2xl border border-red-500/30 bg-slate-900 p-4 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-red-400">
              Active Emergencies
            </span>
            <span className="text-xl">🚨</span>
          </div>
          <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-white font-mono">
            {emergencies.filter((e) => e.status !== "Resolved").length}
          </p>
          <span className="text-[11px] text-slate-400 font-mono">Pending Dispatch</span>
        </div>

        {/* Card 2: Rescue Teams */}
        <div className="rounded-2xl border border-cyan-500/30 bg-slate-900 p-4 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-cyan-400">
              Rescue Teams
            </span>
            <span className="text-xl">🚤</span>
          </div>
          <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-white font-mono">
            {stats.totalTeams} <span className="text-xs text-emerald-400 font-normal">({stats.availableTeams} Available)</span>
          </p>
          <span className="text-[11px] text-slate-400 font-mono">Marine & Air Units</span>
        </div>


        {/* Card 3: Shelters */}
        <div className="rounded-2xl border border-emerald-500/30 bg-slate-900 p-4 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-emerald-400">
              Open Shelters
            </span>
            <span className="text-xl">🏠</span>
          </div>
          <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-white font-mono">
            4 <span className="text-xs text-emerald-400 font-normal">(120 beds)</span>
          </p>
          <span className="text-[11px] text-slate-400 font-mono">Accepting Evacuees</span>
        </div>

        {/* Card 4: High-Risk Areas */}
        <div className="rounded-2xl border border-amber-500/30 bg-slate-900 p-4 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-amber-400">
              High-Risk Areas
            </span>
            <span className="text-xl">⚠️</span>
          </div>
          <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-white font-mono">
            2 <span className="text-xs text-amber-400 font-normal">(Brahmaputra)</span>
          </p>
          <span className="text-[11px] text-slate-400 font-mono">Assam Basin Warning</span>
        </div>
      </div>

      {/* Main Dominant Section: Real Interactive Map of Assam */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h2 className="font-display text-lg sm:text-xl font-bold uppercase tracking-wider text-white">
            Assam Emergency Monitoring Map
          </h2>
          <span className="text-xs font-mono font-bold text-red-400">
            📍 Guwahati & Brahmaputra Basin, Assam
          </span>
        </div>

        <FloodRiskMap
          userLocation={mockUserLocation}
          shelter={mockNearestShelter}
          rescueTeam={mockNearestRescueTeam}
          blockedRoads={mockBlockedRoads}
          overlays={mockMapOverlays}
        />
      </section>

      {/* Grid: Active Emergencies (Assign Team) & Rescue Teams */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* A. Active Emergencies (Assign Rescue Team) */}
        <section className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h2 className="font-display text-base sm:text-lg font-bold uppercase tracking-wider text-white">
              Active Emergencies
            </h2>
            <span className="text-xs font-mono text-slate-400">
              Click Assign to Dispatch Unit
            </span>
          </div>

          <div className="space-y-3">
            {emergencies.map((item) => (
              <div
                key={item.id}
                className={`rounded-2xl border p-4 shadow-lg space-y-2 ${
                  item.status === "Waiting"
                    ? "border-red-500/50 bg-slate-900"
                    : "border-slate-800 bg-slate-950/80"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`rounded px-2.5 py-0.5 font-mono text-xs font-bold ${
                      item.severity === "CRITICAL"
                        ? "bg-red-500/20 text-red-400 border border-red-500/30"
                        : item.severity === "HIGH"
                        ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    }`}
                  >
                    {item.severity}
                  </span>
                  <span className="text-xs font-mono text-slate-400 font-bold">
                    {item.peopleCount} people affected
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">{item.location}</h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    Status: <strong className={item.status === "Waiting" ? "text-amber-400" : "text-emerald-400"}>{item.status}</strong> · Team: <strong className="text-cyan-400">{item.assignedTeam}</strong>
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setSelectedEmergency(item)}
                    className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-red-500 active:scale-95"
                  >
                    ASSIGN TEAM
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* B. Rescue Teams Availability */}
        <section className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h2 className="font-display text-base sm:text-lg font-bold uppercase tracking-wider text-white">
              Rescue Teams Status
            </h2>
            <Link
              to={ROUTES.admin.teams}
              className="text-xs font-mono font-bold text-cyan-400 hover:underline"
            >
              Manage Teams →
            </Link>
          </div>

          <div className="space-y-3">
            {availableTeams.map((team) => (
              <div
                key={team.id}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-lg flex items-center justify-between"
              >
                <div>
                  <h3 className="text-sm font-bold text-white">{team.name}</h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    Crew: {team.crew} Divers & Medics
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-mono font-bold border ${
                    team.status === "Available"
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                      : "bg-amber-500/20 text-amber-400 border-amber-500/30"
                  }`}
                >
                  ● {team.status}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Grid: Shelters & Recent Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* C. Open Shelters Overview */}
        <section className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h2 className="font-display text-base sm:text-lg font-bold uppercase tracking-wider text-white">
              Shelters Occupancy
            </h2>
            <Link
              to={ROUTES.admin.shelters}
              className="text-xs font-mono font-bold text-emerald-400 hover:underline"
            >
              View Shelters →
            </Link>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Green Valley Community Shelter</h3>
                <p className="text-xs text-slate-400">Guwahati Sector 2, Assam</p>
              </div>
              <span className="rounded bg-emerald-500/20 px-2.5 py-0.5 text-xs font-mono font-bold text-emerald-400">
                OPEN
              </span>
            </div>

            <div className="space-y-1.5 rounded-xl bg-slate-950 p-3 border border-slate-800 font-mono text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Available Beds:</span>
                <strong className="text-emerald-400">120 / 300 spaces left</strong>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                <div className="h-full bg-emerald-400 w-3/5" />
              </div>
            </div>
          </div>
        </section>

        {/* D. Recent Alerts & Create Alert Action */}
        <section className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h2 className="font-display text-base sm:text-lg font-bold uppercase tracking-wider text-white">
              Broadcasting Emergency Alerts
            </h2>
            <button
              type="button"
              onClick={() => setIsAlertModalOpen(true)}
              className="rounded-xl bg-red-600 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow hover:bg-red-500 active:scale-95"
            >
              + CREATE ALERT
            </button>
          </div>

          <div className="space-y-2.5">
            {alerts.map((alt) => (
              <div
                key={alt.id}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-3.5 shadow flex items-center justify-between text-xs"
              >
                <div>
                  <h4 className="font-bold text-white">{alt.title}</h4>
                  <p className="text-slate-400 text-[11px] mt-0.5">{alt.message}</p>
                </div>
                <span className="font-mono text-[10px] text-slate-500 whitespace-nowrap ml-2">
                  {alt.timestamp}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ASSIGN TEAM MODAL */}
      {selectedEmergency && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">
                Dispatch Rescue Team
              </h3>
              <button
                type="button"
                onClick={() => setSelectedEmergency(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs font-mono bg-slate-950 p-3 rounded-xl border border-slate-800">
              <p className="text-slate-300">Target Location: <strong className="text-white">{selectedEmergency.location}</strong></p>
              <p className="text-slate-300">People Affected: <strong className="text-cyan-400">{selectedEmergency.peopleCount}</strong></p>
            </div>

            <form onSubmit={(e) => { void handleAssignSubmit(e); }} className="space-y-4">

              <div>
                <label className="block text-xs font-mono font-bold uppercase text-slate-300 mb-1">
                  Select Available Rescue Team
                </label>
                <select
                  value={assignedTeamSelect}
                  onChange={(e) => setAssignedTeamSelect(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-red-500 focus:outline-none"
                >
                  <option value="Rescue Unit 04 — Assam Marine Alpha">Rescue Unit 04 — Assam Marine Alpha (Available)</option>
                  <option value="Rescue Unit 02 — Rapid Water Rescue">Rescue Unit 02 — Rapid Water Rescue (Available)</option>
                  <option value="Rescue Unit 01 — Air Patrol">Rescue Unit 01 — Air Patrol (On Standby)</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedEmergency(null)}
                  className="w-1/2 rounded-xl bg-slate-800 py-2.5 text-xs font-bold text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow hover:bg-emerald-500"
                >
                  ASSIGN TEAM
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE ALERT MODAL */}
      {isAlertModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">
                Broadcast Emergency Alert
              </h3>
              <button
                type="button"
                onClick={() => setIsAlertModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAlertSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-mono font-bold uppercase text-slate-300 mb-1">
                  Alert Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. River Overflow Warning"
                  value={newAlertTitle}
                  onChange={(e) => setNewAlertTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase text-slate-300 mb-1">
                  Alert Message
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Provide short evacuation instructions..."
                  value={newAlertMessage}
                  onChange={(e) => setNewAlertMessage(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase text-slate-300 mb-1">
                  Severity Level
                </label>
                <select
                  value={newAlertSeverity}
                  onChange={(e) => setNewAlertSeverity(e.target.value as "CRITICAL" | "WARNING" | "INFO")}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-red-500 focus:outline-none"
                >
                  <option value="CRITICAL">Critical / High Emergency</option>
                  <option value="WARNING">Warning / Advisory</option>
                  <option value="INFO">Information Update</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAlertModalOpen(false)}
                  className="w-1/2 rounded-xl bg-slate-800 py-2.5 text-xs font-bold text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 rounded-xl bg-red-600 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow hover:bg-red-500"
                >
                  BROADCAST
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboardPage;