import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "./Loader";

function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <Loader texto="Verificando sesión..." />;
  if (!isAuthenticated && !loading) return <Navigate to="/login" replace />;

  return <Outlet />;
}

export default ProtectedRoute;
