import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FileCheck, Activity, CheckCircle, Sparkles, DownloadCloud } from 'lucide-react';

const ReviewExams = () => {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [replacementFiles, setReplacementFiles] = useState({});
    const { token } = useContext(AuthContext);

    const fetchExams = () => {
        axios.get('http://localhost:5000/api/exams/pending', { headers: { Authorization: `Bearer ${token}` } })
            .then(res => { setExams(res.data); setLoading(false); })
            .catch(console.error);
    };

    useEffect(() => { fetchExams(); }, [token]);

    const handleAction = async (id, status) => {
        const comment = prompt(`Add a remark for ${status} (Optional):`) || '';
        try {
            const formData = new FormData();
            formData.append('status', status);
            formData.append('admin_comment', comment);
            if (replacementFiles[id]) {
                formData.append('exam_file', replacementFiles[id]);
            }

            await axios.put(`http://localhost:5000/api/exams/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            fetchExams();
            setReplacementFiles(prev => { const updated = { ...prev }; delete updated[id]; return updated; });
        } catch (e) {
            alert('Failed to update status: ' + (e.response?.data?.error || e.message));
        }
    };

    if (loading) return <div>Loading pendings...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-800">Pending Exam Vetting</h2>
                    <p className="text-slate-500 text-sm mt-1">Review AI pre-screened exams uploaded by Directors and approve.</p>
                </div>
            </div>

            {exams.length === 0 ? (
                <div className="bg-white/80 backdrop-blur-xl border border-slate-200 shadow-sm rounded-3xl p-16 text-center animate-in fade-in zoom-in-95 duration-500">
                    <CheckCircle className="w-20 h-20 text-emerald-400 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold text-slate-700">Clear Inbox</h3>
                    <p className="text-slate-500 mt-2 max-w-sm mx-auto">You have vetted all pending AI-processed exam uploads across the clubs. Great job!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {exams.map(exam => (
                        <div key={exam.id} className="bg-white/90 backdrop-blur-xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] rounded-3xl p-6 hover:shadow-lg transition-all duration-300 relative overflow-hidden group flex flex-col justify-between">

                            <div className="absolute -right-6 -top-6 w-32 h-32 bg-gradient-to-br from-indigo-200 to-purple-100 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition duration-500 pointer-events-none"></div>

                            <div>
                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center">
                                        <FileCheck className="w-6 h-6 mr-3" />
                                        <span className="font-bold text-sm tracking-tight">{exam.club_name}</span>
                                    </div>
                                    <span className="bg-amber-100 text-amber-700 py-1 px-3 rounded-full text-[0.65rem] font-black shadow-sm uppercase tracking-widest flex items-center shrink-0">
                                        <Activity className="w-3 h-3 mr-1" /> Pending
                                    </span>
                                </div>

                                <div className="space-y-1 mb-6">
                                    <h3 className="text-2xl font-black text-slate-800 capitalize leading-tight mb-2">
                                        {exam.exam_type.replace('_', ' ')}
                                    </h3>
                                    <p className="text-[0.85rem] text-slate-500 font-medium">Class Framework: <span className="text-indigo-600 font-bold ml-1">{exam.class_level}</span></p>
                                    {exam.honor_name && <p className="text-[0.85rem] text-slate-500 font-medium">Honor Specialization: <span className="text-purple-600 font-black ml-1 uppercase text-xs tracking-wider">{exam.honor_name}</span></p>}
                                    <p className="text-[0.7rem] font-bold uppercase tracking-wider text-slate-400 mt-2">DTS: {new Date(exam.submitted_at).toLocaleString()}</p>
                                </div>

                                <a href={`http://localhost:5000/uploads/${exam.file_path}`} target="_blank" rel="noopener noreferrer" className="bg-slate-50/80 border border-slate-100 rounded-2xl p-4 mb-6 relative group/btn cursor-pointer block hover:bg-slate-100">
                                    <div className="absolute top-1/2 -mt-[8px] right-4 opacity-0 group-hover/btn:opacity-100 group-hover/btn:-translate-y-1 transition text-slate-600">
                                        <DownloadCloud className="w-5 h-5" />
                                    </div>
                                    <p className="text-[0.65rem] font-black text-slate-400 uppercase tracking-widest mb-1 block">Attached File Resource</p>
                                    <p className="text-sm font-semibold text-slate-700 flex items-center">
                                        {exam.file_path || 'No Document Found'}
                                    </p>
                                </a>

                                <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4 mb-8">
                                    <p className="text-[0.65rem] font-black text-indigo-400 uppercase tracking-widest mb-2 flex items-center block">
                                        <Sparkles className="w-3 h-3 mr-1" /> Automated AI Prescreen Analysis
                                    </p>
                                    <p className="text-xs font-semibold text-indigo-900 leading-relaxed whitespace-pre-wrap">
                                        {exam.ai_analysis || 'No AI data available or parsing failed.'}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 mb-4">
                                <label className="text-xs font-bold text-slate-500 mb-1 block">Admin Replacement File (Optional)</label>
                                <input type="file"
                                    onChange={e => setReplacementFiles({ ...replacementFiles, [exam.id]: e.target.files[0] })}
                                    className="text-xs text-slate-500 w-full"
                                />
                            </div>

                            <div className="flex gap-3 mt-auto">
                                <button onClick={() => handleAction(exam.id, 'approved')} className="flex-1 bg-emerald-50 hover:bg-emerald-100 hover:scale-[1.02] text-emerald-600 font-bold py-3 text-sm rounded-xl border border-emerald-200 transition">
                                    Confirm Admin Approval
                                </button>
                                <button onClick={() => handleAction(exam.id, 'rejected')} className="flex-1 bg-rose-50 hover:bg-rose-100 text-rose-600 hover:scale-[1.02] font-bold py-3 text-sm rounded-xl border border-rose-200 transition">
                                    Veto Reject Target
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReviewExams;
