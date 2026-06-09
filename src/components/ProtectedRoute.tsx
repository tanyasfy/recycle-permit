import { Navigate, Outlet } from "react-router";
import { useAppSelector } from "../hooks/hooks";

export function ProtectedRoute() {
  const { user } = useAppSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
