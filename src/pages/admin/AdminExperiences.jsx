import { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import Spinner from '../../components/Spinner';

export default function AdminExperiences() {
  const [experiences, setExperiences] = useState([]);
  const [branches, setBranches] = useState([]);
  const [filters, setFilters] = useState({ branch_id: '', from: '', to: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/branches').then(setBranches).catch(() => {});
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.branch_id) params.set('branch_id', filters.branch_id);
    if (filters.from) params.set('from', filters.from);
    if (filters.to) params.set('to', filters.to);
    api.get(`/experiences?${params}`)
      .then(setExperiences)
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">Experiencias de Compra</h1>

      <div className="flex flex-wrap gap-3">
        <select
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          value={filters.branch_id}
          onChange={e => setFilters({ ...filters, branch_id: e.target.value })}
        >
          <option value="">Todas las sucursales</option>
          {branches.map(b => <option key={b.id} value={b.id}>{b.nombre}</option>)}
        </select>
        <input type="date" className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          value={filters.from} onChange={e => setFilters({ ...filters, from: e.target.value })} />
        <input type="date" className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          value={filters.to} onChange={e => setFilters({ ...filters, to: e.target.value })} />
        <button onClick={loadData} className="btn-primary px-4 py-2 text-sm">Filtrar</button>
      </div>

      {loading ? <Spinner /> : (
        <div className="space-y-3">
          {experiences.length === 0 && (
            <p className="text-center text-gray-400 py-8">No hay experiencias con esos filtros</p>
          )}
          {experiences.map(e => (
            <div key={e.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-gray-800">{e.nombre} {e.apellido}</p>
                  <p className="text-xs text-gray-400">{e.dni_passport} — {e.sucursal}</p>
                </div>
                <div className="text-right">
                  {e.rating && <p className="text-yellow-500">{'⭐'.repeat(e.rating)}</p>}
                  <p className="text-xs text-gray-400">{new Date(e.created_at).toLocaleString('es-AR')}</p>
                </div>
              </div>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{e.texto}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
