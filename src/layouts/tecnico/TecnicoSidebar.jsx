"use client";

import { Home, Settings, Bell } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function TecnicoSidebar({ collapsed, onToggle, mobileOpen, onMobileClose }) {
  const menuItems = [
    { icon: Home, label: "Inicio", path: "/tecnico" },
    { icon: Bell, label: "Notificaciones", path: "/tecnico/notificaciones" },
    { icon: Settings, label: "Configuración", path: "/tecnico/configuracion" },
  ];

  return (
    <>
      {mobileOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onMobileClose} />}

      <aside
        className={`fixed left-0 top-14 h-[calc(100vh-3.5rem)] bg-white border-r border-gray-200 transition-all duration-300 z-40 ${collapsed ? "w-16" : "w-64"
          } ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onMobileClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? "bg-[#2B6CB0] text-white" : "text-gray-700 hover:bg-gray-100"
                } ${collapsed ? "justify-center" : ""}`
              }
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
