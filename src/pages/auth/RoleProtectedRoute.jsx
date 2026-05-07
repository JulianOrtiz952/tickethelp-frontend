import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Unauthorized from "../../components/common/Unauthorized";

/**
 * RoleProtectedRoute Component
 * Centraliza la lógica de protección de rutas por autenticación y roles.
 * 
 * @param {string[]} allowedRoles - Lista de roles permitidos (ej: ['ADMIN', 'TECH'])
 */
const RoleProtectedRoute = ({ allowedRoles = [] }) => {
    const { loading, isAuthed, user } = useAuth();
    const location = useLocation();

    // 1. Manejo de estado de carga inicial
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
                <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500 font-medium animate-pulse">Verificando credenciales...</p>
            </div>
        );
    }

    // 2. Verificación de Autenticación
    // Si no está autenticado, redirige al login guardando la ruta intentada
    if (!isAuthed) {
        return <Navigate to="/auth/login" replace state={{ from: location }} />;
    }

    // 3. Verificación de Roles (Autorización)
    // El rol del usuario ya viene normalizado desde el AuthContext (ADMIN, TECH, CLIENT)
    const hasRole = allowedRoles.length === 0 || allowedRoles.includes(user?.role);

    if (!hasRole) {
        return <Unauthorized />;
    }

    // 4. Acceso permitido
    return <Outlet />;
};

export default RoleProtectedRoute;
