export function InputField({
  label,
  value,
  onChange,
  placeholder,
  icon,
  type = 'text',
}) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50 shadow-inner">
        {icon && <div className="text-gray-500 mr-2">{icon}</div>}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none"
        />
      </div>
    </div>
  )
}
