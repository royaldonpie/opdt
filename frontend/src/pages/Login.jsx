import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Removed autofill
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('\/api/auth/login', { email, password });
            login(res.data.token, res.data.user);

            if (res.data.user.role === 'super_admin') {
                navigate('/admin');
            } else if (res.data.user.role === 'director') {
                navigate('/director');
            } else {
                navigate('/observer');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen bg-[#F5F5F7] font-sans selection:bg-indigo-200 flex items-center justify-center relative overflow-hidden p-6">

            {/* Ambient Apple-like background glow */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-300/30 blur-[120px] rounded-full pointer-events-none -z-10 animate-pulse" style={{ animationDuration: '8s' }}></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-300/30 blur-[120px] rounded-full pointer-events-none -z-10 animate-pulse" style={{ animationDuration: '12s' }}></div>

            <div className="max-w-md w-full bg-white/80 backdrop-blur-2xl p-10 rounded-[3rem] shadow-[0_8px_40px_rgb(0,0,0,0.06)] border border-white">
                <div className="text-center mb-10">
                    <img src="/logo.png" alt="Ogun Pathfinder Logo" className="w-20 h-20 object-contain mx-auto mb-6 drop-shadow-md" />
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight mb-2">Login Portal</h1>
                    <p className="text-slate-500 text-sm font-medium">Securely access your toolbox interface.</p>
                </div>

                {error && <div className="bg-rose-50 border border-rose-200 text-rose-600 p-4 rounded-2xl text-sm mb-6 text-center font-bold tracking-wide shadow-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Identity Envelope</label>
                        <input
                            type="email"
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-700 font-medium placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 transition-all text-sm"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@opt.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Secure Passcode</label>
                        <input
                            type="password"
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-700 font-medium placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 transition-all text-sm tracking-widest"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold tracking-wide py-4 px-4 rounded-2xl shadow-xl shadow-slate-300 transition transform hover:-translate-y-0.5 active:scale-95"
                    >
                        Authenticate Session
                    </button>
                    <p className="text-center text-xs text-slate-400 font-medium mt-6 mt-8">Ogun AYM Media.</p>
                </form>
            </div>
        </div>
    );
};

export default Login;
