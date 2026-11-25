export default function Logo({ className = 'h-12' }) {
  return (
    <img
      src="/logo.png"
      alt="La Casiana — Lácteos Naturales"
      className={className}
      onError={(e) => {
        e.target.style.display = 'none';
        e.target.nextSibling.style.display = 'block';
      }}
    />
  );
}
