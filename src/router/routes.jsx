import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../layouts/administrador/AdminLayout";
import Configuracion from "../pages/administrador/Configuracion";
import Tickets from "../pages/administrador/Tickets";
import UserPage from "../pages/administrador/UserPage";
import EditUserPage from "../pages/administrador/EditUserPage";
export default function AppRoutes() {
  return (
    <Routes>
      {/* redirigir raíz al admin */}
      <Route path="/" element={<Navigate to="/admin" replace />} />

      {/* Rutas del administrador (anidadas en su layout) */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="tickets" element={<Tickets />} />
        <Route path="configuracion" element={<Configuracion />} />
        <Route path="usuarios" element={<UserPage />} />
        <Route path="usuarios/:document" element={<EditUserPage />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<div className="p-6">Página no encontrada</div>} />
    </Routes>
  );
}