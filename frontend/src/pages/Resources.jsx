import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FileText, Link as LinkIcon, Calendar, Download, ExternalLink } from 'lucide-react';

const Resources = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useContext(AuthContext);

    useEffect(() => {
        axios.get('\/api/resources', { headers: { Authorization: `Bearer ${token}` } })
            .then(res => { setResources(res.data); setLoading(false); })
            .catch(console.error);
    }, [token]);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h2 className="text-3xl font-extrabold tracking-tight text-slate-800">Resource Center</h2>
                <p className="text-slate-500 text-sm mt-2 max-w-xl">Download important materials, PDFs, or access relevant external links from the Conference.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources.map(r => (
                    <div key={r.id} className="bg-white/90 backdrop-blur-2xl border border-slate-100 shadow-sm rounded-3xl p-6 transition hover:shadow-lg hover:-translate-y-1 block relative overflow-hidden group">

                        <div className="absolute top-0 right-0 p-4">
                            <div className={`p-2 rounded-xl backdrop-blur-md shadow-sm ${r.type === 'pdf' ? 'bg-rose-50 text-rose-500' : 'bg-blue-50 text-blue-500'}`}>
                                {r.type === 'pdf' ? <FileText className="w-5 h-5" /> : <LinkIcon className="w-5 h-5" />}
                            </div>
                        </div>

                        <div className="pr-12">
                            <h3 className="text-xl font-bold text-slate-800 leading-tight mb-2">{r.title}</h3>
                            <div className="flex items-center text-xs font-semibold text-slate-400 mb-4 uppercase tracking-wider">
                                <Calendar className="w-3.5 h-3.5 mr-1.5" /> {new Date(r.created_at).toLocaleDateString()}
                            </div>
                        </div>

                        {r.description && (
                            <p className="text-slate-500 text-sm mb-6 line-clamp-3">
                                {r.description}
                            </p>
                        )}

                        <div className="pt-4 border-t border-slate-100 flex justify-end">
                            <a
                                href={r.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`flex items-center py-2 px-4 rounded-xl font-bold text-sm shadow-sm transition ${r.type === 'pdf'
                                        ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                                        : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                                    }`}
                            >
                                {r.type === 'pdf' ? (
                                    <><Download className="w-4 h-4 mr-2" /> Download PDF</>
                                ) : (
                                    <><ExternalLink className="w-4 h-4 mr-2" /> Visit Link</>
                                )}
                            </a>
                        </div>
                    </div>
                ))}

                {resources.length === 0 && (
                    <div className="col-span-full bg-white/50 backdrop-blur-md rounded-3xl border border-slate-100 border-dashed p-16 text-center text-slate-400">
                        <FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <h3 className="text-lg font-bold text-slate-600 mb-1">No Resources Available</h3>
                        <p className="text-sm max-w-sm mx-auto">The Conference administrators have not uploaded any resources yet. Please check back later.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Resources;
