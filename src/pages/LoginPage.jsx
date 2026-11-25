import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Alert from '../components/Alert';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      const routes = {
        customer: '/app/dashboard',
        admin: '/admin/stats',
        branch: '/branch/buscar',
        publicist: '/publicist/nueva',
        data_reader: '/reader/clientes',
      };
      navigate(routes[user.role] || '/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-casiana-red to-casiana-red-dark flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-8">
        <div className="flex flex-col items-center mb-6">
          <img src="/logo.png" alt="La Casiana" className="h-16 mb-2" onError={e => e.target.style.display='none'} />
          <h1 className="text-2xl font-bold text-casiana-red">La Casiana</h1>
          <p className="text-gray-500 text-sm">Programa de Fidelización</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email" required
              className="input-field"
              placeholder="tu@email.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input
              type="password" required
              className="input-field"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <Alert type="error" message={error} onClose={() => setError('')} />
          <button type="submit" disabled={loading} className="btn-primary w-full py-3">
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <div className="mt-4 text-center space-y-2">
          <Link to="/forgot-password" className="text-sm text-casiana-red hover:underline block">
            ¿Olvidaste tu contraseña?
          </Link>
          <p className="text-sm text-gray-500">
            ¿Sos cliente y no tenés cuenta?{' '}
            <Link to="/register" className="text-casiana-red font-medium hover:underline">Registrate</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
