"use client"

import { useEffect, useMemo, useState } from "react"
import Card from "../../components/Card"
import AvatarPicker from "../../components/AvatarPicker"
import { getUserByDocument, updateMe, changePassword, updateProfilePicture } from "../../api/users"

const AVATAR_SEEDS = [
    "Emery",
    "Sophia",
    "Riley",
    "Nolan",
    "Brian",
    "Jocelyn",
    "Andrea",
    "George",
]
function validatePasswordStrength(password) {
  const criteria = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>+\-_/\\]/.test(password),
  }

  const metCriteria = Object.values(criteria).filter(Boolean).length

  let strength = "weak"
  if (metCriteria >= 5) strength = "strong"
  else if (metCriteria >= 3) strength = "medium"

  return { criteria, strength, metCriteria }
}

export default function Configuracion() {
  const [document, setDocument] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [role, setRole] = useState("")
  const [nombre, setNombre] = useState("")
  const [apellido, setApellido] = useState("")
  const [avatarSeed, setAvatarSeed] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("/default_avatar.svg")
  const [isAvatarPickerOpen, setIsAvatarPickerOpen] = useState(false)

  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingPassword, setIsLoadingPassword] = useState(false)
  const [message, setMessage] = useState(null)
  const [passwordMessage, setPasswordMessage] = useState(null)

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

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const passwordStrength = useMemo(() => {
    if (!passwords.new) return null
    return validatePasswordStrength(passwords.new)
  }, [passwords.new])

  const passwordsMatch = passwords.new && passwords.confirm && passwords.new === passwords.confirm

  useEffect(() => {
    loadUserData("13492062") //El caremondá de Julián
  }, [])

  const loadUserData = async (userDocument) => {
    try {
      setIsLoading(true)
      const data = await getUserByDocument(userDocument)
      console.log("[v0] Datos del usuario cargados:", data)

      setDocument(data.document || "")
      setEmail(data.email || "")
      setPhone(data.number || "")
      setRole(data.role === "ADMIN" ? "Administrador" : data.role === "TECH" ? "Técnico" : "Cliente")
      setNombre(data.first_name || "")
      setApellido(data.last_name || "")
            // Avatar por URL
                if (data.profile_picture) {
        setAvatarUrl(data.profile_picture);
      } else {
        const randomSeed = AVATAR_SEEDS[Math.floor(Math.random() * AVATAR_SEEDS.length)];
        setAvatarSeed(randomSeed);
        try {
          await updateProfilePicture(userDocument, randomSeed); // PUT { profile_picture: url }
          setAvatarUrl(`https://api.dicebear.com/9.x/thumbs/png?seed=${encodeURIComponent(randomSeed)}&size=256`);
        } catch (e) {
          console.error("Error al guardar avatar aleatorio:", e);
          // si falla, te quedas con /default_avatar.svg
        }
      }
        } catch (error) {
          console.error(error);
          setMessage({
            type: "error",
            text: "Error al cargar los datos del usuario.",
          });
        } finally {
          setIsLoading(false);
        }
      };

  const handleUpdateProfile = async () => {
    try {
      setIsLoading(true)
      setMessage(null)
      await updateMe(document, {
        first_name: nombre,
        last_name: apellido,
        number: phone,
      })
      setMessage({ type: "success", text: "Información actualizada correctamente" })
      setTimeout(() => setMessage(null), 2500)
    } catch (e) {
      const msg = e.detail || Object.values(e).flat().join(" | ") || "Error al actualizar."
      setMessage({ type: "error", text: msg })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePassword = async () => {
    try {
      setIsLoadingPassword(true)
      setPasswordMessage(null)

      if (!passwords.current || !passwords.new || !passwords.confirm) {
        setPasswordMessage({ type: "error", text: "Complete todos los campos." })
        return
      }
      if (passwords.new !== passwords.confirm) {
        setPasswordMessage({ type: "error", text: "Las nuevas contraseñas no coinciden." })
        return
      }

      await changePassword(document, {
        current_password: passwords.current,
        new_password: passwords.new,
        new_password_confirm: passwords.confirm,
      })

      setPasswordMessage({ type: "success", text: "Contraseña actualizada correctamente" })
      setPasswords({ current: "", new: "", confirm: "" })
      setTimeout(() => setPasswordMessage(null), 2500)
    } catch (e) {
      const msg = "No se pudo cambiar la contraseña."
      setPasswordMessage({ type: "error", text: Array.isArray(msg) ? msg.join(" ") : msg })
    } finally {
      setIsLoadingPassword(false)
    }
  }

  const toggleNotification = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }))
  }

  const handleSelectAvatar = async (seed) => {
    try {
      await updateProfilePicture(document, seed); // sube el archivo real
      setAvatarSeed(seed);
      setAvatarUrl(""); // se puede actualizar tras refetch
    } catch (error) {
      console.error("Error al actualizar el avatar:", error);
      setMessage({ type: "error", text: "Error al actualizar el avatar." });
    }
  };

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-6">Configuración</h1>

      <AvatarPicker
        isOpen={isAvatarPickerOpen}
        onClose={() => setIsAvatarPickerOpen(false)}
        onSelectAvatar={handleSelectAvatar}
        currentSeed={avatarSeed}
      />

      <div className="grid lg:grid-cols-2 gap-6 items-stretch">
        {/* Card Información Personal */}
        <div className="h-full">
          <Card title="Información Personal">
            <div className="flex flex-col items-center mb-6">
              <img
                src={
                  avatarUrl ||
                  `https://api.dicebear.com/9.x/thumbs/png?seed=${encodeURIComponent(
                    avatarSeed
                  )}&size=256`
                }
                alt="Avatar"
                className="w-24 h-24 rounded-full mb-4"
              />
              <button
                onClick={() => setIsAvatarPickerOpen(true)}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2"
              >
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
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ingrese su nombre"
                  disabled={isLoading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                             disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Apellidos</label>
                <input
                  type="text"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  placeholder="Ingrese sus apellidos"
                  disabled={isLoading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                             disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Documento</label>
                <input
                  type="text"
                  value={document}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ingrese su teléfono"
                  disabled={isLoading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                             disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Correo electrónico</label>
                <input
                  type="email"
                  value={email}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rol</label>
                <input
                  type="text"
                  value={role}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                  readOnly
                />
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleUpdateProfile}
                  disabled={isLoading}
                  className="w-full px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 
                             transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed
                             flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Actualizando...
                    </>
                  ) : (
                    "Guardar cambios"
                  )}
                </button>
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
                    <input type="radio" name="tema" defaultChecked className="w-4 h-4 text-teal-600" />
                    <span className="text-sm">Claro</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="tema" className="w-4 h-4 text-teal-600" />
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
              {passwordMessage && (
                <div
                  className={`mb-4 p-3 rounded-lg ${
                    passwordMessage.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
                  }`}
                >
                  {passwordMessage.text}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-2">
                    Contraseña actual
                  </label>
                  <div className="relative">
                    <input
                      id="current-password"
                      type={showPassword.current ? "text" : "password"}
                      value={passwords.current}
                      onChange={(e) => setPasswords((prev) => ({ ...prev, current: e.target.value }))}
                      autoComplete="current-password"
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg [&::-ms-reveal]:hidden [&::-ms-clear]:hidden [&::-webkit-credentials-auto-fill-button]:hidden"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("current")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword.current ? (
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
                            d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                          />
                        </svg>
                      ) : (
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
                            d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                          />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-2">
                    Nueva contraseña
                  </label>
                  <div className="relative">
                    <input
                      id="new-password"
                      type={showPassword.new ? "text" : "password"}
                      value={passwords.new}
                      onChange={(e) => setPasswords((prev) => ({ ...prev, new: e.target.value }))}
                      autoComplete="new-password"
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg [&::-ms-reveal]:hidden [&::-ms-clear]:hidden [&::-webkit-credentials-auto-fill-button]:hidden"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("new")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword.new ? (
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
                            d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                          />
                        </svg>
                      ) : (
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
                            d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                          />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                    </button>
                  </div>

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
                  <div className="relative">
                    <input
                      id="confirm-password"
                      type={showPassword.confirm ? "text" : "password"}
                      value={passwords.confirm}
                      onChange={(e) => setPasswords((prev) => ({ ...prev, confirm: e.target.value }))}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("confirm")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword.confirm ? (
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
                            d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                          />
                        </svg>
                      ) : (
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
                            d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                          />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {passwords.confirm && (
                    <p className={`text-xs mt-1 ${passwordsMatch ? "text-green-600" : "text-red-600"}`}>
                      {passwordsMatch ? "✓ Las contraseñas coinciden" : "✗ Las contraseñas no coinciden"}
                    </p>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleChangePassword}
                    disabled={isLoadingPassword}
                    className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 
                               transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed
                               flex items-center justify-center gap-2"
                  >
                    {isLoadingPassword ? (
                      <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Actualizando...
                      </>
                    ) : (
                      "Actualizar"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPasswords({ current: "", new: "", confirm: "" })
                      setPasswordMessage(null)
                    }}
                    disabled={isLoadingPassword}
                    className="flex-1 px-4 py-2 bg-transparent border border-gray-300 text-gray-700 
                               rounded-lg hover:bg-gray-50 transition-colors font-medium
                               disabled:opacity-50 disabled:cursor-not-allowed"
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
