import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../layouts/administrador/AdminLayout";
import Configuracion from "../pages/administrador/Configuracion";

export default function AppRoutes() {
  return (
    <Routes>
      {/* redirigir raíz al admin */}
      <Route path="/" element={<Navigate to="/admin" replace />} />

      {/* Rutas del administrador (anidadas en su layout) */}
      <Route path="/admin" element={<AdminLayout />}>
        {/* Aquí agreguen sus rutas chicos */}
        <Route path="configuracion" element={<Configuracion />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<div className="p-6">Página no encontrada</div>} />
    </Routes>
  );
}