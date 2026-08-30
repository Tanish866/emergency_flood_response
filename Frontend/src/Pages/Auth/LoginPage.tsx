import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { useAuth } from "@/hooks/useAuth";
import { loginUser } from "@/Redux/slices/authSlice";
import { getDashboardPathForRole } from "@/utils/getDashboardPath";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { status, error } = useAppSelector((state) => state.auth);
  const isLoading = status === "loading";

  // If already authenticated, redirect immediately to role dashboard
  if (isAuthenticated && user) {
    return <Navigate to={getDashboardPathForRole(user.role)} replace />;
  }

  function handleEmailChange(event: ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value);
  }

  function handlePasswordChange(event: ChangeEvent<HTMLInputElement>) {
    setPassword(event.target.value);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(result)) {
      const userRole =
        result.payload?.user?.role ??
        (email.toLowerCase().includes("rescue") || email.toLowerCase().includes("team")
          ? "RESCUE_TEAM"
          : "USER");
      void navigate(getDashboardPathForRole(userRole), {
        replace: true,
      });
    }
  }

  return (
    <div className="relative min-h-screen bg-slate-950 flex flex-col justify-between text-slate-100 antialiased overflow-x-hidden selection:bg-red-500 selection:text-white">
      {/* Fullscreen Atmospheric Flood Rescue Background Image */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{
          backgroundImage: `url('/flood-rescue-bg.jpg')`,
        }}
      />
      {/* Dark Navy / Black Overlay */}
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-slate-950/75 via-slate-950/55 to-slate-950/85 pointer-events-none" />

      {/* 60px Compact Top Navbar */}
      <header className="relative z-10 w-full h-[60px] border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-md px-6 flex items-center shrink-0">
        <div className="mx-auto flex w-full max-w-7xl items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 text-base font-bold text-white shadow-md shadow-red-950">
            🚨
          </span>
          <span className="font-display font-extrabold text-lg text-white tracking-tight">
            Emergency Response
          </span>
        </div>
      </header>

      {/* Main Centered Content */}
      <main className="relative z-10 mx-auto my-auto w-full max-w-[480px] px-4 py-6 flex flex-col items-center">
        {/* Centered Emergency Header Branding */}
        <div className="text-center mb-4 space-y-1.5">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600 text-2xl font-bold text-white shadow-xl shadow-red-950/60">
            🚨
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Emergency Response
          </h1>
          <p className="text-[12px] text-slate-400 font-mono font-semibold uppercase tracking-wider">
            FLOOD COORDINATION PLATFORM • LOGIN
          </p>
        </div>

        {/* Auth Card */}
        <div className="w-full rounded-3xl border border-slate-800/90 bg-slate-950/85 p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-5">
          <form
            onSubmit={(e) => {
              void handleSubmit(e);
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-[13px] font-mono font-bold uppercase text-slate-300 mb-1.5">
                EMAIL ADDRESS
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="rescue1@demo.local"
                  value={email}
                  onChange={handleEmailChange}
                  disabled={isLoading}
                  className="w-full h-11 rounded-xl border border-slate-800 bg-slate-900/90 px-4 pr-10 text-[15px] text-white placeholder-slate-500 focus:border-red-500 focus:outline-none transition"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base pointer-events-none">
                  ✉️
                </span>
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-mono font-bold uppercase text-slate-300 mb-1.5">
                PASSWORD
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={handlePasswordChange}
                  disabled={isLoading}
                  className="w-full h-11 rounded-xl border border-slate-800 bg-slate-900/90 px-4 pr-10 text-[15px] text-white placeholder-slate-500 focus:border-red-500 focus:outline-none transition"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base pointer-events-none">
                  🔒
                </span>
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-950/60 p-3 text-[13px] text-red-400 font-mono">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-[48px] flex items-center justify-center gap-2 rounded-xl bg-red-600 py-3 text-[16px] font-bold uppercase tracking-wider text-white shadow-lg shadow-red-950/60 hover:bg-red-500 active:scale-95 transition"
            >
              <span>{isLoading ? "AUTHENTICATING..." : "LOGIN"}</span>
              <span className="text-lg">→</span>
            </button>
          </form>

          <div className="pt-2 text-center text-[14px] text-slate-400">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="font-bold text-red-400 hover:text-red-300 hover:underline">
              Continue to Signup →
            </Link>
          </div>
        </div>
      </main>

      {/* Bottom Feature Information Bar */}
      <footer className="relative z-10 border-t border-slate-800/60 bg-slate-950/75 backdrop-blur-md px-4 py-4 shrink-0">
        <div className="mx-auto grid max-w-5xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-800/80 bg-slate-900/75 p-3 text-xs backdrop-blur-md">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 text-lg">
              🛡️
            </div>
            <div>
              <h4 className="font-bold text-white">Real-time Alerts</h4>
              <p className="text-[11px] text-slate-400">Get instant flood and weather updates</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-slate-800/80 bg-slate-900/75 p-3 text-xs backdrop-blur-md">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 text-lg">
              👥
            </div>
            <div>
              <h4 className="font-bold text-white">Rescue Coordination</h4>
              <p className="text-[11px] text-slate-400">Connecting citizens with rescue teams</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-slate-800/80 bg-slate-900/75 p-3 text-xs backdrop-blur-md">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-lg">
              🏠
            </div>
            <div>
              <h4 className="font-bold text-white">Shelter Information</h4>
              <p className="text-[11px] text-slate-400">Find nearest shelters and check availability</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-slate-800/80 bg-slate-900/75 p-3 text-xs backdrop-blur-md">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 text-lg">
              📍
            </div>
            <div>
              <h4 className="font-bold text-white">Safe Routes</h4>
              <p className="text-[11px] text-slate-400">Navigate through safe evacuation routes</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LoginPage;