// components/ui/card.jsx
export function Card({ children, className = '' }) {
  return (
    <div className={`rounded-xl border bg-white shadow-sm p-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`border-b pb-2 mb-2 font-semibold text-lg ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '' }) {
  return (
    <h2 className={`text-xl font-bold leading-tight ${className}`}>
      {children}
    </h2>
  );
}

export function CardContent({ children, className = '' }) {
  return (
    <div className={`pt-2 text-gray-700 ${className}`}>
      {children}
    </div>
  );
}
