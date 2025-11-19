import { Routes, Route, Navigate } from "react-router-dom";
import AdminRoute from "../pages/auth/AdminRoute";
import TechRoute from "../pages/auth/TechRoute";
import ClientRoute from "../pages/auth/ClientRoute";
import Inicio from "../components/welcome"

import AdminLayout from "../layouts/administrador/AdminLayout";
import Configuracion from "../pages/administrador/Configuracion";
import GestionarTickets from "../pages/administrador/GestionarTickets";
import VisualizarTickets from "../pages/administrador/VisualizarTickets";
import UserPage from "../pages/administrador/UserPage";
import EditUserPage from "../pages/administrador/EditUserPage";
import Reportes from "../pages/administrador/Reportes"

import TecnicoLayout from "../layouts/tecnico/TecnicoLayout";
import TicketsAsignados from "../pages/tecnico/page";
import ChangeHistoryPage from "../pages/ChangeHistoryPage";
import NotificationsPage from "../pages/notifications/NotificationsPage";

import ClienteLayout from "../layouts/cliente/ClienteLayout";

// Auth pages
import Login from "../pages/auth/Login";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
//pages cliente
import InicioCliente from "../pages/cliente/InicioCliente";
import TicketsCliente from "../pages/cliente/tickets_cliente";
import ConfiguracionCliente from "../pages/cliente/ConfiguracionCliente";
import NotificacionesCliente from "../pages/cliente/NotificacionesCliente";

export default function AppRoutes() {
  return (
    <Routes>
      {/* raíz -> login */}
      <Route path="/" element={<Navigate to="/auth/login" replace />} />

      {/* Auth (no protegidas) */}
      <Route path="/auth">
        <Route path="login" element={<Login />} />
        <Route path="forgot" element={<ForgotPassword />} />
        <Route path="reset" element={<ResetPassword />} />
      </Route>

      {/* Admin protegido POR ROL */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="inicio" replace />} />
          <Route path="inicio" element={<Inicio />} />
          <Route path="tickets/gestionar" element={<GestionarTickets />} />
          <Route path="tickets/visualizar" element={<VisualizarTickets />} />
          <Route path="configuracion" element={<Configuracion />} />
          <Route path="usuarios" element={<UserPage />} />
          <Route path="usuarios/:document" element={<EditUserPage />} />
          <Route path="notificaciones" element={<NotificationsPage />} />
          <Route path="historialcambios" element={<ChangeHistoryPage />} />
          <Route path="reportes" element={<Reportes />} />
        </Route>
      </Route>

      {/* Técnico protegido POR ROL */}
      <Route element={<TechRoute />}>
        <Route path="/tecnico" element={<TecnicoLayout />}>
          <Route index element={<Navigate to="inicio" replace />} />
          <Route path="inicio" element={<Inicio />} />
          <Route path="tickets" element={<TicketsAsignados />} />
          <Route path="configuracion" element={<Configuracion />} />
          <Route path="notificaciones" element={<NotificationsPage />} />
          <Route path="historialcambios" element={<ChangeHistoryPage />} />
        </Route>
      </Route>

      {/* Cliente protegido POR ROL */}
      <Route element={<ClientRoute />}>
        <Route path="/cliente" element={<ClienteLayout />}>
          <Route index element={<Navigate to="inicio" replace />} />
          <Route path="inicio" element={<Inicio />} />
          <Route path="tickets" element={<TicketsCliente />} />
          <Route path="configuracion" element={<ConfiguracionCliente />} />
          <Route path="notificaciones" element={<NotificacionesCliente />} />
        </Route>
      </Route>


      {/* 404 */}
      <Route path="*" element={<div className="p-6">Página no encontrada</div>} />
    </Routes>
  );
}
