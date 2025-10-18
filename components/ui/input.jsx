export function Input({ className = "", ...props }) {
  return (
    <input
      className={`border rounded-xl px-3 py-2 w-full outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      {...props}
    />
  );
}
