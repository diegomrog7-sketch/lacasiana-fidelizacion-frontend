import { useState, useRef, useEffect } from 'react';
import { api } from '../../utils/api';
import Alert from '../../components/Alert';

export default function CustomerReceipt() {
  const [mode, setMode] = useState('manual'); // 'manual' | 'qr'
  const [form, setForm] = useState({ punto_venta: '', nro_comprobante: '', fecha: '', monto: '' });
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [loading, setLoading] = useState(false);
  // Usamos ref para evitar closures stale en el cleanup del scanner
  const scannerRef = useRef(null);

  function set(field) {
    return e => setForm({ ...form, [field]: e.target.value });
  }

  // QR scanner — arranca/para según el modo
  useEffect(() => {
    if (mode !== 'qr') return;

    let cancelled = false;
    import('html5-qrcode').then(({ Html5Qrcode }) => {
      if (cancelled) return;
      const qr = new Html5Qrcode('receipt-qr-reader');
      scannerRef.current = qr;
      qr.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: 250 },
        (decoded) => {
          try {
            const data = JSON.parse(decoded);
            setForm({
              punto_venta: data.pv || data.punto_venta || '',
              nro_comprobante: data.cmp || data.nro || data.nro_comprobante || '',
              fecha: data.fecha || new Date().toISOString().split('T')[0],
              monto: data.monto || data.total || '',
            });
            qr.stop().catch(() => {});
            scannerRef.current = null;
            setMode('manual');
            setStatus({ type: 'info', msg: 'Datos del comprobante cargados. Verificá y confirmá.' });
          } catch {
            // QR sin el formato esperado, se ignora
          }
        },
        () => {}
      ).catch(() => setMode('manual'));
    });

    return () => {
      cancelled = true;
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
        scannerRef.current = null;
      }
    };
  }, [mode]);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus({ type: '', msg: '' });
    setLoading(true);
    try {
      const res = await api.post('/receipts', form);
      setStatus({ type: 'success', msg: res.message });
      setForm({ punto_venta: '', nro_comprobante: '', fecha: '', monto: '' });
    } catch (err) {
      setStatus({ type: 'error', msg: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="page-title">Cargar comprobante</h1>

      <div className="flex rounded-lg border border-gray-200 overflow-hidden">
        {['manual', 'qr'].map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              mode === m ? 'bg-casiana-red text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            {m === 'manual' ? '✏️ Manual' : '📷 Leer QR'}
          </button>
        ))}
      </div>

      {mode === 'qr' && (
        <div className="card">
          <p className="text-sm text-gray-500 mb-3 text-center">Apuntá la cámara al QR del ticket</p>
          <div id="receipt-qr-reader" ref={scannerRef} className="rounded-lg overflow-hidden" />
        </div>
      )}

      {mode === 'manual' && (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Punto de venta *</label>
            <input className="input-field" required placeholder="Ej: 0001"
              value={form.punto_venta} onChange={set('punto_venta')} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nro. de comprobante *</label>
            <input className="input-field" required placeholder="Ej: 00001234"
              value={form.nro_comprobante} onChange={set('nro_comprobante')} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de compra *</label>
            <input type="date" className="input-field" required
              value={form.fecha} onChange={set('fecha')} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Monto total ($) *</label>
            <input type="number" step="0.01" min="0.01" className="input-field" required placeholder="0.00"
              value={form.monto} onChange={set('monto')} />
          </div>

          <Alert type={status.type || 'error'} message={status.msg} onClose={() => setStatus({ type: '', msg: '' })} />

          <button type="submit" disabled={loading} className="btn-primary w-full py-3">
            {loading ? 'Cargando...' : 'Confirmar comprobante'}
          </button>
        </form>
      )}

      <div className="card bg-blue-50 border-blue-100 text-blue-700 text-xs">
        <p>💡 Cada comprobante solo puede cargarse una vez. Verificá el punto de venta y nro. de comprobante.</p>
      </div>
    </div>
  );
}
