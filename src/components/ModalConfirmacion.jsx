import { FaUser, FaLaptop, FaTools, FaTimes, FaCheck } from "react-icons/fa";

export default function ModalConfirmacion({ datos, onClose, onConfirm }) {
  const { usuario, equipo, tecnico, admin } = datos;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 mx-4 transition-all duration-300">
        {/* Header con botón de cerrar */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <FaTools className="text-blue-600 mr-2" /> Confirmar Registro del Ticket
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="text-lg" />
          </button>
        </div>

        <p className="text-gray-600 mb-6">
          Verifica los datos antes de confirmar la asignación al técnico.
        </p>

        {/* Línea divisoria */}
        <hr className="border-gray-200 mb-6" />

        {/* Datos del cliente */}
        <div className="bg-blue-50 rounded-xl p-4 mb-4 shadow-sm">
          <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
            <FaUser className="text-blue-500 mr-2" /> Datos del Cliente
          </h3>
          <div className="pl-6 space-y-1 text-gray-700">
            <p><strong>Nombre completo:</strong> {usuario.first_name} {usuario.last_name}</p>
            <p><strong>Documento:</strong> {usuario.document}</p>
            <p><strong>Teléfono:</strong> {usuario.number}</p>
            <p><strong>Correo:</strong> {usuario.email}</p>
          </div>
        </div>

        {/* Datos del equipo */}
        <div className="bg-green-50 rounded-xl p-4 mb-4 shadow-sm">
          <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
            <FaLaptop className="text-green-600 mr-2" /> Datos del Equipo
          </h3>
          <div className="pl-6 space-y-1 text-gray-700">
            <p><strong>Equipo:</strong> {equipo.equipo}</p>
            <p><strong>Problema principal:</strong> {equipo.problema}</p>
            <p><strong>Descripción:</strong> {equipo.descripcion}</p>
          </div>
        </div>

        {/* Asignaciones */}
        <div className="bg-purple-50 rounded-xl p-4 mb-6 shadow-sm">
          <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
            <FaTools className="text-purple-500 mr-2" /> Asignación
          </h3>
          <div className="pl-6 space-y-1 text-gray-700">
            <p><strong>Técnico asignado:</strong> {tecnico}</p>
            <p><strong>Administrador:</strong> {admin}</p>
          </div>
        </div>

        {/* Línea divisoria antes de los botones */}
        <hr className="border-gray-200 mb-6" />

        {/* Botones */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 text-gray-600 flex items-center gap-2 transition-all"
          >
            <FaTimes className="text-sm" />
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-all shadow-sm"
          >
            <FaCheck className="text-sm" />
            Confirmar Registro
          </button>
        </div>
      </div>
    </div>
  );
}
