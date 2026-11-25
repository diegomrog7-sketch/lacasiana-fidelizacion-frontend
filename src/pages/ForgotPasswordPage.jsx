import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api';
import Alert from '../components/Alert';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', { email });
      setStatus(res.message);
    } catch (err) {
      setStatus(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-casiana-red to-casiana-red-dark flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-8">
        <img src="/logo.png" alt="La Casiana" className="h-12 mx-auto mb-4" onError={e => e.target.style.display='none'} />
        <h1 className="text-xl font-bold text-center text-gray-800 mb-1">Recuperar contraseña</h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          Ingresá tu email y te enviamos un enlace para restablecer tu contraseña.
        </p>
        {status ? (
          <Alert type="success" message={status} />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email" required
              className="input-field"
              placeholder="tu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? 'Enviando...' : 'Enviar enlace'}
            </button>
          </form>
        )}
        <Link to="/login" className="block text-center text-sm text-casiana-red hover:underline mt-4">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
