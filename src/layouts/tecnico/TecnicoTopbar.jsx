import { Bell, LogOut } from "lucide-react"

export default function TecnicoTopbar({ onMenuClick }) {
  return (
    <header className="bg-[#2B6CB0] text-white h-14 flex items-center justify-between px-6 sticky top-0 z-50 shadow-md">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
        </div>
        <h1 className="text-lg font-semibold">Ticket-Help</h1>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative hover:bg-white/10 p-2 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium">T</span>
          </div>
          <span className="text-sm font-medium">Técnico</span>
        </div>

        <button className="hover:bg-white/10 p-2 rounded-lg transition-colors">
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  )
}
