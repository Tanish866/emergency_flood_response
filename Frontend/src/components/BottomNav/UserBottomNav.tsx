import { NavLink } from "react-router-dom";
import { ROUTES } from "@/Routes/paths";

function getNavItemClassName(isActive: boolean): string {
  return `flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
    isActive ? "text-red-400 font-semibold" : "text-slate-400 hover:text-slate-200"
  }`;
}

function UserBottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-800 bg-slate-950/95 py-2 backdrop-blur-md shadow-2xl">
      <div className="mx-auto flex max-w-[1600px] items-center justify-around px-4">

      <NavLink
        to={ROUTES.user.dashboard}
        end
        className={({ isActive }) => getNavItemClassName(isActive)}
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        Home
      </NavLink>

      <NavLink
        to={ROUTES.user.map}
        className={({ isActive }) => getNavItemClassName(isActive)}
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
        Map
      </NavLink>

      {/* SOS Center Button */}
      <NavLink
        to={ROUTES.user.requestHelp}
        className="group relative -mt-6 flex h-14 w-14 flex-col items-center justify-center rounded-full bg-gradient-to-b from-red-500 to-red-700 text-xs font-black uppercase tracking-wider text-white shadow-xl shadow-red-600/40 ring-4 ring-slate-950 transition hover:scale-105 active:scale-95"
      >
        <span className="absolute -inset-0.5 rounded-full bg-red-500 opacity-75 blur-xs group-hover:opacity-100 animate-pulse" />
        <span className="relative flex flex-col items-center leading-none">
          <span className="text-[10px] opacity-90">HELP</span>
          <span className="text-sm font-black">SOS</span>
        </span>
      </NavLink>

      <NavLink
        to={ROUTES.user.notifications}
        className={({ isActive }) => getNavItemClassName(isActive)}
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        Alerts
      </NavLink>

      <NavLink
        to={ROUTES.user.profile}
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

export default UserBottomNav;