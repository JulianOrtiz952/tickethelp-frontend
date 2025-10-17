// Componente DatosCliente
import { FaUser } from "react-icons/fa";

export default function DatosCliente({ usuario }) {
  return (
    <div className="mb-6">
      <h3 className="flex items-center text-lg font-semibold text-gray-800 mb-4">
        <FaUser className="text-blue-600 mr-2" size={20} />
        Datos del Cliente      
        </h3>
      <div className="grid gap-4">
        <input
          type="text"
          placeholder="Nombre completo"
          value={`${usuario?.first_name || ""} ${usuario?.last_name || ""}`}
          readOnly
          className="border border-gray-300 rounded-lg p-2 bg-gray-100 cursor-not-allowed"
        />
        <input
          type="text"
          placeholder="Cédula, pasaporte o RUC"
          value={usuario?.document || ""}
          readOnly
          className="border border-gray-300 rounded-lg p-2 bg-gray-100 cursor-not-allowed"
        />
        <input
          type="text"
          placeholder="Número de contacto"
          value={usuario?.number || ""}
          readOnly
          className="border border-gray-300 rounded-lg p-2 bg-gray-100 cursor-not-allowed"
        />
        <input
          type="email"
          placeholder="correo@ejemplo.com"
          value={usuario?.email || ""}
          readOnly
          className="border border-gray-300 rounded-lg p-2 bg-gray-100 cursor-not-allowed"
        />
      </div>
    </div>
  );
}
