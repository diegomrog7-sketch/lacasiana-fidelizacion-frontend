import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';
import Alert from '../../components/Alert';

const stars = [1, 2, 3, 4, 5];

export default function CustomerExperience() {
  const { user } = useAuth();
  const [branches, setBranches] = useState([]);
  const [form, setForm] = useState({ branch_id: '', texto: '', rating: 0 });
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/branches').then(setBranches).catch(() => {});
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.branch_id) return setStatus({ type: 'error', msg: 'Seleccioná una sucursal' });
    setLoading(true);
    try {
      const res = await api.post('/experiences', form);
      setStatus({ type: 'success', msg: res.message });
      setForm({ branch_id: '', texto: '', rating: 0 });
    } catch (err) {
      setStatus({ type: 'error', msg: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="page-title">Tu Experiencia</h1>
      <p className="text-sm text-gray-500">
        Contanos cómo fue tu experiencia de compra. Tu opinión nos ayuda a mejorar.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="card bg-gray-50">
          <p className="text-sm font-medium text-gray-700 mb-1">Tus datos</p>
          <p className="text-sm text-gray-600">{user?.nombre} {user?.apellido}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sucursal *</label>
          <select
            className="input-field"
            value={form.branch_id}
            onChange={e => setForm({ ...form, branch_id: e.target.value })}
            required
          >
            <option value="">Seleccioná una sucursal...</option>
            {branches.map(b => (
              <option key={b.id} value={b.id}>{b.nombre}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Calificación</label>
          <div className="flex gap-2">
            {stars.map(s => (
              <button
                key={s} type="button"
                onClick={() => setForm({ ...form, rating: s })}
                className={`text-3xl transition-transform hover:scale-110 ${s <= form.rating ? '' : 'grayscale opacity-40'}`}
              >
                ⭐
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contanos tu experiencia *</label>
          <textarea
            className="input-field resize-none"
            rows={5}
            required
            placeholder="¿Cómo fue tu visita? ¿Qué podríamos mejorar?"
            value={form.texto}
            onChange={e => setForm({ ...form, texto: e.target.value })}
          />
        </div>

        <Alert type={status.type || 'error'} message={status.msg} onClose={() => setStatus({ type: '', msg: '' })} />

        <button type="submit" disabled={loading} className="btn-primary w-full py-3">
          {loading ? 'Enviando...' : '💬 Enviar mi experiencia'}
        </button>
      </form>
    </div>
  );
}
