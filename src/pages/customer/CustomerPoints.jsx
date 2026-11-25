import { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import Spinner from '../../components/Spinner';

const tipoStyles = {
  ganado: 'text-green-600',
  usado: 'text-red-600',
  ajuste: 'text-blue-600',
  revertido: 'text-orange-600',
};
const tipoLabel = {
  ganado: '+',
  usado: '-',
  ajuste: '',
  revertido: '+',
};

export default function CustomerPoints() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/points/my')
      .then(d => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="p-4 space-y-4">
      <div className="card bg-casiana-red text-white text-center rounded-xl py-6">
        <p className="text-sm opacity-80">Saldo actual</p>
        <p className="text-4xl font-bold">{(data?.puntos_disponibles || 0).toLocaleString('es-AR')}</p>
        <p className="text-xs opacity-70">puntos disponibles</p>
      </div>

      <h2 className="page-title">Historial de movimientos</h2>

      {data?.transactions?.length === 0 ? (
        <p className="text-center text-gray-400 py-8">No hay movimientos aún</p>
      ) : (
        <div className="space-y-2">
          {data?.transactions?.map(tx => (
            <div key={tx.id} className="card flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-800">{tx.descripcion}</p>
                <p className="text-xs text-gray-400">
                  {new Date(tx.created_at).toLocaleString('es-AR')}
                </p>
              </div>
              <span className={`font-bold text-lg ${tipoStyles[tx.tipo]}`}>
                {tipoLabel[tx.tipo]}{Math.abs(tx.cantidad)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
