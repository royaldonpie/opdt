import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { AuthContext } from '../context/AuthContext';
import { Users, Search, Download } from 'lucide-react';

const AllMembers = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('full_name');
    const { token } = useContext(AuthContext);

    useEffect(() => {
        axios.get('/api/members/all', { headers: { Authorization: `Bearer ${token}` } })
            .then(res => {
                setMembers(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [token]);

    const filteredMembers = members.filter(m =>
        m.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (m.club_name && m.club_name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const sortedMembers = [...filteredMembers].sort((a, b) => {
        if (sortBy === 'club_name') {
            return (a.club_name || '').localeCompare(b.club_name || '');
        }
        if (sortBy === 'role') {
            return a.role.localeCompare(b.role);
        }
        return a.full_name.localeCompare(b.full_name);
    });

    const handleExport = () => {
        const ws = XLSX.utils.json_to_sheet(sortedMembers.map(m => ({
            'Full Name': m.full_name,
            'Gender': m.gender,
            'Club Name': m.club_name,
            'Church Name': m.church_name,
            'Role': m.role,
            'Class/Rank': m.role === 'instructor' ? m.instructor_rank : m.class_level,
            'Age': m.age,
            'Year Joined': m.year_joined
        })));
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "All_Members");
        XLSX.writeFile(wb, `Global_Members_Export.xlsx`);
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading tracking data...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Global Members Database</h2>
                    <p className="text-slate-500 text-sm mt-1">View, search, and sort all registered club members across the conference.</p>
                </div>
                <button onClick={handleExport} className="flex items-center py-2.5 px-5 bg-white border border-slate-200 text-slate-700 rounded-xl shadow-sm hover:bg-slate-50 transition">
                    <Download className="w-5 h-5 mr-2 text-indigo-500" /> Export to Excel
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by name or club..."
                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="w-full md:w-64 shrink-0">
                    <select
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="full_name">Sort by Name</option>
                        <option value="club_name">Sort by Club Name</option>
                        <option value="role">Sort by Role</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest pl-10">Member Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Club & Church</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Role Info</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right pr-10">Year Joined</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {sortedMembers.map((m) => (
                                <tr key={m.id} className="hover:bg-slate-50/50 transition">
                                    <td className="px-6 py-4 pl-10">
                                        <div className="font-bold text-slate-800 text-[1.05rem]">{m.full_name}</div>
                                        <div className="flex gap-2 mt-1">
                                            <span className="text-[0.6rem] text-slate-500 tracking-widest uppercase font-black bg-slate-100 rounded-md px-1.5 py-0.5">{m.gender}</span>
                                            {m.age && <span className="text-[0.6rem] text-slate-500 tracking-widest uppercase font-black bg-slate-100 rounded-md px-1.5 py-0.5">AGE {m.age}</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-indigo-700">{m.club_name || 'N/A'}</div>
                                        <div className="text-xs text-slate-500 uppercase tracking-wide font-semibold mt-1">{m.church_name || 'N/A'} Church</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1 items-start">
                                            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                                                {m.role}
                                            </span>
                                            {m.role === 'instructor' && m.instructor_rank ? (
                                                <span className="px-2 py-0.5 rounded-lg text-[0.65rem] font-black bg-amber-100 text-amber-700 uppercase">{m.instructor_rank}</span>
                                            ) : (
                                                <span className="px-2 py-0.5 rounded-lg text-[0.65rem] font-black bg-blue-100 text-blue-700 uppercase">{m.class_level}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right pr-10 font-bold text-slate-400">
                                        {m.year_joined}
                                    </td>
                                </tr>
                            ))}
                            {sortedMembers.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-slate-500 font-medium">No members found mathing criteria.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AllMembers;
