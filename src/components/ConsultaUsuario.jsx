import { useState } from "react";

export default function ConsultaUsuario() {
  const [numero, setNumero] = useState("");
  const [usuario, setUsuario] = useState(null);
  const [error, setError] = useState("");

  const manejarBusqueda = async () => {
    if (!numero.trim()) {
      setError("Debe ingresar un número de identificación");
      return;
    }

    try {
      const response = await fetch(
        `https://tickethelp-backend.onrender.com/api/clients/${numero}/`
      );
      const data = await response.json();

      if (response.ok && data.success) {
        setUsuario({ success: true, message: data.message });
        setError("");
      } else {
        setUsuario(null);
        setError(data.message || "Cliente no encontrado");
      }
    } catch (err) {
      setUsuario(null);
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-bold text-gray-800 mb-4">
        Consulta el usuario <span className="text-red-500">*</span>
      </h2>

      <p className="text-gray-600 mb-2 text-sm">
        Ingrese el número de identificación del usuario
      </p>

      {/* Input y botón dentro de un form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();   // evita recarga de la página
          manejarBusqueda();    // ejecuta la búsqueda
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
            setUsuario(null);
          }}
          className="flex-1 border border-gray-300 rounded-lg p-2"
        />

        <button
          type="submit"   // Enter funciona por estar dentro del <form>
          className="bg-blue-600 text-white px-4 rounded-lg hover:bg-blue-700"
        >
          Buscar
        </button>
      </form>

      {/* Mostrar resultado */}
      {usuario && (
        <div className="mt-4 p-4 rounded bg-green-100 text-green-700">
          {usuario.success && "✅ "} {usuario.message}
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 rounded bg-red-100 text-red-700">
          ❌ {error}
        </div>
      )}
    </div>
  );
}
