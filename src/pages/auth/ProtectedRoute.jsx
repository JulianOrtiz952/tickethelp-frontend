import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute() {
    const { loading, isAuthed } = useAuth();
    const loc = useLocation();

    if (loading) return <div className="p-6">Cargando…</div>;
    if (!isAuthed) return <Navigate to="/auth/login" replace state={{ from: loc }} />;
    return <Outlet />;
}
