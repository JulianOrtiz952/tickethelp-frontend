"use client"

import { useState, useMemo } from "react"
import Card from "../../components/Card"

function validatePasswordStrength(password) {
  const criteria = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>/+.]/.test(password),
  };

  const metCriteria = Object.values(criteria).filter(Boolean).length;

  let strength = "weak";
  if (metCriteria >= 5) strength = "strong";
  else if (metCriteria >= 3) strength = "medium";

  return { criteria, strength, metCriteria };
}


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

  const passwordStrength = useMemo(() => {
    if (!passwords.new) return null
    return validatePasswordStrength(passwords.new)
  }, [passwords.new])

  const passwordsMatch = passwords.new && passwords.confirm && passwords.new === passwords.confirm

const toggleNotification = (key) => {
  setNotifications((prev) => ({ 
    ...prev, 
    [key]: !prev[key] 
  }));
};

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-6">Configuración</h1>

      <div className="grid lg:grid-cols-2 gap-6 items-stretch">
        {/* Card Información Personal */}
        <div className="h-full">
          <Card title="Información Personal">
            <div className="flex flex-col items-center mb-6">
              <img
                src="/default_avatar.svg"
                alt="Avatar"
                className="w-24 h-24 rounded-full mb-4"
              />
              <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
                  />
                </svg>
                Cambiar foto
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Apellidos</label>
                <input
                  type="text"
                  defaultValue="Barreto Ibarra"
                  placeholder="Ingrese sus apellidos"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
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
        </div>

        <div className="h-full flex flex-col gap-6">
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
                      className="w-4 h-4 text-red-600"
                    />
                    <span className="text-sm">Claro</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="tema" className="w-4 h-4 text-red-600" />
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
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
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
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
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
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
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

          <div className="flex-1">
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  />

                  {passwords.new && (
                    <div className="mt-2 space-y-2">
                      <div className="flex gap-1">
                        <div
                          className={`h-2 flex-1 rounded-full transition-colors ${
                            passwordStrength?.metCriteria >= 1
                              ? passwordStrength.strength === "weak"
                                ? "bg-red-500"
                                : passwordStrength.strength === "medium"
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                              : "bg-gray-200"
                          }`}
                        />
                        <div
                          className={`h-2 flex-1 rounded-full transition-colors ${
                            passwordStrength?.metCriteria >= 3
                              ? passwordStrength.strength === "medium"
                                ? "bg-yellow-500"
                                : passwordStrength.strength === "strong"
                                  ? "bg-green-500"
                                  : "bg-gray-200"
                              : "bg-gray-200"
                          }`}
                        />
                        <div
                          className={`h-2 flex-1 rounded-full transition-colors ${
                            passwordStrength?.strength === "strong" ? "bg-green-500" : "bg-gray-200"
                          }`}
                        />
                      </div>

                      <div className="text-xs space-y-1 text-gray-600">
                        <div className={passwordStrength?.criteria.minLength ? "text-green-600" : ""}>
                          {passwordStrength?.criteria.minLength ? "✓" : "○"} Mínimo 8 caracteres
                        </div>
                        <div className={passwordStrength?.criteria.hasUpperCase ? "text-green-600" : ""}>
                          {passwordStrength?.criteria.hasUpperCase ? "✓" : "○"} Una letra mayúscula
                        </div>
                        <div className={passwordStrength?.criteria.hasLowerCase ? "text-green-600" : ""}>
                          {passwordStrength?.criteria.hasLowerCase ? "✓" : "○"} Una letra minúscula
                        </div>
                        <div className={passwordStrength?.criteria.hasNumber ? "text-green-600" : ""}>
                          {passwordStrength?.criteria.hasNumber ? "✓" : "○"} Un número
                        </div>
                        <div className={passwordStrength?.criteria.hasSpecialChar ? "text-green-600" : ""}>
                          {passwordStrength?.criteria.hasSpecialChar ? "✓" : "○"} Un carácter especial
                        </div>
                      </div>
                    </div>
                  )}
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  />
                  {passwords.confirm && (
                    <p className={`text-xs mt-1 ${passwordsMatch ? "text-green-600" : "text-red-600"}`}>
                      {passwordsMatch ? "✓ Las contraseñas coinciden" : "✗ Las contraseñas no coinciden"}
                    </p>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    className="flex-1 px-4 py-2 bg-[#1F5E89] text-white rounded-lg hover:bg-[#1B4B6C] transition-colors font-medium"
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
      </div>
    </section>
  )
}
