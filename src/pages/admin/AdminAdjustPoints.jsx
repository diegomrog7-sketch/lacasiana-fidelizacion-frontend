import { useState } from 'react';
import { api } from '../../utils/api';
import Alert from '../../components/Alert';

export default function AdminAdjustPoints() {
  const [search, setSearch] = useState('');
  const [client, setClient] = useState(null);
  const [form, setForm] = useState({ cantidad: '', descripcion: '' });
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [loading, setLoading] = useState(false);

  async function handleSearch(e) {
    e.preventDefault();
    if (!search.trim()) return;
    try {
      const res = await api.get(`/customers/search?q=${search}`);
      setClient(res[0] || null);
      setStatus(res[0] ? { type: '', msg: '' } : { type: 'error', msg: 'Cliente no encontrado' });
    } catch (err) {
      setStatus({ type: 'error', msg: err.message });
    }
  }

  async function handleAdjust(e) {
    e.preventDefault();
    if (!client) return;
    setLoading(true);
    setStatus({ type: '', msg: '' });
    try {
      const res = await api.post('/points/adjust', {
        customer_id: client.customer_id,
        cantidad: parseInt(form.cantidad),
        descripcion: form.descripcion,
      });
      setStatus({ type: 'success', msg: `${res.message}. Nuevo saldo: ${res.nuevos_puntos} pts` });
      setClient({ ...client, puntos_disponibles: res.nuevos_puntos });
      setForm({ cantidad: '', descripcion: '' });
    } catch (err) {
      setStatus({ type: 'error', msg: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Modificar Puntos de Cliente</h1>

      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-casiana-red"
          placeholder="Buscar por DNI/Pasaporte o celular..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button type="submit" className="btn-primary px-4">Buscar</button>
      </form>

      {client && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-gray-800">{client.nombre} {client.apellido}</p>
              <p className="text-sm text-gray-500">DNI: {client.dni_passport} | Tel: {client.celular}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Saldo actual</p>
              <p className="text-2xl font-bold text-casiana-red">{client.puntos_disponibles?.toLocaleString('es-AR')}</p>
            </div>
          </div>

          <form onSubmit={handleAdjust} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cantidad de puntos (positivo para sumar, negativo para restar)
              </label>
              <input
                type="number"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-casiana-red"
                placeholder="Ej: 50 o -10"
                value={form.cantidad}
                onChange={e => setForm({ ...form, cantidad: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción / Motivo</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-casiana-red"
                placeholder="Ej: Bonificación especial"
                value={form.descripcion}
                onChange={e => setForm({ ...form, descripcion: e.target.value })}
              />
            </div>
            <Alert type={status.type || 'error'} message={status.msg} onClose={() => setStatus({ type: '', msg: '' })} />
            <button type="submit" disabled={loading} className="btn-primary w-full py-2">
              {loading ? 'Guardando...' : 'Aplicar ajuste'}
            </button>
          </form>
        </div>
      )}

      {!client && status.msg && (
        <Alert type="error" message={status.msg} onClose={() => setStatus({ type: '', msg: '' })} />
      )}
    </div>
  );
}
