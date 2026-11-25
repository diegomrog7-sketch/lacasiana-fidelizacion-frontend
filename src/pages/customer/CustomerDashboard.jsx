import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';
import Spinner from '../../components/Spinner';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/customers/me')
      .then(d => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  const puntos = data?.puntos_disponibles || 0;

  return (
    <div className="p-4 space-y-4">
      <div className="card bg-gradient-to-br from-casiana-red to-casiana-red-dark text-white rounded-2xl p-6">
        <p className="text-sm opacity-80">Bienvenido/a</p>
        <h2 className="text-xl font-bold">{data?.nombre} {data?.apellido}</h2>
        <p className="text-xs opacity-70 mt-1">ID: #{data?.app_id}</p>
        <div className="mt-4 bg-white/20 rounded-xl p-4 text-center">
          <p className="text-sm opacity-80">Puntos disponibles</p>
          <p className="text-4xl font-bold">{puntos.toLocaleString('es-AR')}</p>
          <p className="text-xs opacity-70">puntos de promoción</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Link to="/app/cargar" className="card flex flex-col items-center gap-2 py-5 hover:shadow-md transition-shadow text-center">
          <span className="text-3xl">📄</span>
          <span className="text-sm font-semibold text-gray-700">Cargar comprobante</span>
        </Link>
        <Link to="/app/canjear" className="card flex flex-col items-center gap-2 py-5 hover:shadow-md transition-shadow text-center">
          <span className="text-3xl">🎫</span>
          <span className="text-sm font-semibold text-gray-700">Usar puntos</span>
        </Link>
        <Link to="/app/puntos" className="card flex flex-col items-center gap-2 py-5 hover:shadow-md transition-shadow text-center">
          <span className="text-3xl">⭐</span>
          <span className="text-sm font-semibold text-gray-700">Mis puntos</span>
        </Link>
        <Link to="/app/experiencia" className="card flex flex-col items-center gap-2 py-5 hover:shadow-md transition-shadow text-center">
          <span className="text-3xl">💬</span>
          <span className="text-sm font-semibold text-gray-700">Tu Experiencia</span>
        </Link>
      </div>
    </div>
  );
}
