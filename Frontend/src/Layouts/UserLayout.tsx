import { useState, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "@/Routes/paths";
import UserBottomNav from "@/components/BottomNav/UserBottomNav";
import { useAppDispatch } from "@/hooks/redux";
import { logout } from "@/Redux/slices/authSlice";

interface UserLayoutProps {
  children: ReactNode;
}

function UserLayout({ children }: UserLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();


  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 antialiased selection:bg-red-500 selection:text-white">
      {/* Top Header - Dark Emergency Dashboard Navigation */}
      <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/95 shadow-lg backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          {/* Left: Hamburger menu */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-300 transition hover:bg-slate-800 hover:text-white active:scale-95"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* Branding */}
            <Link to={ROUTES.user.dashboard} className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 font-bold text-white shadow-md shadow-red-900/50">
                🚨
              </div>
              <div>
                <span className="font-display text-base font-bold tracking-tight text-white">
                  Emergency Response
                </span>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                  <span className="font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                    Live Dispatch
                  </span>
                  <span className="rounded bg-amber-500/20 px-1 py-0.5 font-mono text-[9px] font-semibold text-amber-300 border border-amber-500/30">
                    DEMO DATA
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* Right: Notifications & Profile */}
          <div className="flex items-center gap-2">
            <Link
              to={ROUTES.user.notifications}
              aria-label="Notifications"
              className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span className="absolute right-1 top-1 flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hamburger Drawer Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs"
          onClick={() => setIsMenuOpen(false)}
        >
          <div
            className="w-64 h-full bg-slate-950 p-5 border-r border-slate-800 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="font-bold text-sm text-slate-200">Navigation Menu</span>
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <nav className="flex flex-col space-y-2 text-sm">
              <Link
                to={ROUTES.user.dashboard}
                className="p-2 rounded-lg bg-slate-800 text-white font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                🏠 Dashboard
              </Link>
              <Link
                to={ROUTES.user.map}
                className="p-2 rounded-lg text-slate-300 hover:bg-slate-900"
                onClick={() => setIsMenuOpen(false)}
              >
                🗺️ Evacuation Map
              </Link>
              <Link
                to={ROUTES.user.shelters}
                className="p-2 rounded-lg text-slate-300 hover:bg-slate-900"
                onClick={() => setIsMenuOpen(false)}
              >
                🏠 Shelters
              </Link>
              <Link
                to={ROUTES.user.rescueTeams}
                className="p-2 rounded-lg text-slate-300 hover:bg-slate-900"
                onClick={() => setIsMenuOpen(false)}
              >
                🚤 Rescue Teams
              </Link>
              <Link
                to={ROUTES.user.notifications}
                className="p-2 rounded-lg text-slate-300 hover:bg-slate-900"
                onClick={() => setIsMenuOpen(false)}
              >
                🔔 Alerts & Updates
              </Link>
              <Link
                to={ROUTES.user.profile}
                className="p-2 rounded-lg text-slate-300 hover:bg-slate-900"
                onClick={() => setIsMenuOpen(false)}
              >
                👤 Profile Settings
              </Link>
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  dispatch(logout());
                  void navigate("/login", { replace: true });
                }}
                className="w-full text-left p-2 rounded-lg text-red-400 hover:bg-red-950/40 font-semibold"
              >
                🚪 Sign Out
              </button>

            </nav>
            <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500">
              Emergency Coordination Platform v1.0
            </div>
          </div>
        </div>
      )}


      {/* Main Content Area */}
      <main className="mx-auto w-full max-w-[1600px] px-4 py-5 pb-24 sm:px-6 lg:px-8">{children}</main>


      {/* Mobile-Friendly Bottom Navigation */}
      <UserBottomNav />
    </div>
  );
}

export default UserLayout;