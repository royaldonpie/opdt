import React, { useEffect, useState, useContext, useRef } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { AuthContext } from '../context/AuthContext';
import { UserPlus, Trash2, Shield, User, Upload, Edit } from 'lucide-react';

const ManageMembers = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formVisible, setFormVisible] = useState(false);
    const [editId, setEditId] = useState(null);
    const { token } = useContext(AuthContext);
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        full_name: '', gender: 'Male', class_level: 'Friend', role: 'pathfinder', year_joined: new Date().getFullYear(), age: 10, instructor_rank: ''
    });

    const fetchMembers = () => {
        axios.get('\/api/members', { headers: { Authorization: `Bearer ${token}` } })
            .then(res => { setMembers(res.data); setLoading(false); })
            .catch(console.error);
    };

    useEffect(() => { fetchMembers(); }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                await axios.put(`/api/members/${editId}`, formData, { headers: { Authorization: `Bearer ${token}` } });
            } else {
                await axios.post('/api/members', formData, { headers: { Authorization: `Bearer ${token}` } });
            }
            setFormVisible(false);
            setEditId(null);
            setFormData({ full_name: '', gender: 'Male', class_level: 'Friend', role: 'pathfinder', year_joined: new Date().getFullYear(), age: 10, instructor_rank: '' });
            fetchMembers();
        } catch (e) { alert('Error saving member'); }
    };

    const handleEdit = (m) => {
        setFormData({
            full_name: m.full_name,
            gender: m.gender,
            class_level: m.class_level,
            role: m.role,
            year_joined: m.year_joined,
            age: m.age || 10,
            instructor_rank: m.instructor_rank || ''
        });
        setEditId(m.id);
        setFormVisible(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to remove this member?')) return;
        try {
            await axios.delete(`\/api/members/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            fetchMembers();
        } catch (e) { alert('Error removing member'); }
    };

    const handleBulkImport = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (evt) => {
            try {
                const bstr = evt.target.result;
                const wb = XLSX.read(bstr, { type: 'binary' });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = XLSX.utils.sheet_to_json(ws);

                // Process and insert sequentially for demo
                setLoading(true);
                for (let row of data) {
                    const parsed = {
                        full_name: row.full_name || row.Name || 'Unknown',
                        gender: row.gender || row.Gender || 'Male',
                        class_level: row.class_level || row.Class || 'Friend',
                        role: row.role || row.Role || 'pathfinder',
                        year_joined: parseInt(row.year_joined || row.Year || new Date().getFullYear()),
                        age: parseInt(row.age || row.Age || 10),
                        instructor_rank: row.instructor_rank || row.Rank || ''
                    };
                    await axios.post('\/api/members', parsed, { headers: { Authorization: `Bearer ${token}` } });
                }
                alert('Bulk roster successfully imported and mapped to database!');
                fetchMembers();
            } catch (err) {
                alert('Failed to parse excel file. Ensure headers match exactly: full_name, gender, class_level, role, year_joined, age, instructor_rank.');
            } finally {
                setLoading(false);
                if (fileInputRef.current) fileInputRef.current.value = '';
            }
        };
        reader.readAsBinaryString(file);
    };

    if (loading) return <div>Data sync initializing...</div>;

    const classColors = {
        Friend: 'text-blue-500 bg-blue-50',
        Companion: 'text-rose-500 bg-rose-50',
        Explorer: 'text-emerald-500 bg-emerald-50',
        Ranger: 'text-amber-500 bg-amber-50',
        Voyager: 'text-purple-500 bg-purple-50',
        Guide: 'text-yellow-600 bg-yellow-100',
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-800">Club Entity Roster</h2>
                    <p className="text-slate-500 text-sm mt-1">Manage Pathfinders, Instructor ranks, and demographics.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => fileInputRef.current.click()} className="flex items-center py-2.5 px-5 bg-white border border-slate-200 text-slate-700 rounded-xl shadow-sm cursor-pointer hover:bg-slate-50 hover:shadow transition">
                        <Upload className="w-5 h-5 mr-2 text-indigo-500" /> Excel Bulk Import
                        <input type="file" accept=".xlsx, .xls" ref={fileInputRef} onChange={handleBulkImport} className="hidden" />
                    </button>
                    <button onClick={() => setFormVisible(!formVisible)} className="flex items-center py-2.5 px-5 bg-indigo-600 text-white rounded-xl shadow-md cursor-pointer hover:bg-indigo-700 hover:shadow-lg transition">
                        <UserPlus className="w-5 h-5 mr-2" /> Manually Register Entity
                    </button>
                </div>
            </div>

            {formVisible && (
                <div className="bg-white/80 backdrop-blur-xl border border-slate-200 shadow-sm rounded-3xl p-8 mb-8 animate-in fade-in slide-in-from-top-4">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Subject Registration Module</h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Full Identity Name</label>
                            <input type="text" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3" value={formData.full_name} onChange={e => setFormData({ ...formData, full_name: e.target.value })} placeholder="Jane Doe" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Assigned Sex</label>
                            <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3" value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })}>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Age</label>
                            <input type="number" required min="1" max="100" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3" value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Role Status</label>
                            <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
                                <option value="pathfinder">Pathfinder</option>
                                <option value="instructor">Instructor</option>
                            </select>
                        </div>
                        {formData.role === 'pathfinder' ? (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Current Class level</label>
                                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3" value={formData.class_level} onChange={e => setFormData({ ...formData, class_level: e.target.value })}>
                                    {['Friend', 'Companion', 'Explorer', 'Ranger', 'Voyager', 'Guide'].map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        ) : (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Instructor Rank Qualification</label>
                                <select className="w-full bg-amber-50 border border-amber-200 text-amber-900 font-bold rounded-xl px-4 py-3 shadow-inner" value={formData.instructor_rank} onChange={e => setFormData({ ...formData, instructor_rank: e.target.value })}>
                                    <option value="">Select Qualification Level...</option>
                                    <option value="Guide">Guide</option>
                                    <option value="Master Guide">Master Guide</option>
                                    <option value="Others">Others</option>
                                </select>
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Year Joined Array</label>
                            <input type="number" required min="2000" max="2100" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3" value={formData.year_joined} onChange={e => setFormData({ ...formData, year_joined: e.target.value })} />
                        </div>
                        <div className="col-span-full flex justify-end gap-3 mt-4">
                            <button type="button" onClick={() => { setFormVisible(false); setEditId(null); }} className="px-6 py-3 rounded-xl font-medium text-slate-600 hover:bg-slate-100 transition">Cancel Sequence</button>
                            <button type="submit" className="px-6 py-3 bg-indigo-600 text-white rounded-xl shadow-md cursor-pointer hover:bg-indigo-700 transition">{editId ? 'Update Entity' : 'Inject into Roster'}</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white/90 backdrop-blur-xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-4 text-[0.65rem] font-bold text-slate-500 uppercase tracking-widest pl-10">Entity Identity & Demographics</th>
                                <th className="px-6 py-4 text-[0.65rem] font-bold text-slate-500 uppercase tracking-widest">Clearance & Rank Vector</th>
                                <th className="px-6 py-4 text-[0.65rem] font-bold text-slate-500 uppercase tracking-widest">Entry Date</th>
                                <th className="px-6 py-4 text-[0.65rem] font-bold text-slate-500 uppercase tracking-widest text-right pr-10">Action Override</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {members.map((m, idx) => (
                                <tr key={m.id} className="hover:bg-slate-50/50 transition duration-150 group">
                                    <td className="px-6 py-5 pl-10">
                                        <div className="flex items-center">
                                            <div className="w-12 h-12 rounded-[14px] bg-gradient-to-tr from-slate-100 to-white shadow-sm border border-slate-200 flex items-center justify-center text-slate-600 font-black text-xl mr-5 shrink-0 transform group-hover:scale-105 transition duration-300">
                                                {m.full_name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-800 text-[1.05rem]">{m.full_name}</div>
                                                <div className="flex gap-2 mt-1">
                                                    <span className="text-[0.6rem] text-slate-500 tracking-widest uppercase font-black bg-slate-100 rounded-md px-1.5 py-0.5">{m.gender}</span>
                                                    {m.age && <span className="text-[0.6rem] text-slate-500 tracking-widest uppercase font-black bg-slate-100 rounded-md px-1.5 py-0.5">AGE {m.age}</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-2 items-start">
                                            <span className="inline-flex items-center text-xs font-black text-slate-700 tracking-wide uppercase">
                                                {m.role === 'instructor' ? <Shield className="w-4 h-4 mr-2 text-indigo-500 drop-shadow-sm" /> : <User className="w-4 h-4 mr-2 text-slate-400" />}
                                                {m.role}
                                            </span>
                                            {m.role === 'instructor' && m.instructor_rank ? (
                                                <span className="px-2.5 py-0.5 rounded-lg text-[0.65rem] font-black bg-amber-100 text-amber-700 uppercase tracking-wider">{m.instructor_rank} Class</span>
                                            ) : (
                                                <span className={`px-2.5 py-0.5 rounded-lg text-[0.65rem] font-black uppercase tracking-wider ${classColors[m.class_level] || 'bg-slate-100 text-slate-600'}`}>{m.class_level} Segment</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 font-bold text-slate-400 text-sm">
                                        {m.year_joined}
                                    </td>
                                    <td className="px-6 py-5 pr-10 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => handleEdit(m)} className="text-indigo-400 hover:text-white hover:bg-indigo-500 p-2.5 rounded-xl font-bold text-xs uppercase transition shadow-sm border border-indigo-100 hover:border-transparent flex items-center justify-center">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDelete(m.id)} className="text-rose-400 hover:text-white hover:bg-rose-500 p-2.5 rounded-xl font-bold text-xs uppercase transition shadow-sm border border-rose-100 hover:border-transparent flex items-center justify-center">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
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

export default ManageMembers;
