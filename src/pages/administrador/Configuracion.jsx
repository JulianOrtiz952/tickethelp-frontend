export default function Configuracion() {
  return (
    <section>
      <h1 className="text-2xl font-semibold mb-4">Configuración</h1>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="font-semibold mb-4">Información Personal</h2>
          {/* inputs de ejemplo */}
          <div className="grid gap-3">
            <input className="border rounded p-2" placeholder="Nombre" />
            <input className="border rounded p-2" placeholder="Apellidos" />
            <input className="border rounded p-2" placeholder="Documento" />
            <input className="border rounded p-2" placeholder="Teléfono" />
            <input className="border rounded p-2" placeholder="Correo" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="font-semibold mb-4">Preferencias</h2>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input type="radio" name="tema" defaultChecked /> Claro
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="tema" /> Oscuro
            </label>
          </div>

          <h2 className="font-semibold mt-6 mb-2">Seguridad</h2>
          <div className="grid gap-3">
            <input className="border rounded p-2" placeholder="Contraseña actual" />
            <input className="border rounded p-2" placeholder="Nueva contraseña" />
            <input className="border rounded p-2" placeholder="Confirmar nueva contraseña" />
            <button className="bg-sky-600 text-white rounded px-4 py-2 hover:bg-sky-700">
              Actualizar
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
