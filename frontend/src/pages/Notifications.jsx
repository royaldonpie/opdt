import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Bell, BellRing, CheckCircle, Send, Users } from 'lucide-react';

const Notifications = () => {
    const { token, user } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    // Super Admin Broadcast State
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [receiverId, setReceiverId] = useState('all');
    const [usersList, setUsersList] = useState([]);

    const fetchNotifications = () => {
        axios.get('\/api/notifications', { headers: { Authorization: `Bearer ${token}` } })
            .then(res => setNotifications(res.data))
            .finally(() => setLoading(false));
    };

    const fetchUsers = () => {
        if (user.role === 'super_admin') {
            axios.get('\/api/users', { headers: { Authorization: `Bearer ${token}` } })
                .then(res => setUsersList(res.data.filter(u => u.role === 'director')))
                .catch(console.error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        fetchUsers();
    }, [token]);

    const handleBroadcast = async (e) => {
        e.preventDefault();
        try {
            await axios.post('\/api/notifications', { receiver_id: receiverId, title, message }, { headers: { Authorization: `Bearer ${token}` } });
            setTitle('');
            setMessage('');
            fetchNotifications();
            alert('Push notification sent successfully!');
        } catch (err) {
            alert('Failed to send push notification.');
        }
    };

    const markAsRead = async (id) => {
        if (user.role === 'super_admin') return; // Admins just sent them
        try {
            await axios.put(`\/api/notifications/${id}/read`, {}, { headers: { Authorization: `Bearer ${token}` } });
            fetchNotifications();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-3xl font-extrabold tracking-tight text-slate-800">Comm-Link Channel</h2>
                <p className="text-slate-500 text-sm mt-2 max-w-xl">Conference announcements, alerts, and operational directives.</p>
            </div>

            {user.role === 'super_admin' && (
                <div className="bg-white/80 backdrop-blur-2xl border border-slate-100 shadow-sm rounded-[2rem] p-8 mb-8">
                    <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                        <Send className="w-5 h-5 mr-3 text-indigo-500" /> Dispatch New Directive
                    </h3>
                    <form onSubmit={handleBroadcast} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Target Recipient</label>
                                <select value={receiverId} onChange={e => setReceiverId(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm">
                                    <option value="all">Broadcast to All Club Directors</option>
                                    {usersList.map(u => <option key={u.id} value={u.id}>{u.club_name || u.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Subject Title</label>
                                <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3" placeholder="Urgent: Camporee Registration" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Message Payload</label>
                            <textarea value={message} onChange={e => setMessage(e.target.value)} required rows={4} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm" placeholder="Please ensure all members are registered by..." />
                        </div>
                        <button type="submit" className="w-full xl:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-8 rounded-xl shadow-md transition right">
                            Deploy Notification
                        </button>
                    </form>
                </div>
            )}

            <div className="space-y-4">
                {loading ? <p>Syncing comms...</p> : notifications.length === 0 ? <p className="text-slate-500 text-sm">No new directives in the comm-link.</p> : null}

                {notifications.map(n => (
                    <div key={n.id} onClick={() => markAsRead(n.id)} className={`p-6 rounded-3xl border transition-all cursor-pointer ${!n.is_read && user.role !== 'super_admin' ? 'bg-indigo-50/80 border-indigo-200 shadow-sm' : 'bg-white/80 border-slate-100'}`}>
                        <div className="flex justify-between items-start mb-2">
                            <h4 className={`text-lg font-bold flex items-center ${!n.is_read && user.role !== 'super_admin' ? 'text-indigo-900' : 'text-slate-800'}`}>
                                {!n.is_read && user.role !== 'super_admin' ? <BellRing className="w-5 h-5 mr-3 text-indigo-500 animate-pulse" /> : <Bell className="w-5 h-5 mr-3 text-slate-400" />}
                                {n.title}
                            </h4>
                            <span className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest">{new Date(n.created_at).toLocaleString()}</span>
                        </div>
                        <p className={`text-sm leading-relaxed pl-8 pt-1 ${!n.is_read && user.role !== 'super_admin' ? 'text-indigo-800 font-medium' : 'text-slate-600'}`}>
                            {n.message}
                        </p>
                        {user.role === 'super_admin' && (
                            <div className="pl-8 pt-4">
                                <span className="text-[0.65rem] font-bold text-indigo-400 uppercase tracking-widest flex items-center">
                                    <Users className="w-3 h-3 mr-1" /> Sent to: {n.receiver_name || 'Global Broadcast'}
                                </span>
                            </div>
                        )}
                        {!n.is_read && user.role !== 'super_admin' && (
                            <div className="pl-8 pt-4">
                                <span className="text-[0.65rem] font-bold text-indigo-500 uppercase tracking-widest flex items-center">
                                    <CheckCircle className="w-3 h-3 mr-1" /> Click block to acknowledge
                                </span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Notifications;
