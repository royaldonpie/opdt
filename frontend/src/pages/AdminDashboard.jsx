import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { BarChart3, Users, FileCheck, AlertCircle } from 'lucide-react';

const AdminDashboard = () => {
    const [data, setData] = useState(null);
    const { token } = useContext(AuthContext);

    useEffect(() => {
        axios.get('\/api/dashboards/admin', {
            headers: { Authorization: `Bearer ${token}` }
        }).then(res => setData(res.data)).catch(console.error);
    }, [token]);

    if (!data) return <div className="p-8 text-center text-slate-500">Loading dashboard...</div>;

    const stats = [
        { label: 'Total Clubs', value: data.totalClubs, icon: Users, color: 'bg-blue-500' },
        { label: 'Total Pathfinders', value: data.totalPathfinders, icon: Users, color: 'bg-indigo-500' },
        { label: 'Instructors', value: data.totalInstructors, icon: Users, color: 'bg-purple-500' },
        { label: 'Pending Exams', value: data.pendingExams, icon: AlertCircle, color: 'bg-amber-500' },
        { label: 'Approved Exams', value: data.approvedExams, icon: FileCheck, color: 'bg-emerald-500' },
        { label: 'Reports This Month', value: data.reportsThisMonth, icon: BarChart3, color: 'bg-pink-500' },
    ];

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-8">Super Admin Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center hover:shadow-md transition duration-300">
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
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 h-[400px] flex flex-col">
                    <h3 className="text-xl font-bold text-slate-800 mb-6 shrink-0">Top Honors Distributed</h3>
                    <div className="flex-1 overflow-y-auto pr-2 space-y-4 hidden-scrollbar">
                        {data.honorDistribution?.length === 0 ? (
                            <p className="text-slate-500 text-sm">No honor data available yet.</p>
                        ) : (
                            data.honorDistribution?.map((honor, i) => (
                                <div key={i} className="flex justify-between items-center p-5 bg-slate-50/50 hover:bg-slate-50 rounded-2xl border border-slate-100 transition">
                                    <span className="font-semibold text-slate-700 text-lg">{honor.honor_name}</span>
                                    <span className="bg-indigo-100 text-indigo-700 py-1.5 px-4 rounded-full text-sm font-bold shadow-sm">{honor.total_awarded} awarded</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 h-[400px] flex flex-col">
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
                                    <div className="mt-2 flex gap-2">
                                        <span className="text-[0.65rem] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md uppercase tracking-wide">{act.club_name}</span>
                                        <span className="text-[0.65rem] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md uppercase tracking-wide">{act.user_name}</span>
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

export default AdminDashboard;
