import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Spinner from './components/Spinner';

// Auth
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

// Customer (PWA)
import CustomerLayout from './pages/customer/CustomerLayout';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import CustomerPoints from './pages/customer/CustomerPoints';
import CustomerReceipt from './pages/customer/CustomerReceipt';
import CustomerRedeem from './pages/customer/CustomerRedeem';
import CustomerNotifications from './pages/customer/CustomerNotifications';
import CustomerExperience from './pages/customer/CustomerExperience';

// Admin
import AdminLayout from './pages/admin/AdminLayout';
import AdminClients from './pages/admin/AdminClients';
import AdminAdjustPoints from './pages/admin/AdminAdjustPoints';
import AdminReceipts from './pages/admin/AdminReceipts';
import AdminQRHistory from './pages/admin/AdminQRHistory';
import AdminExperiences from './pages/admin/AdminExperiences';
import AdminConfig from './pages/admin/AdminConfig';
import AdminUsers from './pages/admin/AdminUsers';
import AdminStats from './pages/admin/AdminStats';

// Branch
import BranchLayout from './pages/branch/BranchLayout';
import BranchSearch from './pages/branch/BranchSearch';
import BranchQRReader from './pages/branch/BranchQRReader';
import BranchSetup from './pages/branch/BranchSetup';

// Publicist
import PublicistLayout from './pages/publicist/PublicistLayout';
import PublicistSend from './pages/publicist/PublicistSend';
import PublicistImport from './pages/publicist/PublicistImport';

// Reader
import ReaderLayout from './pages/reader/ReaderLayout';
import ReaderClients from './pages/reader/ReaderClients';
import ReaderExport from './pages/reader/ReaderExport';

function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

function RoleRedirect() {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/login" replace />;
  const routes = {
    customer: '/app/dashboard',
    admin: '/admin/stats',
    branch: '/branch/buscar',
    publicist: '/publicist/nueva',
    data_reader: '/reader/clientes',
  };
  return <Navigate to={routes[user.role] || '/login'} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Públicas */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/" element={<RoleRedirect />} />

          {/* Cliente Final (PWA) */}
          <Route path="/app" element={
            <ProtectedRoute roles={['customer']}><CustomerLayout /></ProtectedRoute>
          }>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<CustomerDashboard />} />
            <Route path="puntos" element={<CustomerPoints />} />
            <Route path="cargar" element={<CustomerReceipt />} />
            <Route path="canjear" element={<CustomerRedeem />} />
            <Route path="notificaciones" element={<CustomerNotifications />} />
            <Route path="experiencia" element={<CustomerExperience />} />
          </Route>

          {/* Admin */}
          <Route path="/admin" element={
            <ProtectedRoute roles={['admin']}><AdminLayout /></ProtectedRoute>
          }>
            <Route index element={<Navigate to="stats" replace />} />
            <Route path="stats" element={<AdminStats />} />
            <Route path="clientes" element={<AdminClients />} />
            <Route path="modificar-puntos" element={<AdminAdjustPoints />} />
            <Route path="comprobantes" element={<AdminReceipts />} />
            <Route path="qr-usados" element={<AdminQRHistory />} />
            <Route path="experiencias" element={<AdminExperiences />} />
            <Route path="configuracion" element={<AdminConfig />} />
            <Route path="usuarios" element={<AdminUsers />} />
          </Route>

          {/* Sucursal */}
          <Route path="/branch" element={
            <ProtectedRoute roles={['branch']}><BranchLayout /></ProtectedRoute>
          }>
            <Route index element={<Navigate to="buscar" replace />} />
            <Route path="buscar" element={<BranchSearch />} />
            <Route path="lector-qr" element={<BranchQRReader />} />
            <Route path="setup" element={<BranchSetup />} />
          </Route>

          {/* Publicitario */}
          <Route path="/publicist" element={
            <ProtectedRoute roles={['publicist', 'admin']}><PublicistLayout /></ProtectedRoute>
          }>
            <Route index element={<Navigate to="nueva" replace />} />
            <Route path="nueva" element={<PublicistSend />} />
            <Route path="importar" element={<PublicistImport />} />
          </Route>

          {/* Lector de datos */}
          <Route path="/reader" element={
            <ProtectedRoute roles={['data_reader']}><ReaderLayout /></ProtectedRoute>
          }>
            <Route index element={<Navigate to="clientes" replace />} />
            <Route path="clientes" element={<ReaderClients />} />
            <Route path="exportar" element={<ReaderExport />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
