import { useEffect } from "react";
import MainRoutes from "@/Routes/MainRoutes";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { fetchCurrentUser } from "@/Redux/slices/authSlice";

function App() {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const user = useAppSelector((state) => state.auth.user);
  const status = useAppSelector((state) => state.auth.status);

  useEffect(() => {
    if (token && !user) {
      void dispatch(fetchCurrentUser());
    }
  }, [dispatch, token, user]);

  const isRestoringSession = Boolean(token) && !user && status !== "failed";

  if (isRestoringSession) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  return <MainRoutes />;
}

export default App;