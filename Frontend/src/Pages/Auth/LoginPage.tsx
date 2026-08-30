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
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-100 antialiased">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600 font-bold text-white shadow-xl shadow-red-950/50 text-2xl">
          🚨
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          Emergency Response
        </h1>
        <p className="text-xs text-slate-400 font-mono uppercase tracking-wider">
          Flood Coordination Platform · Login
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8 shadow-2xl space-y-6">
          <form
            onSubmit={(e) => {
              void handleSubmit(e);
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-mono font-bold uppercase text-slate-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="citizen@emergency.org or rescue@emergency.org"
                value={email}
                onChange={handleEmailChange}
                disabled={isLoading}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase text-slate-300 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={handlePasswordChange}
                disabled={isLoading}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-red-500 focus:outline-none"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-950/40 p-3 text-xs text-red-400 font-mono">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-red-600 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-red-950/50 hover:bg-red-500 active:scale-95 transition"
            >
              {isLoading ? "Authenticating..." : "LOGIN"}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="font-bold text-red-400 hover:underline">
              Continue to Signup →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;