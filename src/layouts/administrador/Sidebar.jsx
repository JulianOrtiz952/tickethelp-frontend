import { NavLink } from "react-router-dom";

const links = [
  { to: "/admin", label: "Inicio", end: true },
  { to: "/admin/tickets", label: "Tickets" },
  { to: "/admin/cambios", label: "Historial de Cambios" },
  { to: "/admin/usuarios", label: "Gestión de Usuarios" },
  { to: "/admin/configuracion", label: "Configuración" },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* overlay móvil */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-30 bg-black/30 md:hidden ${open ? "block" : "hidden"}`}
      />

      <aside
        className={`fixed z-40 top-0 left-0 h-full w-64 bg-white border-r border-gray-200
        transform transition-transform duration-200 ease-out md:translate-x-0
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="h-16 bg-sky-900 text-white flex items-center px-4">
          <span className="font-semibold">Menú</span>
        </div>

        <nav className="p-4 space-y-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `block rounded px-3 py-2 text-sm font-medium
                 ${isActive ? "bg-sky-100 text-sky-900" : "text-gray-700 hover:bg-gray-100"}`
              }
              onClick={onClose}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
