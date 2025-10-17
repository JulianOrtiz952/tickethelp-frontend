import React, { useState } from "react";
import ConsultaUsuario from "../../components/ConsultaUsuario";
import DatosCliente from "../../components/DatosCliente";
import DatosEquipo from "../../components/DatosEquipo";

export default function Tickets() {
  const [usuario, setUsuario] = useState(null);
  const [equipo, setEquipo] = useState({});
  const [mensaje, setMensaje] = useState("");

  // recibe datos desde ConsultaUsuario
  const manejarUsuarioEncontrado = (data) => {
    setUsuario(data);
    setMensaje(""); // limpiar mensajes
  };

  // manejar cambios de los inputs de equipo
  const manejarCambioEquipo = (e) => {
    const { name, value } = e.target;
    setEquipo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // validación antes de guardar
  const validarDatos = () => {
    if (!usuario) {
      setMensaje("❌ Debe consultar un cliente antes de guardar el ticket.");
      return false;
    }
    if (!equipo.problema || !equipo.equipo || !equipo.descripcion) {
      setMensaje("❌ Complete todos los campos del equipo antes de guardar.");
      return false;
    }
    return true;
  };

  // guardar todo en localStorage
  const guardarEnLocalStorage = () => {
    if (!validarDatos()) return;

    const datos = { usuario, equipo };
    localStorage.setItem("ticket", JSON.stringify(datos));

    console.log("Ticket guardado:", datos);

    setMensaje("✅ Ticket guardado exitosamente en LocalStorage.");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start p-6">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Gestión de Tickets
        </h1>

        {/* Sección de consulta */}
        <ConsultaUsuario onUsuarioEncontrado={manejarUsuarioEncontrado} />

        {/* Si hay usuario, se muestra dentro del mismo cuadro */}
        {usuario && (
          <>
            <div className="mt-6">
              <DatosCliente usuario={usuario} />
              <DatosEquipo equipo={equipo} onChange={manejarCambioEquipo} />

              <button
                type="button"
                onClick={guardarEnLocalStorage}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 w-full"
              >
                Guardar Ticket
              </button>
            </div>
          </>
        )}

        {/* Mensaje de validación o éxito */}
        {mensaje && (
          <div
            className={`mt-6 p-4 rounded-lg text-center font-medium ${
              mensaje.startsWith("✅")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {mensaje}
          </div>
        )}
      </div>
    </div>
  );
}