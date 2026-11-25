import { useState, useEffect, useRef } from 'react';
import { api } from '../../utils/api';
import Alert from '../../components/Alert';

export default function BranchQRReader() {
  const [scanning, setScanning] = useState(false);
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [result, setResult] = useState(null);
  const [scanner, setScanner] = useState(null);
  const scannerRef = useRef(null);

  useEffect(() => {
    return () => { scanner?.stop().catch(() => {}); };
  }, [scanner]);

  async function startScanner() {
    setScanning(true);
    setStatus({ type: '', msg: '' });
    setResult(null);
    import('html5-qrcode').then(({ Html5Qrcode }) => {
      const qr = new Html5Qrcode('branch-qr-reader');
      setScanner(qr);
      qr.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: 250 },
        async (token) => {
          await qr.stop().catch(() => {});
          setScanning(false);
          validateToken(token);
        },
        () => {}
      ).catch(() => {
        setScanning(false);
        setStatus({ type: 'error', msg: 'No se pudo acceder a la cámara' });
      });
    });
  }

  function stopScanner() {
    scanner?.stop().catch(() => {});
    setScanning(false);
  }

  async function validateToken(token) {
    try {
      const res = await api.post('/qrcodes/validate', { token });
      setResult({ type: 'success', ...res });
      setStatus({ type: 'success', msg: res.message });
    } catch (err) {
      setStatus({ type: 'error', msg: err.message });
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold text-gray-800">Validar QR de descuento</h1>

      {!scanning ? (
        <button onClick={startScanner} className="btn-primary w-full py-4 text-lg">
          📷 Iniciar lector de QR
        </button>
      ) : (
        <div className="space-y-3">
          <div id="branch-qr-reader" ref={scannerRef} className="rounded-xl overflow-hidden border-2 border-casiana-red" />
          <button onClick={stopScanner} className="btn-danger w-full">Detener cámara</button>
        </div>
      )}

      <Alert type={status.type || 'error'} message={status.msg} onClose={() => setStatus({ type: '', msg: '' })} />

      {result && result.type === 'success' && (
        <div className="card bg-green-50 border-green-200 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">✅</span>
            <p className="font-bold text-green-700">Canje exitoso</p>
          </div>
          <p className="text-green-800">
            <span className="font-bold">{result.puntos}</span> punto{result.puntos !== 1 ? 's' : ''} canjeados
          </p>
          <p className="text-sm text-green-700">
            Cliente: <strong>{result.cliente?.nombre} {result.cliente?.apellido}</strong>
          </p>
          <button onClick={() => { setResult(null); setStatus({ type: '', msg: '' }); }} className="btn-secondary w-full mt-2">
            Leer otro QR
          </button>
        </div>
      )}
    </div>
  );
}
