import React from "react";
import { Link } from "react-router-dom";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";
import { useAuth } from "../../pages/auth/AuthContext";

/**
 * Unauthorized Component
 * Muestra una pantalla profesional de acceso denegado cuando el usuario
 * no tiene los roles necesarios para ver una ruta.
 */
const Unauthorized = () => {
    const { user } = useAuth();

    // Determina la ruta de inicio según el rol para el botón de retorno
    const getDashboardPath = () => {
        if (!user) return "/auth/login";
        switch (user.role) {
            case "ADMIN":
                return "/admin/tickets/gestionar";
            case "TECH":
                return "/tecnico/tickets";
            case "CLIENT":
                return "/cliente/inicio";
            default:
                return "/auth/login";
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transform transition-all">
                {/* Header con gradiente */}
                <div className="bg-gradient-to-r from-red-500 to-orange-500 h-2" />
                
                <div className="p-8 text-center">
                    {/* Icono de advertencia animado */}
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6 relative">
                        <ShieldAlert className="w-10 h-10 text-red-600 relative z-10" />
                        <div className="absolute inset-0 bg-red-200 rounded-full animate-ping opacity-25" />
                    </div>

                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
                        Acceso Denegado
                    </h1>
                    
                    <p className="text-gray-600 mb-8 leading-relaxed">
                        Lo sentimos, no tienes los permisos necesarios para acceder a esta sección del sistema. 
                        Si crees que esto es un error, contacta al administrador.
                    </p>

                    <div className="space-y-3">
                        <Link
                            to={getDashboardPath()}
                            className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95"
                        >
                            <Home className="w-5 h-5" />
                            Ir a mi Panel Principal
                        </Link>
                        
                        <button 
                            onClick={() => window.history.back()}
                            className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all active:scale-95"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Volver Atrás
                        </button>
                    </div>
                </div>

                {/* Footer decorativo */}
                <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 flex justify-center">
                    <p className="text-xs text-gray-400 font-medium">
                        SISTEMA TICKET-HELP &bull; CONTROL DE SEGURIDAD
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Unauthorized;
