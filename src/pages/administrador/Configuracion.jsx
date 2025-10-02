"use client"

import { useState } from "react"
import Card from "../../components/Card"

export default function Configuracion() {
  const [notifications, setNotifications] = useState({
    solicitudes: true,
    alertas: true,
    tickets: false,
  })

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  })

const toggleNotification = (key) => {
  setNotifications((prev) => ({ 
    ...prev, 
    [key]: !prev[key] 
  }));
};


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
              <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
              <input
                type="text"
                defaultValue="Daniela Alejandra"
                placeholder="Ingrese su nombre"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                           focus:ring-2 focus:ring-red-600 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Apellidos</label>
              <input
                type="text"
                defaultValue="Barreto Ibarra"
                placeholder="Ingrese sus apellidos"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                           focus:ring-2 focus:ring-red-600 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Documento</label>
              <input
                type="text"
                defaultValue="1005028830"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
              <input
                type="tel"
                placeholder="Ingrese su teléfono"
                defaultValue="3222686993"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                           focus:ring-2 focus:ring-red-600 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Correo electrónico</label>
              <input
                type="email"
                defaultValue="danielaalejandrabi@ufps.edu.co"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rol</label>
              <input
                type="text"
                defaultValue="Administrador"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                readOnly
              />
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          {/* Card Preferencias */}
          <Card title="Preferencias">
            <div className="space-y-6">
              {/* Tema */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Tema del sitio</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="tema"
                      defaultChecked
                      className="w-4 h-4 text-red-600 focus:ring-red-500"
                    />
                    <span className="text-sm">Claro</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="tema" className="w-4 h-4 text-red-600 focus:ring-red-500" />
                    <span className="text-sm">Oscuro</span>
                  </label>
                </div>
              </div>

              {/* Notificaciones */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Notificaciones</label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Solicitudes de cambio de estado</span>
                    <button
                      type="button"
                      onClick={() => toggleNotification("solicitudes")}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
                        notifications.solicitudes ? "bg-teal-600" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notifications.solicitudes ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Alertas de sobreocupación</span>
                    <button
                      type="button"
                      onClick={() => toggleNotification("alertas")}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
                        notifications.alertas ? "bg-teal-600" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notifications.alertas ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Tickets finalizados</span>
                    <button
                      type="button"
                      onClick={() => toggleNotification("tickets")}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
                        notifications.tickets ? "bg-teal-600" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notifications.tickets ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card title="Seguridad">
            <div className="space-y-4">
              <div>
                <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña actual
                </label>
                <input
                  id="current-password"
                  type="password"
                  value={passwords.current}
                  onChange={(e) => setPasswords((prev) => ({ ...prev, current: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-2">
                  Nueva contraseña
                </label>
                <input
                  id="new-password"
                  type="password"
                  value={passwords.new}
                  onChange={(e) => setPasswords((prev) => ({ ...prev, new: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar nueva contraseña
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords((prev) => ({ ...prev, confirm: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
                >
                  Actualizar
                </button>
                <button
                  type="button"
                  className="flex-1 px-4 py-2 bg-transparent border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
