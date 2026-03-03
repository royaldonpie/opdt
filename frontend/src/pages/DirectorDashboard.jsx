import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Users, AlertCircle, FileCheck, FileText, ClipboardList, FileUp, FileArchive } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DirectorDashboard = () => {
    const [data, setData] = useState(null);
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('\/api/dashboards/director', {
            headers: { Authorization: `Bearer ${token}` }
        }).then(res => setData(res.data)).catch(console.error);
    }, [token]);

    if (!data) return <div className="p-8 text-center text-slate-500">Loading dashboard...</div>;

    const stats = [
        { label: 'Total Members', value: data.totalMembers, icon: Users, color: 'bg-blue-500' },
        { label: 'Pathfinders', value: data.pathfinders, icon: Users, color: 'bg-indigo-500' },
        { label: 'Instructors', value: data.instructors, icon: Users, color: 'bg-purple-500' },
        { label: 'Pending Exams', value: data.pendingExams, icon: AlertCircle, color: 'bg-amber-500' },
        { label: 'Approved Exams', value: data.approvedExams, icon: FileCheck, color: 'bg-emerald-500' },
        { label: 'Reports Submitted', value: data.reportsSubmitted, icon: FileText, color: 'bg-pink-500' },
    ];

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-8">Club Director Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center hover:shadow-md transition duration-300 transform hover:-translate-y-1">
                        <div className={`${stat.color} w-16 h-16 rounded-2xl flex items-center justify-center text-white mr-5 shadow-inner`}>
                            <stat.icon className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-500 mb-1">{stat.label}</p>
                            <h3 className="text-3xl font-black text-slate-800">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col justify-start">
                    <h3 className="text-xl font-bold text-slate-800 mb-6 shrink-0">Quick Actions</h3>
                    <div className="flex gap-4 flex-wrap">
                        <button onClick={() => navigate('/director/exams')} className="w-full sm:w-auto flex-1 justify-center bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium shadow-md transition flex items-center gap-2"><ClipboardList className="w-5 h-5" /> Submit Exam</button>
                        <button onClick={() => navigate('/director/reports')} className="w-full sm:w-auto flex-1 justify-center bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-medium shadow-md transition flex items-center gap-2"><FileUp className="w-5 h-5" /> Upload Report</button>
                        <button onClick={() => navigate('/director/my-reports')} className="w-full sm:w-auto flex-1 justify-center bg-slate-700 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-medium shadow-md transition flex items-center gap-2"><FileArchive className="w-5 h-5" /> My Reports</button>
                        <button onClick={() => navigate('/director/approved-exams')} className="w-full sm:w-auto flex-1 justify-center bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-medium shadow-md transition flex items-center gap-2"><FileCheck className="w-5 h-5" /> Approved Exams</button>
                        <button onClick={() => navigate('/director/members')} className="w-full sm:w-auto flex-1 justify-center bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-xl font-medium shadow-md transition flex items-center gap-2"><Users className="w-5 h-5" /> Manage Members</button>
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col h-[400px]">
                    <h3 className="text-xl font-bold text-slate-800 mb-6 shrink-0">Recent Activity</h3>
                    <div className="flex-1 overflow-y-auto pr-2 space-y-4 hidden-scrollbar">
                        {(!data.activities || data.activities.length === 0) ? (
                            <p className="text-slate-500 text-sm">No recent activity found.</p>
                        ) : (
                            data.activities.map((act, i) => (
                                <div key={i} className="flex flex-col p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="font-bold text-slate-800 text-sm">{act.action}</span>
                                        <span className="text-xs text-slate-400 font-medium">{new Date(act.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-slate-600 text-sm">{act.description}</p>
                                    <div className="mt-2">
                                        <span className="text-[0.65rem] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md uppercase tracking-wide">{act.user_name}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DirectorDashboard;
