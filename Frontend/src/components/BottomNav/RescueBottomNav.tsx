import { NavLink } from "react-router-dom";
import { ROUTES } from "@/Routes/paths";

function getNavItemClassName(isActive: boolean): string {
  return `flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
    isActive ? "text-cyan-400 font-bold" : "text-slate-400 hover:text-slate-200"
  }`;
}

function RescueBottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-800 bg-slate-950/95 py-2 backdrop-blur-md shadow-2xl">
      <div className="mx-auto flex max-w-[1600px] items-center justify-around px-4">
        <NavLink
          to={ROUTES.rescueTeam.dashboard}
          end
          className={({ isActive }) => getNavItemClassName(isActive)}
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          Dashboard
        </NavLink>

        <NavLink
          to={ROUTES.rescueTeam.map}
          className={({ isActive }) => getNavItemClassName(isActive)}
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          Nav Map
        </NavLink>

        <NavLink
          to={ROUTES.rescueTeam.requests}
          className={({ isActive }) => getNavItemClassName(isActive)}
        >
          <div className="relative flex flex-col items-center">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="absolute -right-2 -top-1 flex h-2 w-2 rounded-full bg-red-500 animate-ping" />
          </div>
          Requests
        </NavLink>

        <NavLink
          to={ROUTES.rescueTeam.team}
          className={({ isActive }) => getNavItemClassName(isActive)}
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Team Status
        </NavLink>

        <NavLink
          to={ROUTES.rescueTeam.profile}
          className={({ isActive }) => getNavItemClassName(isActive)}
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Profile
        </NavLink>

      </div>
    </nav>
  );
}

export default RescueBottomNav;
