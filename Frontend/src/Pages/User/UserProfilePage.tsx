import { useAuth } from "@/hooks/useAuth";
import { useAppDispatch } from "@/hooks/redux";
import { logout } from "@/Redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

function UserProfilePage() {
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
          👤 Citizen Emergency Profile
        </h1>
        <p className="text-xs text-slate-400">
          Manage your verified contact details and location preferences for disaster response team dispatch.
        </p>
      </div>

      {/* Account Info Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 text-2xl font-bold text-white border border-slate-700">
            {user?.name?.[0]?.toUpperCase() ?? "C"}
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{user?.name ?? "Citizen User"}</h2>
            <p className="text-xs text-slate-400">{user?.email ?? "citizen@emergency.org"}</p>
            <span className="mt-1 inline-block rounded-full bg-emerald-500/20 px-2.5 py-0.5 font-mono text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
              ROLE: {user?.role ?? "USER"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs">
          <div className="rounded-xl bg-slate-950 p-3 border border-slate-800">
            <span className="text-slate-400 block">Phone Contact:</span>
            <span className="font-bold text-white font-mono">{user?.phone ?? "+1 (555) 019-2834"}</span>
          </div>
          <div className="rounded-xl bg-slate-950 p-3 border border-slate-800">
            <span className="text-slate-400 block">Registered Sector:</span>
            <span className="font-bold text-white">Sector 4 — Riverside District</span>
          </div>
        </div>
      </div>

      {/* Emergency Preferences */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
          Disaster Dispatch Preferences
        </h3>
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between rounded-xl bg-slate-950 p-3 border border-slate-800">
            <span className="text-slate-300">Share Real-Time GPS Location during SOS</span>
            <span className="font-mono font-bold text-emerald-400">ENABLED</span>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-slate-950 p-3 border border-slate-800">
            <span className="text-slate-300">Receive SMS Critical Flood Alerts</span>
            <span className="font-mono font-bold text-emerald-400">ENABLED</span>
          </div>
        </div>
      </div>

      {/* Logout Action */}
      <button
        type="button"
        onClick={handleLogout}
        className="w-full rounded-xl bg-red-950/40 border border-red-500/40 py-3 text-xs sm:text-sm font-bold text-red-400 hover:bg-red-900/50"
      >
        Sign Out of Account
      </button>
    </div>
  );
}

export default UserProfilePage;
