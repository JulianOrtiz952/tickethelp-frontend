import React from "react";
import ConsultaUsuario from "../../components/ConsultaUsuario";

export default function Tickets() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Título general de la página */}
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Gestión de Tickets</h1>

      {/* Sección de consulta de usuario */}
      <ConsultaUsuario />
    </div>
  );
}
