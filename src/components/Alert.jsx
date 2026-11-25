export default function Alert({ type = 'error', message, onClose }) {
  if (!message) return null;
  const styles = {
    error: 'bg-red-50 border-red-200 text-red-700',
    success: 'bg-green-50 border-green-200 text-green-700',
    info: 'bg-blue-50 border-blue-200 text-blue-700',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-700',
  };
  return (
    <div className={`border rounded-lg px-4 py-3 text-sm flex items-start justify-between gap-2 ${styles[type]}`}>
      <span>{message}</span>
      {onClose && (
        <button onClick={onClose} className="text-lg leading-none opacity-60 hover:opacity-100">×</button>
      )}
    </div>
  );
}
