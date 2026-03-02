import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Users, AlertCircle, FileCheck, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DirectorDashboard = () => {
    const [data, setData] = useState(null);
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:5000/api/dashboards/director', {
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

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                <h3 className="text-xl font-bold text-slate-800 mb-6">Quick Actions</h3>
                <div className="flex gap-4">
                    <button onClick={() => navigate('/director/exams')} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium shadow-md transition">Submit Exam</button>
                    <button onClick={() => navigate('/director/reports')} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-medium shadow-md transition">Upload Report</button>
                    <button onClick={() => navigate('/director/members')} className="bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-xl font-medium shadow-md transition">Manage Members</button>
                </div>
            </div>
        </div>
    );
};

export default DirectorDashboard;
