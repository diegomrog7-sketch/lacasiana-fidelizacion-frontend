import { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import Spinner from '../../components/Spinner';

export default function ReaderClients() {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (search.length >= 3) {
      api.get(`/customers/search?q=${search}`).then(r => { setClients(r); setTotal(r.length); }).catch(() => {}).finally(() => setLoading(false));
    } else if (search.length === 0) {
      api.get('/customers?limit=50').then(r => { setClients(r.data); setTotal(r.total); }).catch(() => {}).finally(() => setLoading(false));
    }
  }, [search]);

  if (loading) return <Spinner />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Clientes ({total})</h1>
      </div>
      <input className="border border-gray-300 rounded-lg px-3 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-casiana-red"
        placeholder="Buscar por DNI/Pasaporte o celular..."
        value={search} onChange={e => setSearch(e.target.value)} />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {['#ID', 'Nombre', 'DNI/Pasaporte', 'Celular', 'Ciudad', 'Puntos', 'Registrado'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {clients.map(c => (
                <tr key={c.customer_id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-400 font-mono text-xs">#{c.app_id}</td>
                  <td className="px-4 py-3 font-medium">{c.nombre} {c.apellido}</td>
                  <td className="px-4 py-3 text-gray-600">{c.dni_passport}</td>
                  <td className="px-4 py-3 text-gray-600">{c.celular}</td>
                  <td className="px-4 py-3 text-gray-600">{c.ciudad}</td>
                  <td className="px-4 py-3 font-bold text-casiana-red">{c.puntos_disponibles?.toLocaleString('es-AR')}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{new Date(c.created_at).toLocaleDateString('es-AR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
