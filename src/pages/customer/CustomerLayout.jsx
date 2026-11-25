import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';
import { api } from '../../utils/api';

const navItems = [
  { to: '/app/dashboard', icon: '🏠', label: 'Inicio' },
  { to: '/app/puntos', icon: '⭐', label: 'Puntos' },
  { to: '/app/cargar', icon: '📄', label: 'Cargar' },
  { to: '/app/canjear', icon: '🎫', label: 'Canjear' },
  { to: '/app/notificaciones', icon: '🔔', label: 'Notif.' },
];

export default function CustomerLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    api.get('/notifications/unread-count')
      .then(d => setUnread(d.count))
      .catch(() => {});
  }, []);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 max-w-md mx-auto">
      {/* Header */}
      <header className="bg-casiana-red text-white px-4 py-3 flex items-center justify-between shadow">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="La Casiana" className="h-8" onError={e => e.target.style.display='none'} />
          <span className="font-bold text-sm">La Casiana</span>
        </div>
        <button onClick={handleLogout} className="text-white/80 hover:text-white text-sm">Salir</button>
      </header>

      {/* Contenido */}
      <main className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </main>

      {/* Nav inferior */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200 flex z-50">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center py-2 text-xs gap-0.5 transition-colors ${
                isActive ? 'text-casiana-red font-semibold' : 'text-gray-500'
              }`
            }
          >
            <span className="relative text-xl leading-none">
              {item.icon}
              {item.to.includes('notif') && unread > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {unread > 9 ? '9+' : unread}
                </span>
              )}
            </span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
