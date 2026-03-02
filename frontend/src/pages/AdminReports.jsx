import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FileText, CheckCircle, Clock, ShieldAlert, DownloadCloud, MessageSquareText, Link2, Search, Filter } from 'lucide-react';

const AdminReports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all'); // all, pending, endorsed
    const { token } = useContext(AuthContext);

    const fetchReports = () => {
        axios.get('http://localhost:5000/api/reports', { headers: { Authorization: `Bearer ${token}` } })
            .then(res => { setReports(res.data); setLoading(false); })
            .catch(console.error);
    };

    useEffect(() => { fetchReports(); }, [token]);

    const handleAction = async (id, currentStatus) => {
        const remark = prompt(`Enter official remark to Director:`) || '';
        try {
            await axios.put(`http://localhost:5000/api/reports/${id}`, { approved: !currentStatus, admin_remark: remark }, { headers: { Authorization: `Bearer ${token}` } });
            fetchReports();
        } catch (e) {
            alert('Failed to update report status');
        }
    };

    if (loading) return <div className="p-10 text-center font-bold text-slate-500">Loading reports...</div>;

    const filteredReports = reports.filter(r => {
        const matchesSearch = r.club_name?.toLowerCase().includes(searchTerm.toLowerCase()) || r.report_type.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterType === 'all' ? true : filterType === 'endorsed' ? r.approved : !r.approved;
        return matchesSearch && matchesFilter;
    });

    const pendingCount = reports.filter(r => !r.approved).length;
    const endorsedCount = reports.filter(r => r.approved).length;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold tracking-tight text-slate-800">Conference Reports Vector</h2>
                    <p className="text-slate-500 text-sm mt-2 max-w-lg">Audit structural reports systematically, attach director remarks, and maintain compliance standards across all operating clubs.</p>
                </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center">
                    <div className="bg-indigo-50 w-14 h-14 rounded-2xl flex items-center justify-center text-indigo-500 mr-5">
                        <FileText className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-500">Total Volume</p>
                        <h3 className="text-2xl font-black text-slate-800">{reports.length} Reports</h3>
                    </div>
                </div>
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center">
                    <div className="bg-amber-50 w-14 h-14 rounded-2xl flex items-center justify-center text-amber-500 mr-5">
                        <Clock className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-500">Awaiting Sub-Audits</p>
                        <h3 className="text-2xl font-black text-slate-800">{pendingCount} Pending</h3>
                    </div>
                </div>
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center">
                    <div className="bg-emerald-50 w-14 h-14 rounded-2xl flex items-center justify-center text-emerald-500 mr-5">
                        <CheckCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-500">Endorsed Clearance</p>
                        <h3 className="text-2xl font-black text-slate-800">{endorsedCount} Passed</h3>
                    </div>
                </div>
            </div>

            {/* Filter Tools Row */}
            <div className="bg-white/90 backdrop-blur-xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] p-4 flex flex-col md:flex-row gap-4 justify-between items-center z-10 relative">
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-4 top-1/2 mt-[1px] transform -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search by Club Name or Type..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-indigo-200 transition"
                    />
                </div>

                <div className="flex bg-slate-100 p-1.5 rounded-2xl w-full md:w-auto">
                    <button
                        onClick={() => setFilterType('all')}
                        className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl font-bold text-sm transition ${filterType === 'all' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilterType('pending')}
                        className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl font-bold text-sm transition ${filterType === 'pending' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Pending Audit
                    </button>
                    <button
                        onClick={() => setFilterType('endorsed')}
                        className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl font-bold text-sm transition ${filterType === 'endorsed' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Endorsed
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredReports.map((r, i) => (
                    <div key={r.id} className="bg-white/90 backdrop-blur-xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] rounded-3xl p-6 hover:shadow-lg transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-full">

                        <div>
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
                                    <FileText className="w-6 h-6" />
                                </div>
                                {r.approved ? (
                                    <span className="bg-emerald-100 text-emerald-700 py-1 px-3 rounded-full text-xs font-bold shadow-sm uppercase tracking-wide flex items-center">
                                        <CheckCircle className="w-3 h-3 mr-1" /> Endorsed
                                    </span>
                                ) : (
                                    <span className="bg-amber-100 text-amber-700 py-1 px-3 rounded-full text-xs font-bold shadow-sm uppercase tracking-wide flex items-center">
                                        <Clock className="w-3 h-3 mr-1" /> Pending
                                    </span>
                                )}
                            </div>

                            <div className="space-y-2 mb-6">
                                <h3 className="text-xl font-bold text-slate-800 capitalize leading-tight">
                                    {r.report_type} Report
                                </h3>
                                <p className="text-[0.8rem] text-slate-500 font-medium">Club Unit: <span className="text-purple-600 font-bold ml-1">{r.club_name}</span></p>
                                <p className="text-[0.7rem] font-bold uppercase tracking-wider text-slate-400 mt-2">DTS: {new Date(r.date_submitted).toLocaleString()}</p>
                            </div>

                            <a href={`http://localhost:5000${r.file_url}`} target="_blank" rel="noopener noreferrer" className="bg-slate-50/80 border border-slate-100 rounded-2xl p-4 mb-6 relative group/btn cursor-pointer block hover:bg-slate-100 transition">
                                <div className="absolute top-1/2 -mt-[8px] right-4 opacity-0 group-hover/btn:opacity-100 group-hover/btn:-translate-y-1 transition text-slate-600">
                                    <DownloadCloud className="w-5 h-5" />
                                </div>
                                <p className="text-[0.65rem] font-black text-slate-400 uppercase tracking-widest mb-1 block">Attached Payload</p>
                                <p className="text-sm font-semibold text-slate-700 truncate pr-6 hover:text-indigo-600">
                                    {r.file_url.split('-').pop()}
                                </p>
                            </a>

                            {r.video_link && (
                                <a href={r.video_link} target="_blank" rel="noopener noreferrer" className="bg-rose-50/50 border border-rose-100 rounded-2xl p-4 mb-6 relative group/btn cursor-pointer block hover:bg-rose-100 transition">
                                    <div className="absolute top-1/2 -mt-[8px] right-4 opacity-0 group-hover/btn:opacity-100 group-hover/btn:-translate-y-1 transition text-rose-600">
                                        <Link2 className="w-5 h-5" />
                                    </div>
                                    <p className="text-[0.65rem] font-black text-rose-400 uppercase tracking-widest mb-1 block">External Media Link</p>
                                    <p className="text-sm font-semibold text-rose-700 truncate pr-6">
                                        {r.video_link}
                                    </p>
                                </a>
                            )}

                            {r.admin_remark && (
                                <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 mb-6">
                                    <p className="text-[0.65rem] font-black text-blue-400 uppercase tracking-widest mb-2 flex items-center">
                                        <MessageSquareText className="w-3 h-3 mr-1" /> Admin Attached Remark
                                    </p>
                                    <p className="text-xs font-semibold text-blue-900 leading-relaxed">
                                        "{r.admin_remark}"
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="mt-auto">
                            <button onClick={() => handleAction(r.id, r.approved)} className={`w-full font-bold py-3 text-sm rounded-xl border transition ${!r.approved ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border-emerald-200' : 'bg-rose-50 hover:bg-rose-100 text-rose-600 border-rose-200'}`}>
                                {r.approved ? 'Revoke Endorsement' : 'Endorse Mission Report'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminReports;
