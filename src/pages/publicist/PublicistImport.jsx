import { useState } from 'react';
import { api } from '../../utils/api';
import Alert from '../../components/Alert';

export default function PublicistImport() {
  const [file, setFile] = useState(null);
  const [results, setResults] = useState(null);
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [loading, setLoading] = useState(false);

  async function handleImport(e) {
    e.preventDefault();
    if (!file) return setStatus({ type: 'error', msg: 'Seleccioná un archivo' });
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('archivo', file);
      const res = await api.upload('/notifications/import-recipients', fd);
      setResults(res.customers);
      setStatus({ type: 'success', msg: `Se encontraron ${res.found} clientes` });
    } catch (err) {
      setStatus({ type: 'error', msg: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-gray-800">Importar lista de destinatarios</h1>
      <p className="text-sm text-gray-500">
        Subí un archivo TXT, XLS, XLSX u ODS con DNI/Pasaporte o números de celular (uno por línea o columna).
      </p>

      <form onSubmit={handleImport} className="card space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
          <p className="text-4xl mb-2">📂</p>
          <p className="text-sm text-gray-500 mb-3">TXT, XLS, XLSX u ODS</p>
          <input
            type="file"
            accept=".txt,.xls,.xlsx,.ods"
            className="text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-casiana-red file:text-white file:cursor-pointer"
            onChange={e => setFile(e.target.files[0] || null)}
          />
        </div>
        <Alert type={status.type || 'error'} message={status.msg} onClose={() => setStatus({ type: '', msg: '' })} />
        <button type="submit" disabled={loading || !file} className="btn-primary w-full py-3">
          {loading ? 'Procesando...' : 'Importar y verificar'}
        </button>
      </form>

      {results && results.length > 0 && (
        <div className="card space-y-2">
          <p className="font-semibold text-gray-800">Clientes encontrados ({results.length})</p>
          <div className="max-h-60 overflow-y-auto divide-y">
            {results.map(c => (
              <div key={c.id} className="py-2 text-sm flex justify-between">
                <span className="text-gray-800">{c.nombre} {c.apellido}</span>
                <span className="text-gray-500">{c.dni_passport || c.celular}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
