import { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import Alert from '../../components/Alert';
import Spinner from '../../components/Spinner';

const roleLabels = {
  admin: 'Administrador', publicist: 'Publicitario',
  data_reader: 'Lector de Datos', branch: 'Sucursal',
};

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nombre: '', apellido: '', email: '', password: '', role: 'branch' });
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/admin/users').then(setUsers).catch(() => {}).finally(() => setLoading(false));
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const created = await api.post('/admin/users', form);
      setUsers([...users, created]);
      setShowForm(false);
      setForm({ nombre: '', apellido: '', email: '', password: '', role: 'branch' });
      setStatus({ type: 'success', msg: 'Usuario creado correctamente' });
    } catch (err) {
      setStatus({ type: 'error', msg: err.message });
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(user) {
    try {
      await api.put(`/admin/users/${user.id}`, { ...user, active: !user.active });
      setUsers(users.map(u => u.id === user.id ? { ...u, active: !u.active } : u));
    } catch (err) {
      setStatus({ type: 'error', msg: err.message });
    }
  }

  if (loading) return <Spinner />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Usuarios del sistema</h1>
        <button onClick={() => setShowForm(true)} className="btn-primary px-4">+ Nuevo usuario</button>
      </div>

      <Alert type={status.type || 'error'} message={status.msg} onClose={() => setStatus({ type: '', msg: '' })} />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              {['Nombre', 'Email', 'Rol', 'Estado', 'Acción'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{u.nombre} {u.apellido}</td>
                <td className="px-4 py-3 text-gray-600">{u.email}</td>
                <td className="px-4 py-3">
                  <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                    {roleLabels[u.role] || u.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${u.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {u.active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => toggleActive(u)} className="text-xs text-gray-500 hover:text-casiana-red">
                    {u.active ? 'Desactivar' : 'Activar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Nuevo usuario</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 text-2xl leading-none">×</button>
            </div>
            <form onSubmit={handleCreate} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-700 mb-1 block">Nombre *</label>
                  <input required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm text-gray-700 mb-1 block">Apellido</label>
                  <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={form.apellido} onChange={e => setForm({ ...form, apellido: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-700 mb-1 block">Email *</label>
                <input required type="email" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <label className="text-sm text-gray-700 mb-1 block">Contraseña *</label>
                <input required type="password" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
              </div>
              <div>
                <label className="text-sm text-gray-700 mb-1 block">Rol *</label>
                <select required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                  <option value="branch">Sucursal</option>
                  <option value="publicist">Publicitario</option>
                  <option value="data_reader">Lector de Datos</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">Cancelar</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? 'Creando...' : 'Crear'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
