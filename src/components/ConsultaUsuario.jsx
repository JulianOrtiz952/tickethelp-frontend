import { useState } from "react";
import { FaSearch } from 'react-icons/fa';

export default function ConsultaUsuario({ onUsuarioEncontrado }) {
  const [numero, setNumero] = useState("");
  const [error, setError] = useState("");

  const manejarBusqueda = async () => {
    if (!numero.trim()) {
      setError("Debe ingresar un número de identificación");
      onUsuarioEncontrado(null);
      return;
    }

    try {
      const response = await fetch(
        `https://tickethelp-backend.onrender.com/api/clients/${numero}/`
      );
      const data = await response.json();

      if (response.ok && data.success) {
        onUsuarioEncontrado(data.data);
        setError("");
      } else {
        onUsuarioEncontrado(null);
        setError(data.message || "Cliente no encontrado");
      }
    } catch (err) {
      onUsuarioEncontrado(null);
      setError("Error de conexión con el servidor");
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
          className="bg-blue-600 text-white px-4 rounded-lg hover:bg-blue-700"
        >
          Buscar
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
