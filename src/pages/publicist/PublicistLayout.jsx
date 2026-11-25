import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function PublicistLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 max-w-2xl mx-auto">
      <header className="bg-casiana-red text-white px-4 py-3 flex items-center justify-between shadow">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="La Casiana" className="h-8" onError={e => e.target.style.display='none'} />
          <div>
            <p className="font-bold text-sm">La Casiana</p>
            <p className="text-xs opacity-70">Publicitario</p>
          </div>
        </div>
        <button onClick={() => { logout(); navigate('/login'); }} className="text-white/80 text-sm">Salir</button>
      </header>
      <nav className="bg-white border-b flex">
        {[
          { to: '/publicist/nueva', label: '📢 Nueva notificación' },
          { to: '/publicist/importar', label: '📂 Importar lista' },
        ].map(item => (
          <NavLink key={item.to} to={item.to}
            className={({ isActive }) =>
              `flex-1 text-center py-3 text-sm font-medium ${isActive ? 'text-casiana-red border-b-2 border-casiana-red' : 'text-gray-500'}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <main className="flex-1 p-4"><Outlet /></main>
    </div>
  );
}
