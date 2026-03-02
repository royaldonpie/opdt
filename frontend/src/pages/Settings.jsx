import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Save, Building, MapPin, Map, Flag, UserCircle, Users, Phone } from 'lucide-react';

const Settings = () => {
    const { token } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        club_name: '', address: '', district: '', federation: '', pathfinder_director: '', church_pastor: '', phone_number: '', pastor_phone_number: ''
    });
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('\/api/settings/club', { headers: { Authorization: `Bearer ${token}` } })
            .then(res => {
                setFormData({
                    club_name: res.data.club_name || '',
                    address: res.data.address || '',
                    district: res.data.district || '',
                    federation: res.data.federation || '',
                    pathfinder_director: res.data.pathfinder_director || '',
                    church_pastor: res.data.church_pastor || '',
                    phone_number: res.data.phone_number || '',
                    pastor_phone_number: res.data.pastor_phone_number || ''
                });
                setLoading(false);
            })
            .catch(err => {
                setStatus({ type: 'error', msg: 'Unable to load club settings.' });
                setLoading(false);
            });
    }, [token]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put('\/api/settings/club', formData, { headers: { Authorization: `Bearer ${token}` } });
            setStatus({ type: 'success', msg: 'Club details updated successfully.' });
            setTimeout(() => setStatus(null), 3000);
        } catch (err) {
            setStatus({ type: 'error', msg: 'Failed to update settings.' });
        }
    };

    if (loading) return <div>Loading Configuration...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="mb-8">
                <h2 className="text-3xl font-extrabold tracking-tight text-slate-800">Operational Settings</h2>
                <p className="text-slate-500 text-sm mt-2 max-w-xl">Manage your core Church and Club identifiers for Conference cataloging.</p>
            </div>

            {status && (
                <div className={`p-4 rounded-xl border font-semibold text-sm ${status.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-rose-50 text-rose-600 border-rose-200'}`}>
                    {status.msg}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-2xl border border-slate-100 shadow-sm rounded-3xl p-8 space-y-8">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="flex items-center text-sm font-bold text-slate-700 mb-2"><Building className="w-4 h-4 mr-2" /> Club Unit Name</label>
                        <input type="text" name="club_name" value={formData.club_name} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3" required />
                    </div>
                    <div>
                        <label className="flex items-center text-sm font-bold text-slate-700 mb-2"><MapPin className="w-4 h-4 mr-2" /> Local Church Address</label>
                        <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3" placeholder="123 Example St, City" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="flex items-center text-sm font-bold text-slate-700 mb-2"><Map className="w-4 h-4 mr-2" /> District</label>
                        <input type="text" name="district" value={formData.district} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3" placeholder="E.g. Abeokuta District" />
                    </div>
                    <div>
                        <label className="flex items-center text-sm font-bold text-slate-700 mb-2"><Flag className="w-4 h-4 mr-2" /> Federation</label>
                        <input type="text" name="federation" value={formData.federation} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3" placeholder="E.g. Egba Federation" />
                    </div>
                </div>

                <hr className="border-slate-100" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="flex items-center text-sm font-bold text-slate-700 mb-2"><UserCircle className="w-4 h-4 mr-2" /> Pathfinder Director</label>
                        <input type="text" name="pathfinder_director" value={formData.pathfinder_director} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3" />
                    </div>
                    <div>
                        <label className="flex items-center text-sm font-bold text-slate-700 mb-2"><Phone className="w-4 h-4 mr-2" /> Director's Phone</label>
                        <input type="text" name="phone_number" value={formData.phone_number} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="flex items-center text-sm font-bold text-slate-700 mb-2"><Users className="w-4 h-4 mr-2" /> Church Pastor</label>
                        <input type="text" name="church_pastor" value={formData.church_pastor} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3" placeholder="Pr. John Doe" />
                    </div>
                    <div>
                        <label className="flex items-center text-sm font-bold text-slate-700 mb-2"><Phone className="w-4 h-4 mr-2" /> Pastor's Phone</label>
                        <input type="text" name="pastor_phone_number" value={formData.pastor_phone_number} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3" placeholder="+1..." />
                    </div>
                </div>

                <div className="pt-4 flex justify-end">
                    <button type="submit" className="flex items-center py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition">
                        <Save className="w-5 h-5 mr-2" /> Update Registry Data
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Settings;
