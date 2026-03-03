import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FilePlus, FileText, Link as LinkIcon, Trash2, Calendar, Download } from 'lucide-react';

const AdminResources = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formVisible, setFormVisible] = useState(false);
    const { token } = useContext(AuthContext);

    // Form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('pdf');
    const [linkUrl, setLinkUrl] = useState('');
    const [file, setFile] = useState(null);

    const fetchResources = () => {
        axios.get('\/api/resources', { headers: { Authorization: `Bearer ${token}` } })
            .then(res => { setResources(res.data); setLoading(false); })
            .catch(console.error);
    };

    useEffect(() => { fetchResources(); }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('type', type);
            if (type === 'pdf' && file) {
                formData.append('resource_file', file);
            } else if (type === 'link') {
                formData.append('link_url', linkUrl);
            }

            await axios.post('\/api/resources', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setFormVisible(false);
            setTitle('');
            setDescription('');
            setType('pdf');
            setLinkUrl('');
            setFile(null);
            fetchResources();
        } catch (e) { alert('Error adding resource'); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this resource?')) return;
        try {
            await axios.delete(`\/api/resources/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            fetchResources();
        } catch (e) { alert('Error deleting resource'); }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-800">Resource Management</h2>
                    <p className="text-slate-500 text-sm mt-1">Upload materials or add links for Directors to access.</p>
                </div>
                <button onClick={() => setFormVisible(!formVisible)} className="flex items-center py-2.5 px-5 bg-indigo-600 text-white rounded-xl shadow-md hover:bg-indigo-700 hover:shadow-lg transition">
                    <FilePlus className="w-5 h-5 mr-2" /> Add Resource
                </button>
            </div>

            {formVisible && (
                <div className="bg-white/80 backdrop-blur-xl border border-slate-200 shadow-sm rounded-3xl p-8 mb-8 animate-in fade-in slide-in-from-top-4">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Create New Resource</h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
                            <input type="text" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3" value={title} onChange={e => setTitle(e.target.value)} placeholder="E.g. 2026 Pathfinder Honor Manual" />
                        </div>
                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Description (Optional)</label>
                            <textarea className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 h-24" value={description} onChange={e => setDescription(e.target.value)} placeholder="Details regarding this resource..."></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
                            <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3" value={type} onChange={e => setType(e.target.value)}>
                                <option value="pdf">PDF Upload</option>
                                <option value="link">External Link</option>
                            </select>
                        </div>

                        {type === 'pdf' ? (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Upload PDF</label>
                                <input type="file" accept="application/pdf" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5" onChange={e => setFile(e.target.files[0])} required />
                            </div>
                        ) : (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Resource Link URL</label>
                                <input type="url" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3" value={linkUrl} onChange={e => setLinkUrl(e.target.value)} placeholder="https://..." />
                            </div>
                        )}

                        <div className="col-span-full flex justify-end gap-3 mt-4">
                            <button type="button" onClick={() => setFormVisible(false)} className="px-6 py-3 rounded-xl font-medium text-slate-600 hover:bg-slate-100 transition">Cancel</button>
                            <button type="submit" className="px-6 py-3 bg-indigo-600 text-white rounded-xl shadow-md cursor-pointer hover:bg-indigo-700 transition">Publish Resource</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white/90 backdrop-blur-xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Resource info</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date Added</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {resources.map(r => (
                                <tr key={r.id} className="hover:bg-slate-50/50 transition duration-150">
                                    <td className="px-6 py-5">
                                        <div className="font-semibold text-slate-800 text-[1.05rem]">{r.title}</div>
                                        {r.description && <div className="text-sm text-slate-500 mt-1 max-w-lg">{r.description}</div>}
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${r.type === 'pdf' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'}`}>
                                            {r.type === 'pdf' ? <FileText className="w-3.5 h-3.5 mr-1" /> : <LinkIcon className="w-3.5 h-3.5 mr-1" />}
                                            {r.type.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center text-sm text-slate-600">
                                            <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                                            {new Date(r.created_at).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right flex justify-end items-center gap-2">
                                        <a href={r.file_url} target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 p-2 rounded-xl transition" title="View / Download">
                                            <Download className="w-5 h-5" />
                                        </a>
                                        <button onClick={() => handleDelete(r.id)} className="text-rose-400 hover:text-rose-600 hover:bg-rose-50 p-2 rounded-xl transition" title="Delete Resource">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {resources.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="text-center py-12 text-slate-500 bg-slate-50/30">
                                        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                        <p className="font-semibold">No Resources Found.</p>
                                        <p className="text-sm mt-1">Get started by adding a new PDF or Link resource above.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminResources;
