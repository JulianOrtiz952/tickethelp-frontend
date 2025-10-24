"use client"

import { NavLink } from "react-router-dom"
import { useState } from "react"

const links = [
  {
    to: "/admin",
    label: "Inicio",
    end: true,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
  },
  {
    to: "/admin/tickets",
    label: "Tickets",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
        />
      </svg>
    ),
    submenu: [
      {
        to: "/admin/tickets/gestionar",
        label: "Gestionar Ticket",
      },
      {
        to: "/admin/tickets/visualizar",
        label: "Visualizar Tickets",
      },
    ],
  },
  {
    to: "/admin/cambios",
    label: "Historial de Cambios",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    to: "/admin/usuarios",
    label: "Gestión de Usuarios",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    ),
  },
  {
    to: "/admin/notificaciones",
    label: "Notificaciones",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    ),
  },
  {
    to: "/admin/configuracion",
    label: "Configuración",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
]

export default function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }) {
  const [expandedMenus, setExpandedMenus] = useState({})

  const toggleSubmenu = (label) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }))
  }

  return (
    <>
      {mobileOpen && <div className="fixed inset-0 bg-black/100 z-20 md:hidden" onClick={onMobileClose} />}

      <aside
        className={`fixed z-30 top-16 left-0 h-[calc(100vh-4rem)] bg-gray-50 border-r border-gray-200 shadow-lg transition-all duration-300 ease-out
          ${collapsed ? "w-20" : "w-64"}
          md:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="p-4 hidden md:block">
          <button
            onClick={onToggle}
            className={`w-full text-left font-semibold text-gray-800 hover:text-[#1F5E89] transition-colors ${collapsed ? "flex justify-center" : ""
              }`}
            aria-label={collapsed ? "Expandir menú" : "Contraer menú"}
          >
            {collapsed ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            ) : (
              <span className="text-base">Menú</span>
            )}
          </button>
        </div>

        <nav className={`px-4 space-y-1 ${mobileOpen ? "pt-4 md:pt-0" : "pb-4"}`}>
          {links.map((l) => (
            <div key={l.to}>
              {l.submenu ? (
                <>
                  <button
                    onClick={() => toggleSubmenu(l.label)}
                    className={`w-full flex items-center rounded-lg py-3 text-sm font-medium transition-all duration-300 text-gray-700 hover:bg-gray-200
                     ${collapsed || mobileOpen ? "justify-center px-2 md:justify-center md:px-2" : "gap-3 px-4"}
                     ${mobileOpen ? "md:gap-3 md:px-4" : ""}
                     ${expandedMenus[l.label] ? "bg-gray-200" : ""}`}
                    title={collapsed || mobileOpen ? l.label : undefined}
                  >
                    {l.icon}
                    {!collapsed && !mobileOpen && (
                      <>
                        <span className="md:inline flex-1 text-left">{l.label}</span>
                        <svg
                          className={`w-4 h-4 transition-transform ${expandedMenus[l.label] ? "rotate-180" : ""}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </>
                    )}
                    {!collapsed && mobileOpen && (
                      <>
                        <span className="hidden md:inline flex-1 text-left">{l.label}</span>
                        <svg
                          className={`hidden md:block w-4 h-4 transition-transform ${expandedMenus[l.label] ? "rotate-180" : ""
                            }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </>
                    )}
                  </button>

                  {expandedMenus[l.label] && !collapsed && (
                    <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-300 pl-4">
                      {l.submenu.map((subItem) => (
                        <NavLink
                          key={subItem.to}
                          to={subItem.to}
                          onClick={() => onMobileClose()}
                          className={({ isActive }) =>
                            `flex items-center rounded-lg py-2 px-3 text-sm font-medium transition-all duration-300
                             ${isActive
                              ? "bg-[#1F5E89] text-white shadow-sm"
                              : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                            }`
                          }
                        >
                          <span>{subItem.label}</span>
                        </NavLink>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <NavLink
                  to={l.to}
                  end={l.end}
                  onClick={() => onMobileClose()}
                  className={({ isActive }) =>
                    `flex items-center rounded-lg py-3 text-sm font-medium transition-all duration-300
                     ${isActive ? "bg-[#1F5E89] text-white shadow-sm" : "text-gray-700 hover:bg-gray-200"}
                     ${collapsed || mobileOpen ? "justify-center px-2 md:justify-center md:px-2" : "gap-3 px-4"}
                     ${mobileOpen ? "md:gap-3 md:px-4" : ""}`
                  }
                  title={collapsed || mobileOpen ? l.label : undefined}
                >
                  {l.icon}
                  {!collapsed && !mobileOpen && <span className="md:inline">{l.label}</span>}
                  {!collapsed && mobileOpen && <span className="hidden md:inline">{l.label}</span>}
                </NavLink>
              )}
            </div>
          ))}
        </nav>
      </aside>
    </>
  )
}
