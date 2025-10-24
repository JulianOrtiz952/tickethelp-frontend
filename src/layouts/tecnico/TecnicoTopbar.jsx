"use client";

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, LogOut } from "lucide-react";
import { useAuth } from "../../pages/auth/AuthContext";

export default function TecnicoTopbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  // --- Notificaciones de ejemplo (sustituye por tu fetch/socket) ---
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Ticket #124 asignado", desc: "Nuevo ticket para ti", read: false, ts: "hace 2m" },
    { id: 2, title: "Comentario en Ticket #117", desc: "Revisar actualización", read: true, ts: "hace 1h" },
  ]);
  const unread = notifications.filter(n => !n.read).length;

  // --- Popover ---
  const [open, setOpen] = useState(false);
  const popRef = useRef(null);

  useEffect(() => {
    function onDocClick(e) {
      if (!popRef.current) return;
      if (!popRef.current.contains(e.target)) setOpen(false);
    }
    function onEsc(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  function markAllAsRead() {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }

  function handleLogout() {
    logout();           // limpia sesión + tokens
    nav("/auth/login"); // redirige al login
  }

  return (
    <header className="bg-[#2B6CB0] text-white h-14 flex items-center justify-between px-6 sticky top-0 z-50 shadow-md">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center"
          aria-label="Abrir menú"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
        </div>
        <h1 className="text-lg font-semibold">Ticket-Help</h1>
      </div>

      <div className="flex items-center gap-4" ref={popRef}>
        {/* 🔔 Notificaciones */}
        <div className="relative">
          <button
            className="relative hover:bg-white/10 p-2 rounded-lg transition-colors"
            aria-haspopup="menu"
            aria-expanded={open}
            onClick={() => setOpen(v => !v)}
          >
            <Bell className="w-5 h-5" />
            {unread > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-red-500 text-[10px] leading-[18px]
                           text-white rounded-full text-center"
              >
                {unread}
              </span>
            )}
          </button>

          {/* Popover */}
          {open && (
            <div
              role="menu"
              className="absolute right-0 mt-2 w-80 bg-white text-gray-800 rounded-lg shadow-lg ring-1 ring-black/5 overflow-hidden"
            >
              <div className="flex items-center justify-between px-3 py-2 border-b">
                <span className="text-sm font-semibold">Notificaciones</span>
                <button
                  onClick={markAllAsRead}
                  className="text-xs px-2 py-1 rounded hover:bg-gray-100"
                >
                  Marcar todas como leídas
                </button>
              </div>

              <ul className="max-h-80 overflow-auto">
                {notifications.length === 0 ? (
                  <li className="px-4 py-6 text-sm text-gray-500">Sin notificaciones</li>
                ) : (
                  notifications.map(n => (
                    <li
                      key={n.id}
                      className={`px-4 py-3 text-sm border-b last:border-b-0 ${n.read ? "bg-white" : "bg-blue-50"
                        }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-medium">{n.title}</div>
                          <div className="text-gray-600">{n.desc}</div>
                          <div className="text-[11px] text-gray-400 mt-1">{n.ts}</div>
                        </div>
                        {!n.read && (
                          <button
                            onClick={() =>
                              setNotifications(prev =>
                                prev.map(x => (x.id === n.id ? { ...x, read: true } : x))
                              )
                            }
                            className="text-[11px] px-2 py-1 rounded hover:bg-gray-100"
                          >
                            Marcar leído
                          </button>
                        )}
                      </div>
                    </li>
                  ))
                )}
              </ul>

              <div className="px-3 py-2 bg-gray-50 text-right">
                <button
                  onClick={() => {
                    setOpen(false);
                    // Llevar al listado de notificaciones del técnico
                    nav("/tecnico/notificaciones");
                  }}
                  className="text-xs font-medium text-[#2B6CB0] hover:underline"
                >
                  Ver todo
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 👤 Usuario */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium">
              {user?.first_name?.[0]?.toUpperCase() || "T"}
            </span>
          </div>
          <span className="text-sm font-medium">
            {user?.first_name ? `${user.first_name} ${user.last_name || ""}` : "Técnico"}
          </span>
        </div>

        {/* 🚪 Cerrar sesión */}
        <button
          onClick={handleLogout}
          className="hover:bg-white/10 p-2 rounded-lg transition-colors"
          aria-label="Cerrar sesión"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
