import { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import Alert from '../../components/Alert';

export default function PublicistSend() {
  const [form, setForm] = useState({ titulo: '', cuerpo: '', tipo: 'texto' });
  const [sendTo, setSendTo] = useState('all'); // 'all' | 'selected'
  const [customers, setCustomers] = useState([]);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [loading, setLoading] = useState(false);

  async function handleSearch(e) {
    e.preventDefault();
    if (!search.trim()) return;
    const res = await api.get(`/customers/search?q=${search}`).catch(() => []);
    setSearchResults(res);
  }

  function addRecipient(c) {
    if (!selected.find(s => s.customer_id === c.customer_id)) {
      setSelected([...selected, c]);
    }
    setSearch('');
    setSearchResults([]);
  }

  async function handleSend(e) {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', msg: '' });
    try {
      const fd = new FormData();
      fd.append('titulo', form.titulo);
      fd.append('cuerpo', form.cuerpo);
      fd.append('tipo', form.tipo);
      if (sendTo === 'selected') {
        selected.forEach(c => fd.append('recipient_ids', c.customer_id));
      }
      if (file) fd.append('archivo', file);

      const res = await api.upload('/notifications', fd);
      setStatus({ type: 'success', msg: res.message });
      setForm({ titulo: '', cuerpo: '', tipo: 'texto' });
      setSelected([]);
      setFile(null);
    } catch (err) {
      setStatus({ type: 'error', msg: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-gray-800">Nueva notificación / Promoción</h1>

      <form onSubmit={handleSend} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
          <input required className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-casiana-red"
            value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
          <textarea rows={4} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-casiana-red resize-none"
            value={form.cuerpo} onChange={e => setForm({ ...form, cuerpo: e.target.value })} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Adjuntar archivo (PDF o imagen)</label>
          <input type="file" accept=".pdf,image/*"
            className="text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-casiana-red file:text-white file:text-sm file:cursor-pointer"
            onChange={e => {
              const f = e.target.files[0];
              if (f) {
                setFile(f);
                setForm({ ...form, tipo: f.type === 'application/pdf' ? 'pdf' : 'foto' });
              }
            }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Destinatarios</label>
          <div className="flex gap-3">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="radio" name="sendTo" value="all" checked={sendTo === 'all'} onChange={() => setSendTo('all')} />
              Todos los clientes
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="radio" name="sendTo" value="selected" checked={sendTo === 'selected'} onChange={() => setSendTo('selected')} />
              Clientes seleccionados
            </label>
          </div>
        </div>

        {sendTo === 'selected' && (
          <div className="card bg-gray-50 space-y-3">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                placeholder="Buscar por DNI o celular..."
                value={search} onChange={e => setSearch(e.target.value)} />
              <button type="submit" className="btn-secondary text-sm px-3">Buscar</button>
            </form>
            {searchResults.map(c => (
              <button key={c.customer_id} onClick={() => addRecipient(c)}
                className="w-full text-left text-sm p-2 bg-white rounded-lg border hover:border-casiana-red">
                {c.nombre} {c.apellido} — {c.dni_passport}
              </button>
            ))}
            {selected.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Seleccionados ({selected.length}):</p>
                <div className="flex flex-wrap gap-1">
                  {selected.map(c => (
                    <span key={c.customer_id} className="bg-casiana-red text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      {c.nombre} {c.apellido}
                      <button onClick={() => setSelected(selected.filter(s => s.customer_id !== c.customer_id))} className="opacity-70 hover:opacity-100">×</button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <Alert type={status.type || 'error'} message={status.msg} onClose={() => setStatus({ type: '', msg: '' })} />

        <button type="submit" disabled={loading} className="btn-primary w-full py-3">
          {loading ? 'Enviando...' : '📢 Enviar notificación'}
        </button>
      </form>
    </div>
  );
}
