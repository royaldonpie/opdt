import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { UserPlus, Shield, Trash2, Calendar, Mail, Key } from 'lucide-react';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formVisible, setFormVisible] = useState(false);
    const [resettingUser, setResettingUser] = useState(null);
    const [newPassword, setNewPassword] = useState('');
    const { token } = useContext(AuthContext);

    // Form state
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'director', club_name: '' });

    const fetchUsers = () => {
        axios.get('http://localhost:5000/api/users', { headers: { Authorization: `Bearer ${token}` } })
            .then(res => { setUsers(res.data); setLoading(false); })
            .catch(console.error);
    };

    useEffect(() => { fetchUsers(); }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/users', formData, { headers: { Authorization: `Bearer ${token}` } });
            setFormVisible(false);
            setFormData({ name: '', email: '', password: '', role: 'director', club_name: '' });
            fetchUsers();
        } catch (e) { alert('Error adding user'); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this user?')) return;
        try {
            await axios.delete(`http://localhost:5000/api/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            fetchUsers();
        } catch (e) { alert('Error deleting user'); }
    };

    const handlePasswordReset = async () => {
        if (!newPassword || newPassword.length < 6) return alert('Password must be at least 6 characters.');
        try {
            await axios.put(`http://localhost:5000/api/users/${resettingUser.id}/reset-password`,
                { newPassword },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert(`Password for ${resettingUser.name} successfully reset.`);
            setResettingUser(null);
            setNewPassword('');
        } catch (e) {
            alert(e.response?.data?.error || 'Error resetting password');
        }
    };

    if (loading) return <div>Loading...</div>;

    const roleColors = { super_admin: 'bg-rose-100 text-rose-700', director: 'bg-indigo-100 text-indigo-700', observer: 'bg-emerald-100 text-emerald-700' };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-800">User Management</h2>
                    <p className="text-slate-500 text-sm mt-1">Manage platform access, roles, and club assignments.</p>
                </div>
                <button onClick={() => setFormVisible(!formVisible)} className="flex items-center py-2.5 px-5 bg-slate-900 text-white rounded-xl shadow-md hover:bg-slate-800 hover:shadow-lg transition">
                    <UserPlus className="w-5 h-5 mr-2" /> Add User
                </button>
            </div>

            {formVisible && (
                <div className="bg-white/80 backdrop-blur-xl border border-slate-200 shadow-sm rounded-3xl p-8 mb-8 animate-in fade-in slide-in-from-top-4">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Create New Subject</h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                            <input type="text" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="John Doe" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                            <input type="email" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="john@opt.com" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                            <input type="password" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} placeholder="••••••••" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Role</label>
                            <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
                                <option value="director">Club Director</option>
                                <option value="observer">Observer (Read-Only)</option>
                                <option value="super_admin">Super Admin</option>
                            </select>
                        </div>
                        {formData.role === 'director' && (
                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Club Assignment Name</label>
                                <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3" value={formData.club_name} onChange={e => setFormData({ ...formData, club_name: e.target.value })} placeholder="E.g. Orion Constellation Club" />
                            </div>
                        )}
                        <div className="col-span-full flex justify-end gap-3 mt-4">
                            <button type="button" onClick={() => setFormVisible(false)} className="px-6 py-3 rounded-xl font-medium text-slate-600 hover:bg-slate-100 transition">Cancel</button>
                            <button type="submit" className="px-6 py-3 bg-indigo-600 text-white rounded-xl shadow-md cursor-pointer hover:bg-indigo-700 transition">Create Subject</button>
                        </div>
                    </form>
                </div>
            )}

            {resettingUser && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95">
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Reset Password</h3>
                        <p className="text-sm text-slate-500 mb-6">Enter a new secure password for <span className="font-bold text-slate-700">{resettingUser.name}</span>.</p>

                        <input
                            type="text"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mb-6 font-medium focus:ring-2 focus:ring-amber-200"
                            placeholder="New Password (min 6 chars)"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            autoFocus
                        />

                        <div className="flex justify-end gap-3">
                            <button onClick={() => { setResettingUser(null); setNewPassword(''); }} className="px-5 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-100 transition">Cancel</button>
                            <button onClick={handlePasswordReset} className="px-5 py-2.5 bg-amber-500 text-white rounded-xl shadow-md cursor-pointer hover:bg-amber-600 transition font-bold">Confirm Reset</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white/90 backdrop-blur-xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name & Email</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Role & Access</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Last Login</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {users.map(u => (
                                <tr key={u.id} className="hover:bg-slate-50/50 transition duration-150">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-200 to-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold mr-4">
                                                {u.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-slate-800">{u.name}</div>
                                                <div className="flex items-center text-sm text-slate-500 mt-0.5"><Mail className="w-3.5 h-3.5 mr-1" />{u.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${roleColors[u.role]}`}>
                                            <Shield className="w-3 h-3 mr-1.5" />
                                            {u.role.replace('_', ' ').toUpperCase()}
                                        </span>
                                        {u.club_name && <div className="text-xs text-slate-500 mt-2 font-medium">Club: {u.club_name}</div>}
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center text-sm text-slate-600">
                                            <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                                            {u.last_login ? new Date(u.last_login).toLocaleString() : 'Never logged in'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <button onClick={() => setResettingUser(u)} className="text-amber-500 hover:text-amber-600 hover:bg-amber-50 p-2 rounded-xl transition mr-2" title="Reset Password">
                                            <Key className="w-5 h-5" />
                                        </button>
                                        <button onClick={() => handleDelete(u.id)} className="text-rose-400 hover:text-rose-600 hover:bg-rose-50 p-2 rounded-xl transition" title="Delete User">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageUsers;
