import { useState } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";

export default function PasswordField({
    label = "Contraseña",
    placeholder = "••••••••",
    value,
    onChange,
    name = "password",
    autoComplete = "current-password",
}) {
    const [show, setShow] = useState(false);

    return (
        <div>
            <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor={name}
            >
                {label}
            </label>
            <div className="relative">
                <input
                    id={name}
                    name={name}
                    type={show ? "text" : "password"}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#1F5E89]"
                />
                <button
                    type="button"
                    className="absolute inset-y-0 right-0 px-3 text-gray-500 hover:text-[#1F5E89] transition-colors"
                    onClick={() => setShow((s) => !s)}
                    aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                    {show ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                </button>
            </div>
        </div>
    );
}
