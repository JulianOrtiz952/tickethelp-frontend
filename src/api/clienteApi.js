import axios from "axios";

const clienteApi = axios.create({
  baseURL: "http://localhost:8000/api",
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

clienteApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("access");
      sessionStorage.removeItem("access");
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  }
);

export default clienteApi;
