export function Button({ children, className = "", ...props }) {
  return (
    <button
      className={`px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition font-semibold ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
