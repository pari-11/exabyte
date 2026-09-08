export default function Card({ className = "", children, ...props }) {
  return (
    <div
      className={`bg-white border border-line rounded-xl shadow-sm p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
