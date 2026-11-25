import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function BranchLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 max-w-lg mx-auto">
      <header className="bg-casiana-red text-white px-4 py-3 flex items-center justify-between shadow">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="La Casiana" className="h-8" onError={e => e.target.style.display='none'} />
          <div>
            <p className="font-bold text-sm">La Casiana</p>
            <p className="text-xs opacity-70">Sucursal</p>
          </div>
        </div>
        <button onClick={() => { logout(); navigate('/login'); }} className="text-white/80 text-sm">Salir</button>
      </header>

      <nav className="bg-white border-b border-gray-200 flex">
        {[
          { to: '/branch/buscar', label: '🔍 Buscar Cliente' },
          { to: '/branch/lector-qr', label: '📷 Lector QR' },
          { to: '/branch/setup', label: '⚙️ Mi Sucursal' },
        ].map(item => (
          <NavLink key={item.to} to={item.to}
            className={({ isActive }) =>
              `flex-1 text-center py-3 text-xs font-medium transition-colors ${isActive ? 'text-casiana-red border-b-2 border-casiana-red' : 'text-gray-500'}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
}
