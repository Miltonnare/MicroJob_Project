import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuthStore } from '../store/useAuthStore';
import { User, Phone, Mail, Lock, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';

export const Register: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'WORKER' | 'EMPLOYER' | 'CONTRACTOR'>('WORKER');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/register', {
        fullName,
        email,
        phone,
        password,
        role,
      });

      setAuth(res.data.user, res.data.tokens.accessToken);
      if (role === 'WORKER') navigate('/dashboard/worker');
      else navigate('/dashboard/employer');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-12 px-4">
      <div className="bg-slate-800/80 border border-slate-700 p-8 rounded-3xl shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white">Join MicroJob Kenya</h2>
          <p className="text-xs text-slate-400">Select your role to connect with workers or opportunities</p>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Role Selector */}
        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setRole('WORKER')}
            className={`p-3 rounded-2xl border text-center transition-all ${
              role === 'WORKER'
                ? 'bg-amber-500/20 border-amber-500 text-amber-400 font-bold'
                : 'bg-slate-900/60 border-slate-700 text-slate-400'
            }`}
          >
            <div className="text-sm">Fundi / Worker</div>
            <div className="text-[10px] opacity-75">Seek Jobs</div>
          </button>

          <button
            type="button"
            onClick={() => setRole('EMPLOYER')}
            className={`p-3 rounded-2xl border text-center transition-all ${
              role === 'EMPLOYER'
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 font-bold'
                : 'bg-slate-900/60 border-slate-700 text-slate-400'
            }`}
          >
            <div className="text-sm">Employer</div>
            <div className="text-[10px] opacity-75">Hire Labor</div>
          </button>

          <button
            type="button"
            onClick={() => setRole('CONTRACTOR')}
            className={`p-3 rounded-2xl border text-center transition-all ${
              role === 'CONTRACTOR'
                ? 'bg-blue-500/20 border-blue-500 text-blue-400 font-bold'
                : 'bg-slate-900/60 border-slate-700 text-slate-400'
            }`}
          >
            <div className="text-sm">Contractor</div>
            <div className="text-[10px] opacity-75">Manage Sites</div>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Full Name</label>
            <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl">
              <User className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <input
                type="text"
                required
                placeholder="e.g. John Omondi"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-transparent text-sm text-white focus:outline-none placeholder-slate-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Phone Number (+254)</label>
              <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl">
                <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <input
                  type="text"
                  required
                  placeholder="+254712345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-transparent text-sm text-white focus:outline-none placeholder-slate-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Email Address</label>
              <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl">
                <Mail className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <input
                  type="email"
                  required
                  placeholder="john@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent text-sm text-white focus:outline-none placeholder-slate-500"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Password</label>
            <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl">
              <Lock className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <input
                type="password"
                required
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent text-sm text-white focus:outline-none placeholder-slate-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Register Account'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-400 pt-4 border-t border-slate-700/60">
          Already registered?{' '}
          <Link to="/login" className="text-emerald-400 hover:underline font-semibold">
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
};
