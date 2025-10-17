export default function TextField({
    label,
    type = "text",
    placeholder,
    value,
    onChange,
    icon,
    autoComplete,
    disabled,
    name,
}) {
    return (
        <div>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={name}>
                    {label}
                </label>
            )}
            <div className="relative">
                {icon && <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">{icon}</span>}
                <input
                    id={name}
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    disabled={disabled}
                    className={`w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pr-10 ${icon ? "pl-10" : ""} focus:outline-none focus:ring-2 focus:ring-[#1F5E89]`}
                />
            </div>
        </div>
    );
}
