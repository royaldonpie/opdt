import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, FileCheck, FileText, CheckCircle, Clock, Users, Shield, Award } from 'lucide-react';

const ObserverDashboard = () => {
    const [reports, setReports] = useState([]);
    const [exams, setExams] = useState([]);
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { token } = useContext(AuthContext);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                // Observers can theoretically use a separate summary endpoint, but since the routes allow GET we can fetch directly
                const rRes = await axios.get('\/api/reports', { headers: { Authorization: `Bearer ${token}` } });
                const dRes = await axios.get('\/api/dashboards/observer', { headers: { Authorization: `Bearer ${token}` } });

                let eRes = { data: [] };
                try {
                    eRes = await axios.get('\/api/exams/pending', { headers: { Authorization: `Bearer ${token}` } });
                } catch (e) { }

                setReports(rRes.data);
                setDashboardData(dRes.data);
                setExams(eRes.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, [token]);

    if (loading) return <div className="p-8 text-center text-slate-500">Loading Observer Telemetry...</div>;

    return (
        <div className="space-y-10">
            <div className="mb-10 animate-in fade-in slide-in-from-top-4">
                <h2 className="text-3xl font-extrabold tracking-tight text-slate-800 flex items-center">
                    <LayoutDashboard className="w-8 h-8 mr-3 text-emerald-500" /> Executive Overview
                </h2>
                <p className="text-slate-500 text-sm mt-2 max-w-xl leading-relaxed">System-wide read-only monitoring access. Audit Conference reports and pending exam requests without execution privileges.</p>
            </div>

            {/* Unified Stats Row */}
            {dashboardData && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center">
                        <div className="bg-indigo-50 w-14 h-14 rounded-2xl flex items-center justify-center text-indigo-500 mr-5">
                            <Shield className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-500">Total Operational Clubs</p>
                            <h3 className="text-3xl font-black text-slate-800">{dashboardData.totalClubs}</h3>
                        </div>
                    </div>
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center">
                        <div className="bg-amber-50 w-14 h-14 rounded-2xl flex items-center justify-center text-amber-500 mr-5">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-500">Conference Population</p>
                            <h3 className="text-3xl font-black text-slate-800">{dashboardData.totalMembers}</h3>
                        </div>
                    </div>
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center">
                        <div className="bg-emerald-50 w-14 h-14 rounded-2xl flex items-center justify-center text-emerald-500 mr-5">
                            <Award className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-500">Exams Approved Total</p>
                            <h3 className="text-3xl font-black text-slate-800">{dashboardData.approvedExams}</h3>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                {/* Clubs Population Data */}
                {dashboardData && dashboardData.clubsData && (
                    <div className="xl:col-span-1 bg-white/90 backdrop-blur-xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] p-8">
                        <h3 className="text-xl font-bold tracking-tight text-slate-800 mb-6 flex items-center">
                            <Shield className="w-6 h-6 mr-3 text-indigo-500" /> Club Populations
                        </h3>
                        <div className="space-y-3">
                            {dashboardData.clubsData.length === 0 && <p className="text-sm text-slate-400 font-medium">No active clubs registered.</p>}
                            {dashboardData.clubsData.map((club, idx) => (
                                <div key={club.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-2xl group hover:border-indigo-200 hover:bg-indigo-50/30 transition-all">
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs mr-3">
                                            {idx + 1}
                                        </div>
                                        <h4 className="font-bold text-sm text-slate-700 capitalize group-hover:text-indigo-700 transition">{club.club_name}</h4>
                                    </div>
                                    <span className="bg-white shadow-sm text-indigo-700 py-1 flex items-center px-3 rounded-full text-xs font-bold tracking-widest">
                                        <Users className="w-3 h-3 mr-1.5" />
                                        {club.population}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="xl:col-span-1 bg-white/90 backdrop-blur-xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] p-8">
                    <h3 className="text-xl font-bold tracking-tight text-slate-800 mb-6 flex items-center">
                        <FileText className="w-6 h-6 mr-3 text-emerald-500" /> Recent Club Reports
                    </h3>

                    <div className="space-y-4">
                        {reports.length === 0 ? <p className="text-sm text-slate-400 font-medium">No reports recorded in telemetry.</p> : null}
                        {reports.slice(0, 5).map(r => (
                            <div key={r.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                                <div>
                                    <h4 className="font-bold text-sm text-slate-700 capitalize">{r.report_type} Report</h4>
                                    <p className="text-[0.7rem] text-slate-500 font-medium">{r.club_name} • {new Date(r.date_submitted).toLocaleDateString()}</p>
                                    {r.file_url && (
                                        <a href={`\${r.file_url}`} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-500 hover:text-indigo-700 font-semibold block mt-1 underline">
                                            View Report File
                                        </a>
                                    )}
                                </div>
                                {r.approved ? (
                                    <span className="bg-emerald-100 text-emerald-700 py-1 flex items-center px-3 rounded-full text-[0.65rem] font-bold tracking-widest uppercase"><CheckCircle className="w-3 h-3 mr-1" /> Endorsed</span>
                                ) : (
                                    <span className="bg-amber-100 text-amber-700 py-1 flex items-center px-3 rounded-full text-[0.65rem] font-bold tracking-widest uppercase"><Clock className="w-3 h-3 mr-1" /> Pending</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="xl:col-span-1 bg-white/90 backdrop-blur-xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] p-8">
                    <h3 className="text-xl font-bold tracking-tight text-slate-800 mb-6 flex items-center">
                        <FileCheck className="w-6 h-6 mr-3 text-emerald-500" /> Pending Approval Exams
                    </h3>

                    <div className="space-y-4">
                        {exams.length === 0 ? <p className="text-sm text-slate-400 font-medium">No pending exams in telemetry. <i>Note: Ensure Observer Role has GET /pending access if array relies on it.</i></p> : null}
                        {exams.slice(0, 5).map(e => (
                            <div key={e.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-bold text-sm text-slate-700 capitalize">{e.exam_type.replace('_', ' ')}</h4>
                                        <p className="text-[0.65rem] text-slate-500 font-medium uppercase tracking-widest mt-1">Class {e.class_level}</p>
                                        {e.file_path && (
                                            <a href={`\/uploads/${e.file_path}`} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-500 hover:text-emerald-700 font-semibold block mt-1 underline">
                                                Review Exam File
                                            </a>
                                        )}
                                    </div>
                                    <span className="bg-slate-200 text-slate-600 py-1 flex items-center px-3 rounded-full text-[0.65rem] font-bold tracking-widest uppercase">Waiting Admin Veto</span>
                                </div>
                                <p className="text-xs text-indigo-600 mt-2 font-medium line-clamp-1 border-t border-slate-200 pt-2">{e.ai_analysis}</p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ObserverDashboard;
