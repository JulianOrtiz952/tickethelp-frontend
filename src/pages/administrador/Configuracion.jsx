import Card from "../../components/Card";

export default function Configuracion() {
  return (
    <section>
      <h1 className="text-2xl font-semibold mb-6">Configuración</h1>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Card Información Personal */}
        <Card title="Información Personal">
          <div className="flex flex-col items-center mb-6">
            <img
              src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg"
              alt="Avatar"
              className="w-24 h-24 rounded-full mb-4"
            />
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              <i className="mr-2">📷</i> Cambiar foto
            </button>
            <p className="text-sm text-gray-500 mt-2">PNG o JPG hasta 5MB</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre
              </label>
              <input
                type="text"
                defaultValue="Daniela Alejandra"
                placeholder="Ingrese su nombre"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                           focus:ring-2 focus:ring-red-600 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Apellidos
              </label>
              <input
                type="text"
                defaultValue="Barreto Ibarra"
                placeholder="Ingrese sus apellidos"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                           focus:ring-2 focus:ring-red-600 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Documento
              </label>
              <input
                type="text"
                defaultValue="1005028830"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono
              </label>
              <input
                type="tel"
                placeholder="Ingrese su teléfono"
                defaultValue="3222686993"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                           focus:ring-2 focus:ring-red-600 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correo electrónico
              </label>
              <input
                type="email"
                defaultValue="danielaalejandrabi@ufps.edu.co"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rol
              </label>
              <input
                type="text"
                defaultValue="Administrador"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                readOnly
              />
            </div>
          </div>
        </Card>

        {/* Card Preferencias */}
        <Card title="Preferencias">
          <div className="space-y-6">
            {/* Tema */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tema del sitio
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input type="radio" name="tema" defaultChecked />
                  Claro
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="tema" />
                  Oscuro
                </label>
              </div>
            </div>

            {/* Notificaciones */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notificaciones
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked />
                  Solicitudes de cambio de estado
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked />
                  Alertas de sobreocupación
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" />
                  Tickets finalizados
                </label>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
