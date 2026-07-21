import React from 'react';
import { ShieldCheck, Heart, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 py-12 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center font-bold text-slate-950">
              MJ
            </div>
            <span className="text-lg font-bold text-white">MicroJob Kenya</span>
          </div>
          <p className="text-xs leading-relaxed text-slate-400">
            Empowering Kenya's informal sector laborers, fundis, masons, mechanics, cleaners, and artisans with instant digital job matching, verified credentials, and secure M-Pesa escrow protection.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3 uppercase tracking-wider text-xs">For Workers (Fundis)</h4>
          <ul className="space-y-2 text-xs">
            <li><a href="/jobs" className="hover:text-amber-400 transition-colors">Browse Informal Jobs</a></li>
            <li><a href="/register" className="hover:text-amber-400 transition-colors">Create Fundi Profile</a></li>
            <li><a href="#" className="hover:text-amber-400 transition-colors">Emergency Dispatch</a></li>
            <li><a href="#" className="hover:text-amber-400 transition-colors">M-Pesa Escrow Protection</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3 uppercase tracking-wider text-xs">For Employers & Contractors</h4>
          <ul className="space-y-2 text-xs">
            <li><a href="/workers" className="hover:text-emerald-400 transition-colors">Find Skilled Masons & Workers</a></li>
            <li><a href="/post-job" className="hover:text-emerald-400 transition-colors">Post Casual Job Opportunity</a></li>
            <li><a href="#" className="hover:text-emerald-400 transition-colors">Contractor Fleet Management</a></li>
            <li><a href="#" className="hover:text-emerald-400 transition-colors">ID Verification Checks</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3 uppercase tracking-wider text-xs">Kenyan Coverage</h4>
          <div className="flex items-center gap-2 text-xs text-emerald-400 mb-2">
            <MapPin className="w-4 h-4" />
            <span>Serving all 47 Counties</span>
          </div>
          <p className="text-xs text-slate-500">
            Nairobi • Kisumu • Mombasa • Nakuru • Kiambu • Eldoret • Machakos • Kakamega
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8 pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <p>© 2026 MicroJob Kenya Platform Ltd. Built with pride for Kenya's informal workforce.</p>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-500" /> Enterprise Escrow Protected
          </span>
        </div>
      </div>
    </footer>
  );
};
