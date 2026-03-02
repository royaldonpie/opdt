import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { LogOut, LayoutDashboard, Users, FileCheck, FileUp, ClipboardList, Settings, Menu, X, Bell, ShoppingCart, Moon, Sun } from 'lucide-react';
import axios from 'axios';

const DashboardLayout = ({ children }) => {
    const { user, logout, token } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [hasUnread, setHasUnread] = useState(false);

    // Quick polling to check for unread notifications for bell icon (director)
    useEffect(() => {
        if (user && token) {
            axios.get('http://localhost:5000/api/notifications', { headers: { Authorization: `Bearer ${token}` } })
                .then(res => {
                    if (user.role === 'director' && res.data.some(n => !n.is_read)) {
                        setHasUnread(true);
                    } else {
                        setHasUnread(false);
                    }
                }).catch(() => { });
        }
    }, [user, token, location.pathname]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        // Extremely simple theme toggle just adding filters for demo
        if (!isDarkMode) {
            document.documentElement.style.filter = 'invert(0.9) hue-rotate(180deg)';
        } else {
            document.documentElement.style.filter = 'none';
        }
    };

    const navLinks = {
        super_admin: [
            { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
            { name: 'Review Exams', path: '/admin/exams', icon: FileCheck },
            { name: 'Review Reports', path: '/admin/reports', icon: ClipboardList },
            { name: 'Manage Users', path: '/admin/users', icon: Users },
            { name: 'Comm-Link', path: '/notifications', icon: Bell },
        ],
        director: [
            { name: 'Dashboard', path: '/director', icon: LayoutDashboard },
            { name: 'Submit Exam', path: '/director/exams', icon: ClipboardList },
            { name: 'Upload Report', path: '/director/reports', icon: FileUp },
            { name: 'Manage Members', path: '/director/members', icon: Users },
            { name: 'Supply Orders', path: '/director/orders', icon: ShoppingCart },
            { name: 'Announcements', path: '/notifications', icon: Bell },
            { name: 'Settings', path: '/director/settings', icon: Settings },
        ],
        observer: [
            { name: 'Dashboard', path: '/observer', icon: LayoutDashboard },
        ]
    };

    const activeLinks = user ? navLinks[user.role] || [] : [];

    return (
        <div className="flex h-screen bg-[#F5F5F7] font-sans selection:bg-indigo-200 overflow-hidden relative">

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 w-72 lg:w-64 bg-white/90 backdrop-blur-3xl flex flex-col pt-8 pb-6 shadow-[0_8px_30px_rgb(0,0,0,0.1)] lg:shadow-[0_8px_30px_rgb(0,0,0,0.04)] lg:rounded-[2rem] border-r lg:border border-slate-100/50 z-50 transition-transform duration-300 ease-in-out lg:my-4 lg:ml-4`}>
                <div className="px-8 mb-10 flex flex-col relative">
                    {isMobileMenuOpen && (
                        <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-0 right-6 lg:hidden text-slate-400 hover:text-slate-800">
                            <X className="w-6 h-6" />
                        </button>
                    )}
                    <h2 className="text-[1.35rem] font-bold tracking-tight text-slate-800 flex items-center gap-2">
                        <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain drop-shadow-sm" />
                        Toolbox
                    </h2>
                    <p className="text-[0.65rem] text-slate-400 mt-2 uppercase tracking-[0.2em] font-semibold">{user?.role?.replace('_', ' ')}</p>
                </div>

                <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto hidden-scrollbar pb-10">
                    {activeLinks.map((link) => {
                        const isActive = location.pathname === link.path;
                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center px-4 py-3.5 rounded-2xl text-[0.9rem] font-medium transition-all duration-300 group
                                    ${isActive
                                        ? 'bg-slate-900 text-white shadow-md'
                                        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`
                                }
                            >
                                <div className="relative">
                                    <link.icon className={`w-5 h-5 mr-3 transition-colors flex-shrink-0 ${isActive ? 'text-indigo-300' : 'text-slate-400 group-hover:text-indigo-500'}`} />
                                    {link.icon === Bell && hasUnread && (
                                        <span className="absolute -top-1 right-2 w-2 h-2 bg-rose-500 rounded-full animate-ping"></span>
                                    )}
                                </div>
                                {link.name}
                            </Link>
                        )
                    })}
                </nav>

                <div className="px-4 mt-auto">
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center px-4 py-3 text-[0.9rem] font-medium text-rose-500 bg-rose-50/50 hover:bg-rose-100 rounded-2xl transition duration-300 group"
                    >
                        <LogOut className="w-5 h-5 mr-3 text-rose-400 group-hover:text-rose-600 transition-colors" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 relative w-full h-full">
                {/* Subtle background glow effect for Apple-like depth */}
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200/40 blur-[100px] rounded-full pointer-events-none -z-10"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-200/40 blur-[100px] rounded-full pointer-events-none -z-10"></div>

                <div className="max-w-[1200px] mx-auto min-h-full pb-10">

                    {/* Header bar placeholder for greeting */}
                    <div className="flex justify-between items-center mb-10 w-full animate-in fade-in slide-in-from-top-4 duration-700">
                        <div className="flex items-center">
                            <button
                                onClick={() => setIsMobileMenuOpen(true)}
                                className="mr-4 lg:hidden p-2 rounded-xl bg-white shadow-sm border border-slate-200 text-slate-600"
                            >
                                <Menu className="w-6 h-6" />
                            </button>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Welcome Back, {user?.name ? user.name.split(' ')[0] : 'Leader'}</h1>
                                <p className="text-slate-500 mt-1 font-medium hidden md:block">Here's what's happening today.</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button onClick={toggleTheme} className="w-10 h-10 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:shadow-md transition">
                                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </button>
                            {user?.role === 'director' && (
                                <button onClick={() => navigate('/director/settings')} className="w-10 h-10 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:shadow-md transition relative group">
                                    <Settings className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150 fill-mode-both">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
