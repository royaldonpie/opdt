import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { UploadCloud, CheckCircle2, ShieldAlert, Sparkles, Clock, DownloadCloud } from 'lucide-react';

const SubmitExam = () => {
    const { token } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);
    const [file, setFile] = useState(null);
    // Fetch honors based on selected class
    React.useEffect(() => {
        if (token) {
            axios.get('http://localhost:5000/api/exams/honors', { headers: { Authorization: `Bearer ${token}` } })
                .then(res => setHonorsList(res.data))
                .catch(err => console.error('Failed to load honors list:', err));
        }
    }, [token]);

    // Initial Exam state
    const [examData, setExamData] = useState({
        class_level: 'Friend',
        exam_type: 'achievement_class',
        honor_name: '',
    });

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            setFile(selected);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setStatus({ type: 'error', msg: 'Please select an exam document file to upload.' });
            return;
        }

        setLoading(true);
        setStatus(null);

        const formData = new FormData();
        formData.append('exam_file', file);
        formData.append('class_level', examData.class_level);
        formData.append('exam_type', examData.exam_type);
        if (examData.honor_name) {
            formData.append('honor_name', examData.honor_name);
        }

        try {
            await axios.post('http://localhost:5000/api/exams', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setStatus({ type: 'success', msg: 'Exam successfully passed initial AI screening and is submitted for Admin review!' });
            setFile(null);
            setExamData({ class_level: 'Friend', exam_type: 'achievement_class', honor_name: '' });
            document.getElementById('file-upload').value = ''; // Reset UI file input
            setTimeout(() => setStatus(null), 10000);
        } catch (err) {
            setStatus({ type: 'error', msg: err.response?.data?.error || 'Validation Failed' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto pb-10">
            <div className="mb-10 animate-in fade-in slide-in-from-top-4">
                <h2 className="text-3xl font-extrabold tracking-tight text-slate-800">Secure Exam Processing</h2>
                <p className="text-slate-500 text-sm mt-2 max-w-xl leading-relaxed">Upload exam structural documents (PDF, Word) for automatic Conference validation checks and AI parsing before Super Admin veto.</p>
            </div>

            {status && (
                <div className={`p-4 rounded-2xl flex items-start border mb-8 animate-in zoom-in-95 ${status.type === 'success' ? 'bg-emerald-50/80 border-emerald-200 text-emerald-800' : 'bg-rose-50/80 border-rose-200 text-rose-800'}`}>
                    {status.type === 'success' ? <CheckCircle2 className="w-5 h-5 mr-3 shrink-0 mt-0.5" /> : <ShieldAlert className="w-5 h-5 mr-3 shrink-0 mt-0.5" />}
                    <div className="font-medium text-sm leading-snug">{status.msg}</div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Exam Settings Card */}
                <div className="bg-white/90 backdrop-blur-2xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] rounded-[2rem] p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Target Class</label>
                            <select
                                value={examData.class_level}
                                onChange={e => {
                                    const newClass = e.target.value;
                                    setExamData({
                                        ...examData,
                                        class_level: newClass,
                                        exam_type: newClass === 'General' ? 'honor' : examData.exam_type,
                                        honor_name: ''
                                    });
                                }}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium focus:ring-2 focus:ring-indigo-200"
                            >
                                {['Friend', 'Companion', 'Explorer', 'Ranger', 'Voyager', 'Guide', 'General'].map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Exam Category</label>
                            <select
                                value={examData.exam_type}
                                onChange={e => {
                                    setExamData({ ...examData, exam_type: e.target.value, honor_name: '' });
                                }}
                                disabled={examData.class_level === 'General'}
                                className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium focus:ring-2 focus:ring-indigo-200 ${examData.class_level === 'General' ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {examData.class_level !== 'General' && <option value="achievement_class">Achievement Class</option>}
                                <option value="honor">Honor</option>
                            </select>
                        </div>
                        {examData.exam_type === 'honor' && (
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Honor Title</label>
                                <select
                                    required
                                    value={examData.honor_name}
                                    onChange={e => setExamData({ ...examData, honor_name: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium focus:ring-2 focus:ring-indigo-200"
                                >
                                    <option value="">-- Choose Honor --</option>
                                    {honorsList
                                        .filter(h => {
                                            if (examData.class_level === 'General') return h.category === 'general';
                                            return h.class_level === examData.class_level && h.category !== 'general';
                                        })
                                        .map(h => (
                                            <option key={h.id} value={h.honor_name}>{h.honor_name}</option>
                                        ))
                                    }
                                </select>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white/90 backdrop-blur-2xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] rounded-[2rem] p-8">
                    <label className="block text-sm font-bold text-slate-700 mb-3">Attach the Exam Document</label>
                    <div className="relative mt-1 flex justify-center px-6 pt-10 pb-12 border-2 border-slate-200 border-dashed rounded-[2rem] hover:border-indigo-400 hover:bg-indigo-50/30 transition-all group cursor-pointer">
                        <input
                            id="file-upload"
                            type="file"
                            onChange={handleFileChange}
                            accept=".pdf,.doc,.docx"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="space-y-2 text-center flex flex-col items-center">
                            <UploadCloud className="mx-auto h-14 w-14 text-indigo-300 group-hover:text-indigo-500 transition-colors" />
                            <div className="flex text-sm text-slate-600 justify-center">
                                <span className="relative font-bold text-indigo-600 bg-white px-2 rounded-md truncate max-w-[250px]">
                                    {file ? file.name : "Select Exam Document"}
                                </span>
                            </div>
                            <p className="text-xs text-slate-400 font-medium">Supports PDF, DOC, DOCX up to 10MB</p>
                        </div>
                    </div>
                </div>

                {/* Engine Tips */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-3xl p-5 flex">
                    <Sparkles className="w-6 h-6 text-indigo-500 mr-4 shrink-0" />
                    <div>
                        <h4 className="text-sm font-bold text-indigo-900">AI Validation Enabled</h4>
                        <p className="text-xs text-indigo-700 font-medium mt-1">Our automated system will strictly verify if the Honor applies to the target Class limits, and pre-screen the PDF for structure matching before the final human Director review.</p>
                    </div>
                </div>

                <div className="pt-4">
                    <button disabled={loading} type="submit" className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl shadow-xl shadow-slate-200 transition transform active:scale-95 disabled:opacity-50 flex justify-center">
                        {loading ? 'Running AI Parsing & Validation...' : 'Transmit Final File to Conference'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SubmitExam;
