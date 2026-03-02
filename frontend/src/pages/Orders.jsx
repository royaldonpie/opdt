import React from 'react';
import { Package, ShoppingCart } from 'lucide-react';

const Orders = () => {
    return (
        <div className="min-h-[70vh] flex items-center justify-center animate-in fade-in zoom-in duration-500">
            <div className="bg-white/90 backdrop-blur-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-[3rem] p-12 text-center max-w-lg">
                <div className="relative mx-auto w-24 h-24 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-[2rem] flex items-center justify-center mb-8 border border-white shadow-inner shadow-slate-200">
                    <Package className="w-12 h-12 text-indigo-500" />
                    <div className="absolute -top-3 -right-3 bg-rose-500 text-white text-[0.6rem] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-md animate-pulse">
                        Beta
                    </div>
                </div>

                <h2 className="text-3xl font-extrabold text-slate-800 mb-4 tracking-tight">Supply Chain Module</h2>
                <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 mb-6">Coming Soon</h3>

                <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">
                    Soon you will be able to digitally requisition Workbooks, Honor Tokens, Uniform Insignia, and Camp Supplies directly from the Conference Storehouse right within your toolbox.
                </p>

                <button disabled className="w-full py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-400 font-bold flex items-center justify-center transition cursor-not-allowed">
                    <ShoppingCart className="w-5 h-5 mr-2" /> Store Interface Locked
                </button>
            </div>
        </div>
    );
};

export default Orders;
