"use client"

import { Outlet } from "react-router-dom"
import TecnicoSidebar from "./TecnicoSidebar"
import TecnicoTopbar from "./TecnicoTopbar"
import { useState } from "react"

export default function TecnicoLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <TecnicoTopbar onMenuClick={() => setMobileMenuOpen((v) => !v)} />

      <div className="flex">
        <TecnicoSidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((v) => !v)}
          mobileOpen={mobileMenuOpen}
          onMobileClose={() => setMobileMenuOpen(false)}
        />

        <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? "ml-0 md:ml-16" : "ml-0 md:ml-64"}`}>
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
