import apiClient from "@/config/axios";
import type {
  AuthResponse,
  AuthUser,
  LoginPayload,
  RegisterPayload,
} from "@/types/auth";

// NOTE: Endpoints below are ASSUMED (no backend yet).
// Update this file only, once the real backend contract is available.

export async function loginRequest(
  payload: LoginPayload,
): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<{ data?: AuthResponse; user?: AuthUser; token?: string }>("/auth/login", payload);
    const resData = response.data?.data || response.data;

    if (resData && "user" in resData && "token" in resData) {
      return resData as AuthResponse;
    }
    
    throw new Error("Invalid response payload format from authentication server.");
  } catch (err) {
    console.warn("Backend auth offline or format error. Using demo authentication fallback.", err);
    // Demo Mock Authentication Logic
    const emailLower = payload.email.toLowerCase();
    const isAdmin = emailLower.includes("admin");
    const isRescue = emailLower.includes("rescue") || emailLower.includes("team");

    const role: AuthUser["role"] = isAdmin ? "ADMIN" : isRescue ? "RESCUE_TEAM" : "USER";
    const name = isAdmin
      ? "System Admin (Disaster Response)"
      : isRescue
      ? "Officer Davis (Rescue Unit 04)"
      : "Citizen User";

    return {
      token: "demo-jwt-token-flood-response-2026",
      user: {
        id: isAdmin ? "admin-user-01" : isRescue ? "rescue-user-04" : "citizen-user-01",
        email: payload.email,
        name,
        role,
      },
    };

  }
}

export async function registerRequest(
  payload: RegisterPayload,
): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<{ data?: AuthResponse; user?: AuthUser; token?: string }>(
      "/auth/register",
      payload,
    );
    const resData = response.data?.data || response.data;

    if (resData && "user" in resData && "token" in resData) {
      return resData as AuthResponse;
    }

    throw new Error("Invalid response payload format from authentication server.");
  } catch (err) {
    console.warn("Backend auth offline or format error. Using demo registration fallback.", err);
    return {
      token: "demo-jwt-token-flood-response-2026",
      user: {
        id: `user-${Date.now()}`,
        email: payload.email,
        name: payload.name,
        phone: payload.phone,
        role: payload.role || "USER",
      },
    };
  }
}

export async function fetchCurrentUserRequest(): Promise<AuthUser> {
  try {
    const response = await apiClient.get<{ data?: AuthUser; user?: AuthUser }>("/auth/me");
    const resData = response.data?.data || response.data;

    if (resData && "role" in resData) {
      return resData;
    }

    throw new Error("Invalid user profile format");
  } catch (err) {
    const savedUser = localStorage.getItem("user");
    if (savedUser && savedUser !== "undefined" && savedUser !== "null") {
      try {
        return JSON.parse(savedUser) as AuthUser;
      } catch {
        localStorage.removeItem("user");
      }
    }
    throw err;
  }
}

export async function logoutRequest(): Promise<void> {
  try {
    await apiClient.post("/auth/logout");
  } catch (err) {
    console.warn("Backend logout notification failed, clearing local session.", err);
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
}





