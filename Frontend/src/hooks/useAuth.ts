import { useAppSelector } from "@/hooks/redux";

export function useAuth() {
  const { user, token, status, error } = useAppSelector((state) => state.auth);
  const isAuthenticated = Boolean(token && user);

  return { user, token, status, error, isAuthenticated };
}