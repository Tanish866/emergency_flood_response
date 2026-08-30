import { useState } from "react";

function RescueTeamStatusPage() {
  const [status, setStatus] = useState<"AVAILABLE" | "BUSY" | "OFFLINE">("AVAILABLE");

  const crewMembers = [
    { name: "Commander John Davis", role: "Team Leader & Marine Navigator", phone: "+1 (555) 019-8811" },
    { name: "Officer Alex Rivera", role: "Certified Rescue Diver", phone: "+1 (555) 019-8812" },
    { name: "Dr. Elena Vance", role: "Emergency Paramedic", phone: "+1 (555) 019-8813" },
    { name: "Technician Mark Stone", role: "Boat Operator & Comms Specialist", phone: "+1 (555) 019-8814" },
  ];

  const equipmentInventory = [
    { item: "8-Seat Rigid Inflatable Motorboat", status: "Operational (Full Tank)", icon: "🚤" },
    { item: "Satellite GPS Comms Unit", status: "Active (Lock 12 Sats)", icon: "🛰️" },
    { item: "Emergency Trauma & Defibrillator Kit", status: "Fully Stocked", icon: "🩺" },
    { item: "High-Power Flood Searchlights & Life Vests", status: "10 Vests Loaded", icon: "🔦" },
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            🚤 Rescue Team Status & Equipment
          </h1>
          <p className="text-xs text-slate-400">
            Operational status panel for Rescue Unit 04 — Marine Alpha.
          </p>
        </div>
        <span className="rounded bg-amber-500/10 px-2.5 py-1 font-mono text-xs font-bold text-amber-400 border border-amber-500/20">
          DEMO TEAM STATUS
        </span>
      </div>

      {/* Team Availability Control Bar */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
          Set Operational Readiness Status
        </h3>

        <div className="grid grid-cols-3 gap-3 text-xs font-bold font-mono">
          <button
            type="button"
            onClick={() => setStatus("AVAILABLE")}
            className={`rounded-xl py-3 border transition ${
              status === "AVAILABLE"
                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50 ring-2 ring-emerald-500/30"
                : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
            }`}
          >
            🟢 AVAILABLE
          </button>
          <button
            type="button"
            onClick={() => setStatus("BUSY")}
            className={`rounded-xl py-3 border transition ${
              status === "BUSY"
                ? "bg-amber-500/20 text-amber-400 border-amber-500/50 ring-2 ring-amber-500/30"
                : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
            }`}
          >
            🟠 BUSY / DISPATCHED
          </button>
          <button
            type="button"
            onClick={() => setStatus("OFFLINE")}
            className={`rounded-xl py-3 border transition ${
              status === "OFFLINE"
                ? "bg-slate-800 text-slate-300 border-slate-700 ring-2 ring-slate-600"
                : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
            }`}
          >
            ⚪ OFFLINE
          </button>
        </div>
      </div>

      {/* Crew Roster List */}
      <div className="space-y-3">
        <h3 className="font-display text-sm font-bold uppercase tracking-wider text-slate-300">
          Deployed Crew Roster (4 Members)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {crewMembers.map((member) => (
            <div
              key={member.name}
              className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 space-y-1 shadow-md"
            >
              <h4 className="text-base font-bold text-white">{member.name}</h4>
              <p className="text-xs text-cyan-400 font-medium">{member.role}</p>
              <p className="text-[11px] font-mono text-slate-400">Direct Line: {member.phone}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Equipment Inventory */}
      <div className="space-y-3">
        <h3 className="font-display text-sm font-bold uppercase tracking-wider text-slate-300">
          Rescue Craft & Equipment Inventory
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {equipmentInventory.map((eq) => (
            <div
              key={eq.item}
              className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-md"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-xl border border-slate-800">
                {eq.icon}
              </span>
              <div>
                <h4 className="text-sm font-bold text-white">{eq.item}</h4>
                <span className="font-mono text-xs text-emerald-400 font-bold">{eq.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RescueTeamStatusPage;
