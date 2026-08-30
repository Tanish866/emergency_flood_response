import { useState, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "@/Routes/paths";
import RescueBottomNav from "@/components/BottomNav/RescueBottomNav";
import { useAppDispatch } from "@/hooks/redux";
import { logout } from "@/Redux/slices/authSlice";

interface RescueLayoutProps {
  children: ReactNode;
}

function RescueLayout({ children }: RescueLayoutProps) {
  const [teamStatus, setTeamStatus] = useState<"AVAILABLE" | "DISPATCHED" | "OFFLINE">("AVAILABLE");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();


  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-cyan-500 selection:text-white">
      {/* Rescue Operational Top Header */}
      <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/95 shadow-xl backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          {/* Left: Branding & Status */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:text-white"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <Link to={ROUTES.rescueTeam.dashboard} className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-600 font-bold text-white shadow-md shadow-cyan-900/50">
                🚤
              </div>
              <div>
                <span className="font-display text-base font-bold tracking-tight text-white">
                  Emergency Response — Rescue Team
                </span>
                <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                  <span className="text-cyan-400 font-semibold uppercase">LIVE DISPATCH</span>
                  <span className="rounded bg-amber-500/20 px-1 py-0.5 text-amber-300 border border-amber-500/30">
                    DEMO DATA
                  </span>
                </div>
              </div>
            </Link>

          </div>

          {/* Right: Team Availability Status Toggle & Notifications */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() =>
                setTeamStatus((prev) =>
                  prev === "AVAILABLE" ? "DISPATCHED" : prev === "DISPATCHED" ? "OFFLINE" : "AVAILABLE"
                )
              }
              className={`hidden sm:flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-mono font-bold border transition ${
                teamStatus === "AVAILABLE"
                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                  : teamStatus === "DISPATCHED"
                  ? "bg-amber-500/20 text-amber-400 border-amber-500/30 animate-pulse"
                  : "bg-slate-800 text-slate-400 border-slate-700"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  teamStatus === "AVAILABLE"
                    ? "bg-emerald-400 animate-ping"
                    : teamStatus === "DISPATCHED"
                    ? "bg-amber-400"
                    : "bg-slate-500"
                }`}
              />
              <span>{teamStatus}</span>
            </button>

            <Link
              to={ROUTES.rescueTeam.requests}
              className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:text-white"
            >
              🔔
              <span className="absolute -right-1 -top-1 flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Side Drawer Menu */}
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
              <span className="font-bold text-sm text-slate-200">Rescue Operational Menu</span>
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <nav className="flex flex-col space-y-2 text-sm font-medium">
              <Link
                to={ROUTES.rescueTeam.dashboard}
                className="p-2.5 rounded-lg bg-slate-800 text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                📊 Command Dashboard
              </Link>
              <Link
                to={ROUTES.rescueTeam.map}
                className="p-2.5 rounded-lg text-slate-300 hover:bg-slate-900"
                onClick={() => setIsMenuOpen(false)}
              >
                🗺️ Navigation Map
              </Link>
              <Link
                to={ROUTES.rescueTeam.requests}
                className="p-2.5 rounded-lg text-slate-300 hover:bg-slate-900"
                onClick={() => setIsMenuOpen(false)}
              >
                🚨 Emergency Requests
              </Link>
              <Link
                to={ROUTES.rescueTeam.profile}
                className="p-2.5 rounded-lg text-slate-300 hover:bg-slate-900"
                onClick={() => setIsMenuOpen(false)}
              >
                🚤 Unit Profile
              </Link>
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  dispatch(logout());
                  void navigate("/login", { replace: true });
                }}
                className="w-full text-left p-2.5 rounded-lg text-red-400 hover:bg-red-950/40 font-semibold"
              >
                🚪 Sign Out
              </button>

            </nav>
          </div>
        </div>
      )}


      {/* Main Operational Body */}
      <main className="mx-auto w-full max-w-[1600px] px-4 py-5 pb-24 sm:px-6 lg:px-8">{children}</main>

      {/* Rescue Operational Bottom Nav */}
      <RescueBottomNav />
    </div>
  );
}

export default RescueLayout;
