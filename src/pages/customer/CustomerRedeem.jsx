import { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import Alert from '../../components/Alert';
import Spinner from '../../components/Spinner';

export default function CustomerRedeem() {
  const [points, setPoints] = useState(0);
  const [activeQR, setActiveQR] = useState(null);
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  // Countdown timer
  useEffect(() => {
    if (!activeQR) return;
    const interval = setInterval(() => {
      const diff = new Date(activeQR.expires_at) - new Date();
      if (diff <= 0) {
        setActiveQR(null);
        loadData();
        clearInterval(interval);
        return;
      }
      const m = Math.floor(diff / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${m}:${s.toString().padStart(2, '0')}`);
    }, 1000);
    return () => clearInterval(interval);
  }, [activeQR]);

  async function loadData() {
    setLoading(true);
    try {
      const [me, qr] = await Promise.all([
        api.get('/customers/me'),
        api.get('/qrcodes/active'),
      ]);
      setPoints(me.puntos_disponibles || 0);
      setActiveQR(qr);
    } catch {
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerate(e) {
    e.preventDefault();
    const qty = parseInt(amount);
    if (!qty || qty <= 0 || qty > points) {
      return setStatus({ type: 'error', msg: `Ingresá entre 1 y ${points} puntos` });
    }
    setGenerating(true);
    setStatus({ type: '', msg: '' });
    try {
      const res = await api.post('/qrcodes/generate', { puntos: qty });
      setActiveQR(res);
      setPoints(p => p - qty);
      setAmount('');
    } catch (err) {
      setStatus({ type: 'error', msg: err.message });
    } finally {
      setGenerating(false);
    }
  }

  async function handleCancel() {
    if (!activeQR) return;
    setCancelling(true);
    try {
      await api.post(`/qrcodes/${activeQR.id}/cancel`);
      setPoints(p => p + activeQR.puntos);
      setActiveQR(null);
      setStatus({ type: 'success', msg: 'QR cancelado. Los puntos fueron devueltos.' });
    } catch (err) {
      setStatus({ type: 'error', msg: err.message });
    } finally {
      setCancelling(false);
    }
  }

  if (loading) return <Spinner />;

  return (
    <div className="p-4 space-y-4">
      <h1 className="page-title">Usar puntos</h1>

      <div className="card text-center bg-casiana-red text-white rounded-xl py-5">
        <p className="text-sm opacity-80">Puntos disponibles</p>
        <p className="text-4xl font-bold">{points.toLocaleString('es-AR')}</p>
      </div>

      <Alert type={status.type || 'error'} message={status.msg} onClose={() => setStatus({ type: '', msg: '' })} />

      {activeQR ? (
        <div className="card space-y-4 text-center">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <p className="text-sm font-semibold text-orange-700">QR activo — expira en</p>
            <p className="text-3xl font-mono font-bold text-orange-600">{timeLeft}</p>
          </div>
          <p className="text-sm text-gray-600">
            <span className="font-bold text-casiana-red">{activeQR.puntos}</span> puntos listos para canjear
          </p>
          <img src={activeQR.qr_image} alt="QR de descuento" className="mx-auto w-56 h-56" />
          <p className="text-xs text-gray-400">Mostrá este QR al cajero de la sucursal</p>
          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="btn-danger w-full"
          >
            {cancelling ? 'Cancelando...' : '✕ Cancelar QR y devolver puntos'}
          </button>
        </div>
      ) : (
        <form onSubmit={handleGenerate} className="card space-y-4">
          <p className="text-sm text-gray-600">
            Indicá cuántos puntos querés usar para generar un código QR de descuento (válido por 1 hora).
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Puntos a canjear (máx. {points})
            </label>
            <input
              type="number" min="1" max={points} required
              className="input-field text-center text-2xl font-bold"
              placeholder="0"
              value={amount}
              onChange={e => setAmount(e.target.value)}
            />
          </div>
          <button type="submit" disabled={generating || points === 0} className="btn-primary w-full py-3">
            {generating ? 'Generando QR...' : '🎫 Generar QR de descuento'}
          </button>
          {points === 0 && (
            <p className="text-xs text-center text-gray-400">No tenés puntos disponibles para canjear</p>
          )}
        </form>
      )}
    </div>
  );
}
