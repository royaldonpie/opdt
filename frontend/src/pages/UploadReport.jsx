import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { UploadCloud, CheckCircle2, ShieldAlert } from 'lucide-react';

const UploadReport = () => {
    const [file, setFile] = useState(null);
    const [reportType, setReportType] = useState('investiture');
    const [videoLink, setVideoLink] = useState('');
    const [baptismCount, setBaptismCount] = useState('');
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const { token } = useContext(AuthContext);

    const isBaptism = reportType === 'baptismal';

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            setFile(selected);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isBaptism && !file) return alert('Please select a valid report document.');
        if (isBaptism && (!baptismCount || parseInt(baptismCount) < 0)) return alert('Please enter a valid total number of baptisms.');

        const formData = new FormData();
        formData.append('report_type', reportType);

        if (isBaptism) {
            formData.append('baptism_count', baptismCount);
        } else {
            formData.append('report_file', file);
            if (videoLink) {
                formData.append('video_link', videoLink);
            }
        }

        setLoading(true);
        setStatus(null);
        try {
            await axios.post('http://localhost:5000/api/reports', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setStatus({ type: 'success', msg: 'Report successfully securely uploaded!' });
            setFile(null);
            setBaptismCount('');
            e.target.reset();
        } catch (err) {
            setStatus({ type: 'error', msg: err.response?.data?.error || 'Upload failed' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div>
                <h2 className="text-3xl font-extrabold tracking-tight text-slate-800">Secure Report Upload</h2>
                <p className="text-slate-500 text-sm mt-2 max-w-lg">Upload structural reports from your Pathfinder club directly to the Conference encrypted vault.</p>
            </div>

            {status && (
                <div className={`p-4 rounded-2xl flex items-center border ${status.type === 'success' ? 'bg-emerald-50/50 border-emerald-200 text-emerald-700' : 'bg-rose-50/50 border-rose-200 text-rose-700'}`}>
                    {status.type === 'success' ? <CheckCircle2 className="w-5 h-5 mr-3" /> : <ShieldAlert className="w-5 h-5 mr-3" />}
                    <span className="font-medium text-sm">{status.msg}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] p-8">

                <div className="mb-8">
                    <label className="block text-sm font-bold text-slate-700 mb-3">Report Type Document</label>
                    <select
                        value={reportType}
                        onChange={e => setReportType(e.target.value)}
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-700 font-medium focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 transition"
                    >
                        <option value="investiture">Investiture Service Report</option>
                        <option value="induction">Induction Ceremony Report</option>
                        <option value="enrollment">Club Enrollment Roster</option>
                        <option value="program">Quarterly Program Update</option>
                        <option value="program report">Program Report</option>
                        <option value="evangelism/mission">Evangelism / Mission</option>
                        <option value="camping">Camping</option>
                        <option value="baptismal">Baptismal Report</option>
                    </select>
                </div>

                {isBaptism ? (
                    <div className="mb-8">
                        <label className="block text-sm font-bold text-slate-700 mb-3">Total Number of Baptisms</label>
                        <input
                            type="number"
                            min="0"
                            value={baptismCount}
                            onChange={e => setBaptismCount(e.target.value)}
                            placeholder="e.g. 15"
                            className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-700 font-medium focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 transition"
                        />
                    </div>
                ) : (
                    <>
                        <div className="mb-8">
                            <label className="block text-sm font-bold text-slate-700 mb-3">External Media Link (Optional)</label>
                            <input
                                type="url"
                                value={videoLink}
                                onChange={e => setVideoLink(e.target.value)}
                                placeholder="https://youtube.com/... or social media link"
                                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-700 font-medium focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 transition"
                            />
                        </div>

                        <div className="mb-8">
                            <label className="block text-sm font-bold text-slate-700 mb-3">Attach File</label>
                            <div className="relative mt-1 flex justify-center px-6 pt-10 pb-12 border-2 border-slate-200 border-dashed rounded-[2rem] hover:border-indigo-400 hover:bg-indigo-50/30 transition-all group cursor-pointer">
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx,.ppt,.pptx"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="space-y-2 text-center">
                                    <UploadCloud className="mx-auto h-14 w-14 text-indigo-300 group-hover:text-indigo-500 transition-colors" />
                                    <div className="flex text-sm text-slate-600 justify-center">
                                        <span className="relative font-bold text-indigo-600 bg-white px-2 rounded-md">
                                            {file ? file.name : "Upload a file"}
                                        </span>
                                        {!file && <p className="pl-1 font-medium">or drag and drop</p>}
                                    </div>
                                    <p className="text-xs text-slate-400 font-medium">PDF, Word, or PowerPoint up to 10MB</p>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                <button
                    disabled={loading}
                    type="submit"
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-2xl shadow-xl shadow-slate-200 transition transform active:scale-95 disabled:opacity-50"
                >
                    {loading ? 'Encrypting & Uploading...' : 'Securely Submit Report'}
                </button>
            </form>
        </div>
    );
};

export default UploadReport;
