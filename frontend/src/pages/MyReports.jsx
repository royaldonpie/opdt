import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FileText, CheckCircle, Clock, Link2, DownloadCloud, MessageSquareText, FileArchive } from 'lucide-react';

const MyReports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useContext(AuthContext);

    const fetchReports = () => {
        axios.get('\/api/reports', { headers: { Authorization: `Bearer ${token}` } })
            .then(res => { setReports(res.data); setLoading(false); })
            .catch(console.error);
    };

    useEffect(() => { fetchReports(); }, [token]);

    if (loading) return <div className="p-10 text-center font-bold text-slate-500">Loading Report History...</div>;

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-20">
            <div className="mb-10 animate-in fade-in slide-in-from-top-4">
                <h2 className="text-3xl font-extrabold tracking-tight text-slate-800 flex items-center">
                    <FileArchive className="w-8 h-8 mr-3 text-emerald-600" />
                    My Reports Portfolio
                </h2>
                <p className="text-slate-500 text-sm mt-2 max-w-2xl leading-relaxed">
                    Track the status of your uploaded activity reports, review conference feedback comments, and verify compliance with standards.
                </p>
            </div>

            {reports.length === 0 ? (
                <div className="bg-white/80 backdrop-blur-xl border border-slate-200 shadow-sm rounded-3xl p-16 text-center animate-in fade-in zoom-in-95 duration-500">
                    <Clock className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-700">No Reports Found</h3>
                    <p className="text-slate-500 mt-2">You have not submitted any reports to the conference yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {reports.map((r) => (
                        <div key={r.id} className="bg-white/90 backdrop-blur-2xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] rounded-3xl p-6 transition-all group hover:border-emerald-100 relative overflow-hidden">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-black text-slate-800 capitalize">
                                            {r.report_type} Report
                                        </h3>
                                        <span className={`px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-full flex items-center gap-1 ${r.approved ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                            }`}>
                                            {r.approved ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                            {r.approved ? 'Endorsed' : 'Pending Review'}
                                        </span>
                                    </div>
                                    <p className="text-[0.7rem] font-bold uppercase tracking-wider text-slate-400">
                                        Submitted on: {new Date(r.date_submitted).toLocaleString()}
                                    </p>
                                </div>

                                <div className="flex-shrink-0 w-full md:w-auto flex items-center gap-3 mt-4 md:mt-0">
                                    {r.report_type === 'baptismal' ? (
                                        <div className="bg-indigo-50 border border-indigo-100 text-indigo-700 px-4 py-2 rounded-xl text-center">
                                            <p className="text-[0.65rem] font-black uppercase tracking-widest mb-0.5">Baptized</p>
                                            <p className="font-bold text-lg leading-none">{r.baptism_count} Souls</p>
                                        </div>
                                    ) : (
                                        <>
                                            {r.file_url && (
                                                <a href={`${r.file_url}`} target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-xl transition flex text-xs font-bold items-center" title="View Document">
                                                    <FileText className="w-5 h-5" />
                                                </a>
                                            )}
                                            {r.video_link && (
                                                <a href={r.video_link} target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-rose-500 rounded-xl transition flex text-xs font-bold items-center" title="View Media Link">
                                                    <Link2 className="w-5 h-5" />
                                                </a>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>

                            {r.admin_remark && (
                                <div className="mt-6 pt-5 border-t border-slate-100 items-start flex">
                                    <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 w-full">
                                        <p className="text-[0.65rem] font-black text-emerald-500 uppercase tracking-widest mb-2 flex items-center">
                                            <MessageSquareText className="w-3 h-3 mr-1" /> Conference Admin Remarks
                                        </p>
                                        <p className="text-sm text-emerald-900 font-semibold leading-relaxed">
                                            "{r.admin_remark}"
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyReports;
