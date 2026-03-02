import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { DownloadCloud, History, CheckCircle2, XCircle, Clock } from 'lucide-react';

const ApprovedExams = () => {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useContext(AuthContext);

    const fetchMyExams = () => {
        axios.get('\/api/exams/my-exams', { headers: { Authorization: `Bearer ${token}` } })
            .then(res => {
                setExams(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to load my exams');
                setLoading(false);
            });
    };

    useEffect(() => {
        if (token) fetchMyExams();
    }, [token]);

    if (loading) {
        return <div className="p-10 text-center font-bold text-slate-500">Loading Exam History...</div>;
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-20">
            <div className="mb-10 animate-in fade-in slide-in-from-top-4">
                <h2 className="text-3xl font-extrabold tracking-tight text-slate-800 flex items-center">
                    <History className="w-8 h-8 mr-3 text-indigo-600" />
                    Exam Submissions & Approvals
                </h2>
                <p className="text-slate-500 text-sm mt-2 max-w-2xl leading-relaxed">
                    Track the status of your uploaded exams, review admin feedback comments, and safely download mathematically
                    watermarked PDF copies of fully approved questions for direct printing to your candidates.
                </p>
            </div>

            {exams.length === 0 ? (
                <div className="bg-white/80 backdrop-blur-xl border border-slate-200 shadow-sm rounded-3xl p-16 text-center animate-in fade-in zoom-in-95 duration-500">
                    <Clock className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-700">No Submissions Found</h3>
                    <p className="text-slate-500 mt-2">You have not submitted any exams to the conference yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {exams.map(ex => (
                        <div key={ex.id} className="bg-white/90 backdrop-blur-2xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] rounded-3xl p-6 transition-all group hover:border-indigo-100 relative overflow-hidden">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-black text-slate-800 capitalize">
                                            {ex.exam_type.replace('_', ' ')} - {ex.class_level}
                                        </h3>
                                        {/* Status Badge */}
                                        <span className={`px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-full flex items-center gap-1 ${ex.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                                                ex.status === 'rejected' ? 'bg-rose-100 text-rose-700' :
                                                    'bg-amber-100 text-amber-700'
                                            }`}>
                                            {ex.status === 'approved' && <CheckCircle2 className="w-3 h-3" />}
                                            {ex.status === 'rejected' && <XCircle className="w-3 h-3" />}
                                            {ex.status === 'pending' && <Clock className="w-3 h-3" />}
                                            {ex.status}
                                        </span>
                                    </div>

                                    {ex.honor_name && (
                                        <p className="text-sm font-semibold text-purple-600 uppercase tracking-widest mb-1">
                                            {ex.honor_name}
                                        </p>
                                    )}
                                    <p className="text-xs text-slate-400 font-medium tracking-wide">
                                        Submitted on: {new Date(ex.submitted_at).toLocaleString()}
                                    </p>
                                </div>

                                <div className="flex-shrink-0 w-full md:w-auto flex flex-col items-end gap-3 mt-4 md:mt-0">
                                    {ex.status === 'approved' && ex.file_path && (
                                        <a
                                            href={`\/uploads/${ex.file_path}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full md:w-auto inline-flex justify-center items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-200/50 rounded-xl transition transform active:scale-95 font-bold text-sm tracking-wide"
                                        >
                                            <DownloadCloud className="w-5 h-5 mr-3" />
                                            Download Print Copy
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Admin Comment Section */}
                            {ex.admin_comment && (
                                <div className="mt-6 pt-5 border-t border-slate-100 items-start flex">
                                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 w-full">
                                        <p className="text-[0.65rem] font-black text-slate-400 uppercase tracking-widest mb-2">Conference Admin Remarks</p>
                                        <p className="text-sm text-slate-700 font-semibold leading-relaxed">
                                            "{ex.admin_comment}"
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

export default ApprovedExams;
