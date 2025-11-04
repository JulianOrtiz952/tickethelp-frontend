"use client";

import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { api } from "../api/client"; // ajusta la ruta si tu api está en otra carpeta

export default function ConsultaUsuario({ onUsuarioEncontrado }) {
  const [numero, setNumero] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getAccessToken = () => {
    // soporta ambos almacenamientos
    return (
      sessionStorage.getItem("access") ||
      localStorage.getItem("access") ||
      ""
    );
  };

  const manejarBusqueda = async () => {
    if (!numero.trim()) {
      setError("Debe ingresar un número de identificación");
      onUsuarioEncontrado(null);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = getAccessToken();
      if (!token) {
        setError("Sesión expirada. Inicia sesión nuevamente.");
        onUsuarioEncontrado(null);
        setLoading(false);
        return;
      }

      // Usa tu wrapper api() para heredar baseURL y manejo de errores
      const data = await api(`/api/clients/${numero}/`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // Soporta ambos formatos de respuesta (antes/ahora)
      // 1) { success: true, data: {...} }
      // 2) {...usuario}
      const usuario =
        (data?.success && data?.data) || (data?.document ? data : null);

      if (usuario) {
        onUsuarioEncontrado(usuario);
        setError("");
      } else {
        onUsuarioEncontrado(null);
        setError(data?.message || "Cliente no encontrado");
      }
    } catch (err) {
      // Detección de 401/403/Network
      const msg = `${err?.message || ""}`.toLowerCase();
      if (msg.includes("401") || msg.includes("unauthorized")) {
        setError("No autorizado. Inicia sesión nuevamente.");
      } else if (msg.includes("cors")) {
        setError("Error de conexión (CORS).");
      } else if (msg.includes("failed to fetch")) {
        setError("No se pudo conectar con el servidor.");
      } else {
        setError("Error al consultar el cliente.");
      }
      onUsuarioEncontrado(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-6">
      <h2 className="flex items-center text-lg font-bold text-gray-800 mb-4">
        <FaSearch className="text-blue-600 mr-2" size={18} />
        Consulta el usuario <span className="text-red-500">*</span>
      </h2>
      <p className="text-gray-600 mb-2 text-sm">
        Ingrese el número de identificación del usuario
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          manejarBusqueda();
        }}
        className="flex gap-2"
      >
        <input
          type="text"
          placeholder="Ingrese número de identificación"
          value={numero}
          onChange={(e) => {
            setNumero(e.target.value);
            setError("");
            onUsuarioEncontrado(null);
          }}
          className="flex-1 border border-gray-300 rounded-lg p-2"
        />

        <button
          type="submit"
          disabled={loading}
          className={`px-4 rounded-lg text-white ${
            loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Buscando..." : "Buscar"}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 rounded bg-red-100 text-red-700">
          ❌ {error}
        </div>
      )}
    </div>
  );
}
