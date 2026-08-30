import { useState } from "react";

interface TeamItem {
  id: string;
  name: string;
  callsign: string;
  status: "Available" | "Busy" | "Offline";
  crewCount: number;
  equipment: string;
  sector: string;
}

const initialTeamsList: TeamItem[] = [
  {
    id: "t1",
    name: "Rescue Unit 04",
    callsign: "RU-04",
    status: "Available",
    crewCount: 4,
    equipment: "Rigid Inflatable Rescue Motorboat",
    sector: "Sector 4 — Riverside District, Assam",
  },
  {
    id: "t2",
    name: "Rescue Unit 02",
    callsign: "RU-02",
    status: "Available",
    crewCount: 5,
    equipment: "High-Water Rescue Amphibious Vehicle",
    sector: "Sector 2 — Highland Basin, Assam",
  },
  {
    id: "t3",
    name: "Rescue Unit 01",
    callsign: "RU-01",
    status: "Busy",
    crewCount: 3,
    equipment: "Medical Evacuation Helicopter Patrol",
    sector: "Central Assam Flood Patrol",
  },
];

function AdminTeamsPage() {
  const [teams, setTeams] = useState<TeamItem[]>(initialTeamsList);

  const toggleStatus = (teamId: string) => {
    setTeams((prev) =>
      prev.map((t) =>
        t.id === teamId
          ? {
              ...t,
              status: t.status === "Available" ? "Busy" : t.status === "Busy" ? "Offline" : "Available",
            }
          : t
      )
    );
  };

  return (
    <div className="space-y-4">
      <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-extrabold tracking-tight text-white">
            🚤 Rescue Teams Readiness Directory
          </h1>
          <p className="text-xs text-slate-400">
            Monitor Deployed Units, Crew Roster & Availability Status
          </p>
        </div>
        <span className="rounded bg-amber-500/10 px-2 py-0.5 font-mono text-xs font-bold text-amber-400 border border-amber-500/20">
          DEMO DATA
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {teams.map((team) => (
          <div
            key={team.id}
            className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg space-y-3"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">{team.name}</h3>
                <span className="font-mono text-xs text-cyan-400">Callsign: {team.callsign}</span>
              </div>
              <button
                type="button"
                onClick={() => toggleStatus(team.id)}
                className={`rounded-full px-3 py-1 text-xs font-mono font-bold border transition ${
                  team.status === "Available"
                    ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                    : team.status === "Busy"
                    ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                    : "bg-slate-800 text-slate-400 border-slate-700"
                }`}
              >
                ● {team.status}
              </button>
            </div>

            <div className="space-y-1.5 text-xs font-mono bg-slate-950 p-3 rounded-xl border border-slate-800 text-slate-300">
              <p>Crew Roster: <strong className="text-white">{team.crewCount} Marine Divers & Medics</strong></p>
              <p>Equipment: <strong className="text-white">{team.equipment}</strong></p>
              <p>Sector: <strong className="text-slate-200">{team.sector}</strong></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminTeamsPage;
