import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FileText, CheckCircle, Clock, ShieldAlert, DownloadCloud, MessageSquareText, Link2 } from 'lucide-react';

const AdminReports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
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

    if (loading) return <div>Loading reports...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-800">Conference Reports Vector</h2>
                    <p className="text-slate-500 text-sm mt-1">Audit club operation files and attach director remarks.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reports.map((r, i) => (
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
