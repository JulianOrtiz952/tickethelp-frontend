import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../pages/auth/ProtectedRoute";

import AdminLayout from "../layouts/administrador/AdminLayout";
import Configuracion from "../pages/administrador/Configuracion";
import GestionarTickets from "../pages/administrador/GestionarTickets";
import VisualizarTickets from "../pages/administrador/VisualizarTickets"
import UserPage from "../pages/administrador/UserPage";
import EditUserPage from "../pages/administrador/EditUserPage";

// Auth pages (UI)
import Login from "../pages/auth/Login";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

export default function AppRoutes() {
  return (
    <Routes>
      {/* raíz -> login */}
      <Route path="/" element={<Navigate to="/auth/login" replace />} />

<<<<<<< HEAD
      {/* Auth (no protegidas) */}
      <Route path="/auth">
        <Route path="login" element={<Login />} />
        <Route path="forgot" element={<ForgotPassword />} />
        <Route path="reset" element={<ResetPassword />} />
      </Route>

      {/* Admin protegido */}
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          {/* si quieres una portada del admin, puedes poner un index aquí */}
          {/* <Route index element={<Navigate to="tickets" replace />} /> */}
          <Route path="tickets" element={<Tickets />} />
          <Route path="configuracion" element={<Configuracion />} />
          <Route path="usuarios" element={<UserPage />} />
          <Route path="usuarios/:document" element={<EditUserPage />} />
        </Route>
=======
      {/* Rutas del administrador (anidadas en su layout) */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="tickets/gestionar" element={<GestionarTickets />} />
        <Route path="tickets/visualizar" element={<VisualizarTickets />} />

        <Route path="configuracion" element={<Configuracion />} />
        <Route path="usuarios" element={<UserPage />} />
        <Route path="usuarios/:document" element={<EditUserPage />} />
>>>>>>> dd30e13f12791518c832e3906c2a501de9f1b5ec
      </Route>

      {/* 404 */}
      <Route path="*" element={<div className="p-6">Página no encontrada</div>} />
    </Routes>
  );
}
