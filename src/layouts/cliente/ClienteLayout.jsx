"use client";

import { Outlet } from "react-router-dom";
import ClienteSidebar from "./ClienteSidebar";
import ClienteTopbar from "./ClienteTopbar";
import { useState } from "react";

export default function TecnicoLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* TOPBAR */}
      <ClienteTopbar onMobileMenuToggle={() => setMobileMenuOpen((v) => !v)} />

      <div className="flex">
        {/* SIDEBAR */}
        <ClienteSidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((v) => !v)}
          mobileOpen={mobileMenuOpen}
          onMobileClose={() => setMobileMenuOpen(false)}
        />

        {/* CONTENIDO */}
        <main
          className={`flex-1 p-8 transition-all duration-300 ${
            sidebarCollapsed ? "md:ml-20" : "md:ml-64"
          }`}
        >
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
