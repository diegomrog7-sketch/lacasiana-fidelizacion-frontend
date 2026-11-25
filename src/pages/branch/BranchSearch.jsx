import { useState } from 'react';
import { api } from '../../utils/api';
import Alert from '../../components/Alert';

export default function BranchSearch() {
  const [search, setSearch] = useState('');
  const [clients, setClients] = useState([]);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState('');

  async function handleSearch(e) {
    e.preventDefault();
    if (!search.trim()) return;
    try {
      const res = await api.get(`/customers/search?q=${search}`);
      setClients(res);
      setSelected(null);
      if (res.length === 0) setError('No se encontró ningún cliente');
      else setError('');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold text-gray-800">Buscar Cliente</h1>

      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-casiana-red"
          placeholder="DNI, Pasaporte o Nro. celular..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button type="submit" className="btn-primary px-4">🔍</button>
      </form>

      <Alert type="error" message={error} onClose={() => setError('')} />

      {clients.length > 0 && !selected && (
        <div className="space-y-2">
          {clients.map(c => (
            <button
              key={c.customer_id}
              onClick={() => setSelected(c)}
              className="w-full card text-left hover:shadow-md transition-shadow flex items-center justify-between"
            >
              <div>
                <p className="font-semibold text-gray-800">{c.nombre} {c.apellido}</p>
                <p className="text-xs text-gray-500">DNI: {c.dni_passport} | Tel: {c.celular}</p>
              </div>
              <span className="text-casiana-red font-bold">{c.puntos_disponibles} pts →</span>
            </button>
          ))}
        </div>
      )}

      {selected && (
        <div className="card space-y-4">
          <button onClick={() => setSelected(null)} className="text-sm text-gray-400 hover:text-gray-600">← Volver</button>
          <div className="text-center">
            <div className="w-16 h-16 bg-casiana-red rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
              {selected.nombre?.[0]}{selected.apellido?.[0]}
            </div>
            <h2 className="text-xl font-bold text-gray-800">{selected.nombre} {selected.apellido}</h2>
            <p className="text-sm text-gray-500">ID #{selected.app_id}</p>
          </div>
          <div className="bg-casiana-red/10 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-600">Puntos disponibles</p>
            <p className="text-4xl font-bold text-casiana-red">{selected.puntos_disponibles?.toLocaleString('es-AR')}</p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
            <div><span className="text-gray-400">DNI:</span> {selected.dni_passport}</div>
            <div><span className="text-gray-400">Cel:</span> {selected.celular}</div>
            <div><span className="text-gray-400">Ciudad:</span> {selected.ciudad}</div>
            <div><span className="text-gray-400">Email:</span> {selected.email}</div>
          </div>
        </div>
      )}
    </div>
  );
}
