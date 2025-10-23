import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../layouts/administrador/AdminLayout";
import Configuracion from "../pages/administrador/Configuracion";
import GestionarTickets from "../pages/administrador/GestionarTickets";
import VisualizarTickets from "../pages/administrador/VisualizarTickets"
import UserPage from "../pages/administrador/UserPage";
import EditUserPage from "../pages/administrador/EditUserPage";
import TecnicoLayout from "../layouts/tecnico/TecnicoLayout"
import TicketsAsignados from "../pages/tecnico/page"
export default function AppRoutes() {
  return (
    <Routes>
      {/* redirigir raíz al admin */}
      <Route path="/" element={<Navigate to="/admin" replace />} />

      {/* Rutas del administrador (anidadas en su layout) */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="tickets/gestionar" element={<GestionarTickets />} />
        <Route path="tickets/visualizar" element={<VisualizarTickets />} />

        <Route path="configuracion" element={<Configuracion />} />
        <Route path="usuarios" element={<UserPage />} />
        <Route path="usuarios/:document" element={<EditUserPage />} />
      </Route>

      <Route path="/tecnico" element={<TecnicoLayout />}>
        <Route index element={<Navigate to="tickets" replace />} />
        <Route path="tickets" element={<TicketsAsignados />} />
        <Route path="configuracion" element={<Configuracion />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<div className="p-6">Página no encontrada</div>} />
    </Routes>
  );
}