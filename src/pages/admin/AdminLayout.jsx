import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

const navItems = [
  { to: '/admin/stats', label: 'Dashboard', icon: '📊' },
  { to: '/admin/clientes', label: 'Clientes', icon: '👥' },
  { to: '/admin/modificar-puntos', label: 'Ajustar Puntos', icon: '⭐' },
  { to: '/admin/comprobantes', label: 'Comprobantes', icon: '📄' },
  { to: '/admin/qr-usados', label: 'QR Usados', icon: '🎫' },
  { to: '/admin/experiencias', label: 'Experiencias', icon: '💬' },
  { to: '/admin/configuracion', label: 'Configuración', icon: '⚙️' },
  { to: '/admin/usuarios', label: 'Usuarios', icon: '👤' },
];

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white flex flex-col transform transition-transform lg:translate-x-0 lg:static lg:inset-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 flex items-center gap-3 border-b border-gray-700">
          <img src="/logo.png" alt="La Casiana" className="h-10" onError={e => e.target.style.display='none'} />
          <div>
            <p className="font-bold text-sm">La Casiana</p>
            <p className="text-xs text-gray-400">Administrador</p>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto py-3">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                  isActive ? 'bg-casiana-red text-white' : 'text-gray-300 hover:bg-gray-800'
                }`
              }
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button onClick={handleLogout} className="p-4 text-sm text-gray-400 hover:text-white border-t border-gray-700 text-left">
          🚪 Cerrar sesión
        </button>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-600 text-xl">☰</button>
          <span className="font-semibold text-gray-800">Panel Admin</span>
        </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
