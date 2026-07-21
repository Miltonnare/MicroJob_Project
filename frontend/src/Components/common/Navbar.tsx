import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { Briefcase, Users, PlusCircle, User, LogOut, Shield, Wallet, MessageSquare } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-emerald-500 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              MJ
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-amber-400 to-emerald-400 bg-clip-text text-transparent">
                MicroJob
              </span>
              <span className="block text-[10px] uppercase tracking-widest text-slate-400 font-semibold">
                Kenya Workforce
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link to="/jobs" className="flex items-center gap-2 text-slate-300 hover:text-amber-400 transition-colors">
              <Briefcase className="w-4 h-4 text-amber-500" />
              Find Jobs
            </Link>
            <Link to="/workers" className="flex items-center gap-2 text-slate-300 hover:text-emerald-400 transition-colors">
              <Users className="w-4 h-4 text-emerald-500" />
              Find Fundis
            </Link>

            {user?.role === 'EMPLOYER' || user?.role === 'CONTRACTOR' ? (
              <Link
                to="/post-job"
                className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold px-4 py-2 rounded-xl transition-all shadow-md shadow-amber-500/20"
              >
                <PlusCircle className="w-4 h-4" />
                Post Job
              </Link>
            ) : null}
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to={
                    user.role === 'WORKER'
                      ? '/dashboard/worker'
                      : user.role === 'ADMIN'
                      ? '/admin'
                      : '/dashboard/employer'
                  }
                  className="flex items-center gap-2 text-slate-200 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-semibold"
                >
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  {user.fullName}
                  <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded uppercase">
                    {user.role}
                  </span>
                </Link>

                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-slate-300 hover:text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-1.5 rounded-xl text-sm transition-all shadow-md shadow-emerald-600/20"
                >
                  Register Free
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
