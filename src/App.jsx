import AppRoutes from "./router/routes";
import { AuthProvider } from "./pages/auth/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
