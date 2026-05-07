import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ArrowLeft, Home, RotateCcw } from "lucide-react";
import { useAuth } from "../../pages/auth/AuthContext";

/**
 * PageNotFound Component (404)
 * Visualización profesional para rutas inexistentes con redirección por rol.
 */
const PageNotFound = () => {
    const { user, isAuthed } = useAuth();
    const navigate = useNavigate();

    // Determina la ruta de inicio según el rol
    const getHomePath = () => {
        if (!isAuthed || !user) return "/auth/login";
        
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
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
            <div className="max-w-2xl w-full text-center">
                {/* Ilustración 404 */}
                <div className="relative mb-8 inline-block">
                    <div className="text-[120px] sm:text-[180px] font-black text-slate-200 select-none leading-none">
                        404
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-3xl shadow-2xl flex items-center justify-center transform -rotate-12 border border-slate-100">
                            <Search className="w-12 h-12 sm:w-16 h-16 text-teal-600 animate-bounce" />
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
                        ¡Vaya! Página no encontrada
                    </h1>
                    <p className="text-slate-600 text-lg max-w-md mx-auto leading-relaxed">
                        Parece que te has perdido en el sistema. La página que buscas no existe o ha sido movida.
                    </p>
                </div>

                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        to={getHomePath()}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-teal-200 hover:-translate-y-1 active:scale-95"
                    >
                        <Home className="w-5 h-5" />
                        Volver al Inicio
                    </Link>
                    
                    <button
                        onClick={() => navigate(-1)}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl border border-slate-200 transition-all hover:border-slate-300 active:scale-95 shadow-sm"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Regresar
                    </button>
                </div>

            </div>
        </div>
    );
};

export default PageNotFound;
