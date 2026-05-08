"use client";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../pages/auth/AuthContext";

// Fallback: lee el payload del JWT para sacar id/email/nombre cuando el contexto no los trae
function readJwtPayload() {
  try {
    const token =
      sessionStorage.getItem("access") || localStorage.getItem("access");
    if (!token) return {};
    const [, b64] = token.split(".");
    if (!b64) return {};
    return JSON.parse(atob(b64));
  } catch {
    return {};
  }
}

function computeDisplay(user) {
  const p = readJwtPayload();
  const first = user?.user.first_name || p?.first_name || p?.given_name || user?.username || p?.username || "";
  const last = user?.last_name || p?.last_name || p?.family_name || "";
  const name =
    (first || last) ? `${first} ${last}`.trim()
    : user?.first_name || p?.first_name
    || user?.email || p?.email
    || "Usuario";

  const role = user?.role || p?.role || "USER";

  // Prioridad avatar: backend -> dicebear estable con document/email -> ícono fallback
  const seed =
    user?.document || user?.documento || user?.email || p?.document || p?.email || "ticket-help";
  const picture =
    user?.user.profile_picture
      || `https://api.dicebear.com/9.x/thumbs/png?seed=${encodeURIComponent(seed)}&size=128`;

  return { name, role, picture };
}

export default function Topbar({ onMobileMenuToggle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { name, role, picture } = computeDisplay(user);

  function handleLogout() {
    logout();
    navigate("/auth/login");
  }

  const handleNotificationsClick = () => {
    navigate("/admin/notificaciones");
  };

  return (
    <header className="sticky top-0 z-40 bg-[#1F5E89] text-white shadow-md">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Izquierda: menú + marca */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMobileMenuToggle}
            className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Abrir menú"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>

          <img src="/logo_ticket-help.svg" alt="Ticket-Help Logo" className="w-10 h-10" />
          <span className="text-xl font-semibold">Ticket-Help</span>
        </div>

        {/* Derecha: notificaciones + usuario + logout */}
        <div className="flex items-center gap-4">
          {/* Notificaciones */}
          <button onClick={handleNotificationsClick}
          className="relative p-2 hover:bg-white/10 rounded-full transition-colors" aria-label="Notificaciones">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* Usuario */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center overflow-hidden ring-2 ring-white/20">
              {/* Si `picture` es URL, úsala; si falla la carga, quedará el fondo */}
              <img
                src={picture}
                alt="Avatar"
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.style.display = "none"; }}
              />
            </div>
            <div className="hidden md:block text-sm">
              <div className="font-medium leading-tight">{name}</div>
              <div className="text-xs text-gray-200">{role}</div>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Cerrar sesión"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
