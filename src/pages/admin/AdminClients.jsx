import { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import Spinner from '../../components/Spinner';

export default function AdminClients() {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState(null);
  const [pointsHistory, setPointsHistory] = useState(null);

  useEffect(() => {
    if (search.length >= 3) {
      searchClients();
    } else if (search.length === 0) {
      loadAll();
    }
  }, [search, page]);

  async function loadAll() {
    setLoading(true);
    try {
      const res = await api.get(`/customers?page=${page}&limit=20`);
      setClients(res.data);
      setTotal(res.total);
    } catch {
    } finally {
      setLoading(false);
    }
  }

  async function searchClients() {
    setLoading(true);
    try {
      const res = await api.get(`/customers/search?q=${search}`);
      setClients(res);
      setTotal(res.length);
    } catch {
    } finally {
      setLoading(false);
    }
  }

  async function viewDetails(client) {
    setSelected(client);
    const hist = await api.get(`/points/customer/${client.customer_id}`).catch(() => null);
    setPointsHistory(hist);
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">Clientes</h1>

      <input
        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-casiana-red max-w-md"
        placeholder="Buscar por DNI/Pasaporte o celular..."
        value={search}
        onChange={e => { setSearch(e.target.value); setPage(1); }}
      />

      {loading ? <Spinner /> : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {['#ID', 'Nombre', 'DNI/Pasaporte', 'Celular', 'Ciudad', 'Puntos', 'Acciones'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {clients.map(c => (
                  <tr key={c.customer_id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-gray-500">#{c.app_id}</td>
                    <td className="px-4 py-3 font-medium">{c.nombre} {c.apellido}</td>
                    <td className="px-4 py-3 text-gray-600">{c.dni_passport}</td>
                    <td className="px-4 py-3 text-gray-600">{c.celular}</td>
                    <td className="px-4 py-3 text-gray-600">{c.ciudad}</td>
                    <td className="px-4 py-3 font-bold text-casiana-red">{c.puntos_disponibles?.toLocaleString('es-AR')}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => viewDetails(c)} className="text-casiana-blue text-xs hover:underline">Ver</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!search && (
            <div className="px-4 py-3 border-t flex items-center justify-between text-sm text-gray-500">
              <span>Total: {total}</span>
              <div className="flex gap-2">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="btn-secondary text-xs px-3 py-1 disabled:opacity-40">← Ant</button>
                <span>Pág {page}</span>
                <button disabled={page * 20 >= total} onClick={() => setPage(p => p + 1)} className="btn-secondary text-xs px-3 py-1 disabled:opacity-40">Sig →</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal detalle */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-lg font-bold">{selected.nombre} {selected.apellido}</h2>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm mb-4">
              <div><span className="text-gray-500">ID App:</span> #{selected.app_id}</div>
              <div><span className="text-gray-500">DNI:</span> {selected.dni_passport}</div>
              <div><span className="text-gray-500">Celular:</span> {selected.celular}</div>
              <div><span className="text-gray-500">Email:</span> {selected.email}</div>
              <div><span className="text-gray-500">Ciudad:</span> {selected.ciudad}</div>
              <div><span className="text-gray-500 font-bold">Puntos:</span> <span className="font-bold text-casiana-red">{selected.puntos_disponibles?.toLocaleString('es-AR')}</span></div>
            </div>
            <h3 className="font-semibold text-sm mb-2">Historial de puntos</h3>
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {pointsHistory?.transactions?.map(t => (
                <div key={t.id} className="flex justify-between text-xs p-2 rounded bg-gray-50">
                  <span className="text-gray-600">{t.descripcion}</span>
                  <span className={t.tipo === 'ganado' || t.tipo === 'revertido' ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                    {t.tipo === 'ganado' || t.tipo === 'revertido' ? '+' : ''}{t.cantidad}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
