import { useAuth } from "@/hooks/useAuth";
import { useAppDispatch } from "@/hooks/redux";
import { logout } from "@/Redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

function AdminProfilePage() {
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
          🛡️ System Administrator Profile
        </h1>
        <p className="text-xs text-slate-400">
          Central Emergency Operations Control & User Permissions
        </p>
      </div>

      {/* Account Info Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600 text-2xl font-bold text-white shadow-lg shadow-red-900/50">
            🛡️
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{user?.name ?? "System Administrator"}</h2>
            <p className="text-xs text-slate-400">{user?.email ?? "admin@emergency.org"}</p>
            <span className="mt-1 inline-block rounded-full bg-red-500/20 px-2.5 py-0.5 font-mono text-[10px] font-bold text-red-400 border border-red-500/30">
              ROLE: {user?.role ?? "ADMIN"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs font-mono">
          <div className="rounded-xl bg-slate-950 p-3 border border-slate-800">
            <span className="text-slate-400 block">Access Permission:</span>
            <span className="font-bold text-red-400">FULL SYSTEM DISPATCH CONTROL</span>
          </div>
          <div className="rounded-xl bg-slate-950 p-3 border border-slate-800">
            <span className="text-slate-400 block">Monitoring Region:</span>
            <span className="font-bold text-white">Assam State Flood Control, India</span>
          </div>
        </div>
      </div>

      {/* Sign Out Button */}
      <button
        type="button"
        onClick={handleLogout}
        className="w-full rounded-xl bg-red-950/40 border border-red-500/40 py-3 text-xs sm:text-sm font-bold text-red-400 hover:bg-red-900/50"
      >
        Sign Out of Admin Command Center
      </button>
    </div>
  );
}

export default AdminProfilePage;
