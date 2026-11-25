import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../utils/api';
import Alert from '../components/Alert';

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const token = params.get('token');
  const [form, setForm] = useState({ password: '', confirm: '' });
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.password !== form.confirm) return setStatus({ type: 'error', msg: 'Las contraseñas no coinciden' });
    setLoading(true);
    try {
      const res = await api.post('/auth/reset-password', { token, password: form.password });
      setStatus({ type: 'success', msg: res.message });
    } catch (err) {
      setStatus({ type: 'error', msg: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-casiana-red to-casiana-red-dark flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-8">
        <img src="/logo.png" alt="La Casiana" className="h-12 mx-auto mb-4" onError={e => e.target.style.display='none'} />
        <h1 className="text-xl font-bold text-center text-gray-800 mb-6">Nueva contraseña</h1>
        {status.type === 'success' ? (
          <div className="space-y-4">
            <Alert type="success" message={status.msg} />
            <Link to="/login" className="btn-primary w-full py-3 block text-center">Ir al inicio</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nueva contraseña</label>
              <input type="password" required className="input-field" placeholder="Mín. 6 caracteres"
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar contraseña</label>
              <input type="password" required className="input-field" placeholder="Repetí la contraseña"
                value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} />
            </div>
            <Alert type="error" message={status.msg} onClose={() => setStatus({ type: '', msg: '' })} />
            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? 'Guardando...' : 'Guardar contraseña'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
