"use client";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../pages/auth/AuthContext";

export default function Topbar({ onMobileMenuToggle }) {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  function handleLogout() {
    logout();              // limpia sesión + tokens
    nav("/auth/login");    // redirige al login
  }

  return (
    <header className="sticky top-0 z-40 bg-[#1F5E89] text-white shadow-md">
      <div className="flex items-center justify-between px-6 py-3">
        {/* --- Izquierda: logo y menú móvil --- */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMobileMenuToggle}
            className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <img
            src="/logo_ticket-help.svg"
            alt="Ticket-Help Logo"
            className="w-10 h-10"
          />
          <span className="text-xl font-semibold">Ticket-Help</span>
        </div>

        {/* --- Derecha: notificaciones, usuario y logout --- */}
        <div className="flex items-center gap-4">
          {/* 🔔 Notificaciones */}
          <button className="relative p-2 hover:bg-white/10 rounded-full transition-colors">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* 👤 Usuario */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-pink-300 flex items-center justify-center overflow-hidden">
              <svg
                className="w-6 h-6 text-gray-700"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            <div className="hidden md:block text-sm">
              <div className="font-medium">
                {user?.first_name
                  ? `${user.first_name} ${user.last_name || ""}`
                  : "Administrador"}
              </div>
              <div className="text-xs text-gray-200">{user?.role || "ADMIN"}</div>
            </div>
          </div>

          {/* 🚪 Cerrar sesión */}
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Cerrar sesión"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
