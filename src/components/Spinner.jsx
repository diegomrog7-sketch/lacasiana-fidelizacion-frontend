export default function Spinner({ text = 'Cargando...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <div className="w-8 h-8 border-4 border-casiana-red border-t-transparent rounded-full animate-spin" />
      <span className="text-sm text-gray-500">{text}</span>
    </div>
  );
}
