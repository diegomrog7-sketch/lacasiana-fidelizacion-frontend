import { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import Spinner from '../../components/Spinner';

export default function AdminQRHistory() {
  const [records, setRecords] = useState([]);
  const [branches, setBranches] = useState([]);
  const [branchFilter, setBranchFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/branches').then(setBranches).catch(() => {});
    loadData();
  }, []);

  useEffect(() => { loadData(); }, [branchFilter]);

  async function loadData() {
    setLoading(true);
    const url = branchFilter ? `/qrcodes/used?branch_id=${branchFilter}` : '/qrcodes/used';
    api.get(url)
      .then(setRecords)
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">QR Canjeados</h1>
      <div className="flex gap-3 items-center">
        <select
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          value={branchFilter}
          onChange={e => setBranchFilter(e.target.value)}
        >
          <option value="">Todas las sucursales</option>
          {branches.map(b => <option key={b.id} value={b.id}>{b.nombre}</option>)}
        </select>
      </div>

      {loading ? <Spinner /> : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {['Cliente', 'DNI', 'Puntos usados', 'Sucursal', 'Fecha y hora'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {records.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{r.nombre} {r.apellido}</td>
                    <td className="px-4 py-3 text-gray-500">{r.dni_passport}</td>
                    <td className="px-4 py-3 font-bold text-casiana-red">{r.puntos}</td>
                    <td className="px-4 py-3 text-gray-600">{r.sucursal || '—'}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{new Date(r.used_at).toLocaleString('es-AR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
