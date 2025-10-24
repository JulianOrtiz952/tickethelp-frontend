import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function AdminRoute() {
    const { loading, isAuthed, user } = useAuth();
    const loc = useLocation();

    if (loading) return <div className="flex items-center justify-center min-h-screen text-gray-500">Cargando…</div>;
    if (!isAuthed) return <Navigate to="/auth/login" replace state={{ from: loc }} />;
    if (user?.role !== "ADMIN") return <Navigate to="/tecnico/tickets" replace />;

    return <Outlet />;
}
