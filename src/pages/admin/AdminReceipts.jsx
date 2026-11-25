import { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import Spinner from '../../components/Spinner';

export default function AdminReceipts() {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    api.get(`/receipts?page=${page}&limit=30`)
      .then(setReceipts)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page]);

  if (loading) return <Spinner />;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">Comprobantes cargados</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {['Cliente', 'DNI', 'Pto. Venta', 'Nro. Cmp.', 'Fecha', 'Monto', 'Puntos', 'Cargado'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {receipts.map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{r.nombre} {r.apellido}</td>
                  <td className="px-4 py-3 text-gray-500">{r.dni_passport}</td>
                  <td className="px-4 py-3 text-gray-600">{r.punto_venta}</td>
                  <td className="px-4 py-3 text-gray-600">{r.nro_comprobante}</td>
                  <td className="px-4 py-3 text-gray-600">{new Date(r.fecha).toLocaleDateString('es-AR')}</td>
                  <td className="px-4 py-3 font-medium">${parseFloat(r.monto).toLocaleString('es-AR', { minimumFractionDigits: 2 })}</td>
                  <td className="px-4 py-3 font-bold text-green-600">+{r.puntos_sumados}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{new Date(r.created_at).toLocaleString('es-AR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t flex justify-end gap-2 text-sm">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="btn-secondary text-xs px-3 py-1 disabled:opacity-40">← Ant</button>
          <span className="self-center">Pág {page}</span>
          <button disabled={receipts.length < 30} onClick={() => setPage(p => p + 1)} className="btn-secondary text-xs px-3 py-1 disabled:opacity-40">Sig →</button>
        </div>
      </div>
    </div>
  );
}
