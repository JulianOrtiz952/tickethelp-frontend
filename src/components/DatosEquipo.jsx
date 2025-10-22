import { FaLaptopMedical } from 'react-icons/fa';

export default function DatosEquipo({ equipo, onChange }) {
  return (
    <div className="mb-6">
      <h3 className="flex items-center text-lg font-semibold text-gray-800 mb-4">
      <FaLaptopMedical className="text-green-600 mr-2" size={20} />
      Datos del Equipo <span className="text-red-500">*</span>
      </h3>
      <div className="grid gap-4">
        <input
          type="text"
          name="problema"
          placeholder="Problema principal"
          value={equipo.problema || ""}
          onChange={onChange}
          className="border border-gray-300 rounded-lg p-2"
        />
        <input
          type="text"
          name="equipo"
          placeholder="Equipo"
          value={equipo.equipo || ""}
          onChange={onChange}
          className="border border-gray-300 rounded-lg p-2"
        />
        <textarea
          name="descripcion"
          placeholder="Describe detalladamente el problema o falla del equipo"
          value={equipo.descripcion || ""}
          onChange={onChange}
          className="border border-gray-300 rounded-lg p-2"
        />
      </div>
    </div>
  );
}
