export default function Topbar({ onMenu }) {
  return (
    <header className="sticky top-0 z-40 bg-sky-900 text-white">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            className="md:hidden inline-flex items-center justify-center rounded p-2 hover:bg-sky-800"
            onClick={onMenu}
            aria-label="Abrir menú"
          >
            {/* ícono hamburguesa simple */}
            <span className="block w-5 h-0.5 bg-white mb-1"></span>
            <span className="block w-5 h-0.5 bg-white mb-1"></span>
            <span className="block w-5 h-0.5 bg-white"></span>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xl font-semibold">Ticket-Help</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* campana notificaciones */}
          <div className="w-9 h-9 rounded-full bg-sky-800 grid place-content-center">🔔</div>
          {/* avatar */}
          <div className="w-10 h-10 rounded-full bg-pink-200 grid place-content-center">👩🏻‍💻</div>
        </div>
      </div>
    </header>
  );
}
