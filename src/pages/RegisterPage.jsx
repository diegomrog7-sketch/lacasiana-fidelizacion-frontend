import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Alert from '../components/Alert';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: '', apellido: '', email: '', password: '', confirm_password: '',
    dni_passport: '', ciudad: '', celular: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function set(field) {
    return e => setForm(prev => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.password !== form.confirm_password) {
      return setError('Las contraseñas no coinciden');
    }
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/app/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-casiana-red to-casiana-red-dark flex items-center justify-center p-4 py-8">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-8">
        <div className="flex flex-col items-center mb-6">
          <img src="/logo.png" alt="La Casiana" className="h-12 mb-2" onError={e => e.target.style.display='none'} />
          <h1 className="text-xl font-bold text-casiana-red">Crear cuenta</h1>
          <p className="text-gray-500 text-xs text-center">Completá tus datos para sumarte al programa</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
              <input type="text" required className="input-field" placeholder="Juan"
                value={form.nombre} onChange={set('nombre')} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
              <input type="text" className="input-field" placeholder="Pérez"
                value={form.apellido} onChange={set('apellido')} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">DNI / Pasaporte *</label>
            <input type="text" required className="input-field" placeholder="12345678"
              value={form.dni_passport} onChange={set('dni_passport')} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Celular *</label>
            <input type="text" required className="input-field" placeholder="1112345678"
              value={form.celular} onChange={set('celular')} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
            <input type="text" className="input-field" placeholder="Buenos Aires"
              value={form.ciudad} onChange={set('ciudad')} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input type="email" required className="input-field" placeholder="juan@email.com"
              value={form.email} onChange={set('email')} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña *</label>
            <input type="password" required className="input-field" placeholder="Mín. 6 caracteres"
              value={form.password} onChange={set('password')} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar contraseña *</label>
            <input type="password" required className="input-field" placeholder="Repetí tu contraseña"
              value={form.confirm_password} onChange={set('confirm_password')} />
          </div>

          <Alert type="error" message={error} onClose={() => setError('')} />

          <button type="submit" disabled={loading} className="btn-primary w-full py-3">
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          ¿Ya tenés cuenta?{' '}
          <Link to="/login" className="text-casiana-red font-medium hover:underline">Ingresar</Link>
        </p>
      </div>
    </div>
  );
}
