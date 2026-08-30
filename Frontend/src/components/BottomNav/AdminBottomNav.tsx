import { NavLink } from "react-router-dom";
import { ROUTES } from "@/Routes/paths";

function AdminBottomNav() {
  return (
    <nav aria-label="Admin Navigation" className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-800 bg-slate-950/95 shadow-2xl backdrop-blur-lg md:hidden">
      <div className="mx-auto flex h-16 max-w-md items-center justify-around px-2">
        {/* Dashboard */}
        <NavLink
          to={ROUTES.admin.dashboard}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-3 py-1 transition ${
              isActive ? "text-red-400 font-bold" : "text-slate-400 hover:text-slate-200"
            }`
          }
        >
          <span className="text-lg">📊</span>
          <span className="text-[10px] font-mono uppercase tracking-wider">Dashboard</span>
        </NavLink>

        {/* Real Assam Map */}
        <NavLink
          to={ROUTES.admin.map}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-3 py-1 transition ${
              isActive ? "text-red-400 font-bold" : "text-slate-400 hover:text-slate-200"
            }`
          }
        >
          <span className="text-lg">🗺️</span>
          <span className="text-[10px] font-mono uppercase tracking-wider">Map</span>
        </NavLink>

        {/* Requests */}
        <NavLink
          to={ROUTES.admin.requests}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-3 py-1 transition ${
              isActive ? "text-red-400 font-bold" : "text-slate-400 hover:text-slate-200"
            }`
          }
        >
          <span className="text-lg">🚨</span>
          <span className="text-[10px] font-mono uppercase tracking-wider">Requests</span>
        </NavLink>

        {/* Teams */}
        <NavLink
          to={ROUTES.admin.teams}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-3 py-1 transition ${
              isActive ? "text-red-400 font-bold" : "text-slate-400 hover:text-slate-200"
            }`
          }
        >
          <span className="text-lg">🚤</span>
          <span className="text-[10px] font-mono uppercase tracking-wider">Teams</span>
        </NavLink>

        {/* Profile */}
        <NavLink
          to={ROUTES.admin.profile}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-3 py-1 transition ${
              isActive ? "text-red-400 font-bold" : "text-slate-400 hover:text-slate-200"
            }`
          }
        >
          <span className="text-lg">👤</span>
          <span className="text-[10px] font-mono uppercase tracking-wider">Profile</span>
        </NavLink>
      </div>
    </nav>
  );
}

export default AdminBottomNav;
