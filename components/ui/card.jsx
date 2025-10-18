export function Card({ children, className = "" }) {
  return (
    <div className={`bg-white dark:bg-gray-900 rounded-2xl shadow-md p-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = "" }) {
  return <div className={`mt-2 text-gray-800 dark:text-gray-100 ${className}`}>{children}</div>;
}
