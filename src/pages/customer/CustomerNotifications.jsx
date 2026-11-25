import { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import Spinner from '../../components/Spinner';

export default function CustomerNotifications() {
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    api.get('/notifications/my')
      .then(d => setNotifs(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function markRead(id) {
    await api.post(`/notifications/${id}/read`).catch(() => {});
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, leida: true } : n));
  }

  function toggle(id) {
    if (expanded !== id) markRead(id);
    setExpanded(expanded === id ? null : id);
  }

  if (loading) return <Spinner />;

  return (
    <div className="p-4 space-y-3">
      <h1 className="page-title">Notificaciones y Promociones</h1>
      {notifs.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-3">🔔</div>
          <p>No tenés notificaciones</p>
        </div>
      ) : (
        notifs.map(n => (
          <div
            key={n.id}
            className={`card cursor-pointer transition-shadow hover:shadow-md ${!n.leida ? 'border-l-4 border-casiana-red' : ''}`}
            onClick={() => toggle(n.id)}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  {!n.leida && <span className="w-2 h-2 bg-casiana-red rounded-full flex-shrink-0" />}
                  <p className={`text-sm font-semibold ${!n.leida ? 'text-gray-900' : 'text-gray-600'}`}>
                    {n.titulo}
                  </p>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  {new Date(n.created_at).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}
                </p>
              </div>
              <span className="text-gray-400 text-sm">{expanded === n.id ? '▲' : '▼'}</span>
            </div>

            {expanded === n.id && (
              <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                {n.cuerpo && <p className="text-sm text-gray-700 whitespace-pre-wrap">{n.cuerpo}</p>}
                {n.archivo_url && n.tipo === 'foto' && (
                  <img src={n.archivo_url} alt="Promoción" className="rounded-lg w-full" />
                )}
                {n.archivo_url && n.tipo === 'pdf' && (
                  <a
                    href={n.archivo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-casiana-red text-sm hover:underline"
                    onClick={e => e.stopPropagation()}
                  >
                    📎 Ver PDF adjunto
                  </a>
                )}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
