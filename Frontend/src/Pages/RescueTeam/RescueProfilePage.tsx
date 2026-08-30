import { useAuth } from "@/hooks/useAuth";
import { useAppDispatch } from "@/hooks/redux";
import { logout } from "@/Redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

function RescueProfilePage() {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    void navigate("/login", { replace: true });
  };



  return (
    <div className="mx-auto max-w-2xl space-y-5">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3">
        <h1 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          🚤 Rescue Unit Profile & Operations
        </h1>
        <p className="text-xs text-slate-400">
          Manage operational team callsign, boat equipment inventory, crew roster, and active dispatch status.
        </p>
      </div>

      {/* Team Info Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-600 text-2xl font-bold text-white shadow-lg shadow-cyan-900/50">
            🚤
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Rescue Unit 04 — Marine Alpha</h2>
            <p className="text-xs text-slate-400">Commander: {user?.name ?? "Officer Davis"}</p>
            <span className="mt-1 inline-block rounded-full bg-cyan-500/20 px-2.5 py-0.5 font-mono text-[10px] font-bold text-cyan-400 border border-cyan-500/30">
              DISPATCH CALLSIGN: RU-04
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs font-mono">
          <div className="rounded-xl bg-slate-950 p-3 border border-slate-800">
            <span className="text-slate-400 block">Hotline Phone:</span>
            <span className="font-bold text-cyan-400">+1 (800) 555-0199</span>
          </div>
          <div className="rounded-xl bg-slate-950 p-3 border border-slate-800">
            <span className="text-slate-400 block">Assigned Sector Patrol:</span>
            <span className="font-bold text-white">Sector 4 — Riverside District</span>
          </div>
        </div>
      </div>

      {/* Equipment & Crew Roster */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
          Deployed Equipment & Roster
        </h3>
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between rounded-xl bg-slate-950 p-3 border border-slate-800">
            <span className="text-slate-300">Primary Transport Boat</span>
            <span className="font-mono font-bold text-slate-200">Rigid Inflatable Motorboat (8-Seat)</span>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-slate-950 p-3 border border-slate-800">
            <span className="text-slate-300">Medical Support Kit</span>
            <span className="font-mono font-bold text-emerald-400">Level 2 Trauma & Defibrillator</span>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-slate-950 p-3 border border-slate-800">
            <span className="text-slate-300">Active Crew Roster</span>
            <span className="font-mono font-bold text-slate-200">4 Certified Marine Divers</span>
          </div>
        </div>
      </div>

      {/* Logout Action */}
      <button
        type="button"
        onClick={handleLogout}
        className="w-full rounded-xl bg-red-950/40 border border-red-500/40 py-3 text-xs sm:text-sm font-bold text-red-400 hover:bg-red-900/50"
      >
        Sign Out of Rescue Command
      </button>
    </div>
  );
}

export default RescueProfilePage;
