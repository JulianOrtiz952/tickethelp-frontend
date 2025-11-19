import axios from "axios";

const clienteApi = axios.create({
  baseURL: "https://tickethelp-backend.onrender.com/api",
});

clienteApi.interceptors.request.use(
  (config) => {
    // Buscar el token CORRECTO
    const token =
      sessionStorage.getItem("access") ||
      localStorage.getItem("access");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default clienteApi;
