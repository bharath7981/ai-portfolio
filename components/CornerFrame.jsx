// components/CornerFrame.jsx
export default function CornerFrame({ className = "", children }) {
  return (
    <div className={`relative rounded-2xl ${className}`}>
      <span className="pointer-events-none absolute -top-px -left-px h-4 w-4 border-t-2 border-l-2 border-signal/60 rounded-tl-2xl transition-colors duration-300 group-hover:border-signal z-20" />
      <span className="pointer-events-none absolute -top-px -right-px h-4 w-4 border-t-2 border-r-2 border-signal/60 rounded-tr-2xl transition-colors duration-300 group-hover:border-signal z-20" />
      <span className="pointer-events-none absolute -bottom-px -left-px h-4 w-4 border-b-2 border-l-2 border-signal/60 rounded-bl-2xl transition-colors duration-300 group-hover:border-signal z-20" />
      <span className="pointer-events-none absolute -bottom-px -right-px h-4 w-4 border-b-2 border-r-2 border-signal/60 rounded-br-2xl transition-colors duration-300 group-hover:border-signal z-20" />
      {children}
    </div>
  );
}
