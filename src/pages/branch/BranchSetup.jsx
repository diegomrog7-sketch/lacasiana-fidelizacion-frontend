import { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import Alert from '../../components/Alert';

export default function BranchSetup() {
  const [form, setForm] = useState({ nombre: '', direccion: '' });
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/branches').then(branches => {
      // Buscar si ya tiene sucursal registrada para el usuario actual
      // (el backend la retorna si el user_id coincide)
    }).catch(() => {});
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/branches', form);
      setStatus({ type: 'success', msg: 'Sucursal registrada correctamente' });
    } catch (err) {
      setStatus({ type: 'error', msg: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold text-gray-800">Datos de mi Sucursal</h1>
      <p className="text-sm text-gray-500">Registrá o actualizá los datos de esta sucursal.</p>

      <form onSubmit={handleSubmit} className="card space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la sucursal *</label>
          <input required className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-casiana-red"
            placeholder="Ej: Sucursal Centro"
            value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
          <input className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-casiana-red"
            placeholder="Calle 123, Ciudad"
            value={form.direccion} onChange={e => setForm({ ...form, direccion: e.target.value })} />
        </div>
        <Alert type={status.type || 'error'} message={status.msg} onClose={() => setStatus({ type: '', msg: '' })} />
        <button type="submit" disabled={loading} className="btn-primary w-full py-3">
          {loading ? 'Guardando...' : 'Guardar datos'}
        </button>
      </form>
    </div>
  );
}
