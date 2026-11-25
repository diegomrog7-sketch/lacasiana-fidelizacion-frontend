import { useState } from 'react';
import { api } from '../../utils/api';

export default function ReaderExport() {
  const [loading, setLoading] = useState(false);

  async function exportCSV() {
    setLoading(true);
    try {
      const res = await api.get('/customers?limit=10000');
      const clients = res.data;
      const headers = ['ID App', 'Nombre', 'Apellido', 'DNI/Pasaporte', 'Celular', 'Ciudad', 'Email', 'Puntos', 'Registrado'];
      const rows = clients.map(c => [
        c.app_id, c.nombre, c.apellido, c.dni_passport, c.celular,
        c.ciudad, c.email, c.puntos_disponibles,
        new Date(c.created_at).toLocaleDateString('es-AR'),
      ]);
      const csv = [headers, ...rows].map(row => row.map(v => `"${v || ''}"`).join(',')).join('\n');
      const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `clientes_lacasiana_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 max-w-lg">
      <h1 className="text-2xl font-bold text-gray-800">Exportar datos</h1>
      <p className="text-sm text-gray-500">Exportá la información de clientes en formato CSV para usar en Excel u otras herramientas.</p>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">📊</div>
          <div>
            <p className="font-semibold text-gray-800">Listado completo de clientes</p>
            <p className="text-xs text-gray-500">Nombre, DNI, celular, ciudad, email, puntos, fecha de registro</p>
          </div>
        </div>
        <button onClick={exportCSV} disabled={loading} className="btn-primary w-full py-3">
          {loading ? 'Generando...' : '📥 Descargar CSV'}
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-700">
        <p>💡 El archivo se genera en formato CSV con codificación UTF-8. Compatible con Excel, Google Sheets y LibreOffice.</p>
      </div>
    </div>
  );
}
