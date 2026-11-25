import { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import Alert from '../../components/Alert';

export default function AdminConfig() {
  const [config, setConfig] = useState({ pp_ratio: '', app_name: '' });
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/admin/config').then(setConfig).catch(() => {});
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/admin/config', config);
      setStatus({ type: 'success', msg: 'Configuración guardada correctamente' });
    } catch (err) {
      setStatus({ type: 'error', msg: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Configuración</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Nombre de la app
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-casiana-red"
            value={config.app_name || ''}
            onChange={e => setConfig({ ...config, app_name: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Equivalencia PP/Pesos
          </label>
          <p className="text-xs text-gray-500 mb-2">
            Cuántos pesos equivalen a 1 Punto de Promoción. Ej: si ponés 100, cada $100 = 1 punto.
          </p>
          <div className="flex items-center gap-3">
            <input
              type="number" min="0.01" step="0.01" required
              className="w-40 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-casiana-red"
              value={config.pp_ratio || ''}
              onChange={e => setConfig({ ...config, pp_ratio: e.target.value })}
            />
            <span className="text-gray-600 text-sm">pesos = 1 punto</span>
          </div>
          {config.pp_ratio && (
            <p className="text-xs text-casiana-red mt-1">
              Con esta configuración: $1.000 = {Math.floor(1000 / parseFloat(config.pp_ratio || 1))} punto(s)
            </p>
          )}
        </div>

        <Alert type={status.type || 'error'} message={status.msg} onClose={() => setStatus({ type: '', msg: '' })} />
        <button type="submit" disabled={loading} className="btn-primary w-full py-3">
          {loading ? 'Guardando...' : 'Guardar configuración'}
        </button>
      </form>
    </div>
  );
}
