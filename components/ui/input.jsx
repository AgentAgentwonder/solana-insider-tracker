export function Input({ className = '', ...props }) {
  return (
    <input
      {...props}
      className={`border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 ${className}`}
    />
  )
}
