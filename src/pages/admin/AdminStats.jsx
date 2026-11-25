import { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import Spinner from '../../components/Spinner';

export default function AdminStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats')
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  const cards = [
    { label: 'Clientes registrados', value: stats?.total_clientes?.toLocaleString('es-AR') || '0', icon: '👥', color: 'bg-blue-500' },
    { label: 'Total ventas', value: `$${parseFloat(stats?.total_ventas || 0).toLocaleString('es-AR', { minimumFractionDigits: 2 })}`, icon: '💰', color: 'bg-green-500' },
    { label: 'Puntos otorgados', value: (stats?.total_puntos_otorgados || 0).toLocaleString('es-AR'), icon: '⭐', color: 'bg-yellow-500' },
    { label: 'QR canjeados', value: (stats?.total_qr_usados || 0).toLocaleString('es-AR'), icon: '🎫', color: 'bg-purple-500' },
    { label: 'Experiencias recibidas', value: (stats?.total_experiencias || 0).toLocaleString('es-AR'), icon: '💬', color: 'bg-casiana-red' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 text-sm">Resumen general del programa de fidelización</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map(c => (
          <div key={c.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className={`w-10 h-10 ${c.color} rounded-lg flex items-center justify-center text-white text-xl mb-3`}>
              {c.icon}
            </div>
            <p className="text-2xl font-bold text-gray-800">{c.value}</p>
            <p className="text-xs text-gray-500 mt-1">{c.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
