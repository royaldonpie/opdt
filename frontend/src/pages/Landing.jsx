import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Users, LayoutDashboard, ArrowRight, ChevronRight } from 'lucide-react';

const Landing = () => {
    const loginRoles = [
        {
            title: 'Super Admin',
            description: 'Conference-level management, analytics, and exam approvals.',
            icon: Shield,
            emailHint: 'admin@opt.com',
            theme: 'from-rose-500 to-red-600',
            bg: 'bg-rose-50'
        },
        {
            title: 'Club Director',
            description: 'Manage specific club rosters, submit exams, and upload reports.',
            icon: Users,
            emailHint: 'director@opt.com',
            theme: 'from-indigo-500 to-purple-600',
            bg: 'bg-indigo-50'
        },
        {
            title: 'Conference Observer',
            description: 'Read-only access to view overarching metrics and summaries.',
            icon: LayoutDashboard,
            emailHint: 'observer@opt.com',
            theme: 'from-emerald-500 to-teal-600',
            bg: 'bg-emerald-50'
        }
    ];

    return (
        <div className="min-h-screen bg-[#F5F5F7] font-sans selection:bg-indigo-200 flex flex-col items-center justify-center relative overflow-hidden p-6">

            {/* Ambient Apple-like background glow */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-300/30 blur-[120px] rounded-full pointer-events-none -z-10 animate-pulse" style={{ animationDuration: '8s' }}></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-300/30 blur-[120px] rounded-full pointer-events-none -z-10 animate-pulse" style={{ animationDuration: '12s' }}></div>

            <div className="max-w-[1000px] w-full mt-10">
                {/* Hero section */}
                <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <img src="/logo.png" alt="Ogun Pathfinder Logo" className="w-28 h-28 object-contain mx-auto mb-6 drop-shadow-xl" />
                    <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
                        Ogun Pathfinder <br className="hidden md:block" />Director Toolbox.
                    </h1>
                    <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
                        A centralized digital reporting, exam vetting, and membership management ecosystem built exclusively for the Ogun Conference.
                    </p>
                </div>

                {/* Role selection grid */}
                <div className="grid md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-150 fill-mode-both">
                    {loginRoles.map((role, idx) => (
                        <Link
                            key={idx}
                            to={`/login?email=${encodeURIComponent(role.emailHint)}`}
                            className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-500 group flex flex-col h-full"
                        >
                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${role.theme} flex items-center justify-center text-white mb-6 shadow-md shadow-slate-200 group-hover:scale-110 transition-transform duration-500`}>
                                <role.icon className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800 mb-3">{role.title}</h3>
                            <p className="text-slate-500 font-medium leading-relaxed flex-1 mb-8">{role.description}</p>

                            <div className="flex items-center text-sm font-bold text-slate-400 group-hover:text-indigo-600 transition-colors mt-auto uppercase tracking-wider">
                                Enter Portal
                                <ArrowRight className="w-4 h-4 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-20 text-center animate-in fade-in duration-1000 delay-500 fill-mode-both">
                    <p className="text-slate-400 text-sm font-medium">© {new Date().getFullYear()} Ogun Conference of Seventh-day Adventists.</p>
                </div>
            </div>
        </div>
    );
};

export default Landing;
