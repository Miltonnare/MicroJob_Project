import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuthStore } from '../store/useAuthStore';
import { Wallet, Briefcase, Zap, ShieldCheck, Star, CheckCircle, Clock } from 'lucide-react';

export const WorkerDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<any>(null);
  const [earnings, setEarnings] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [emergency, setEmergency] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const [profRes, earnRes, appRes] = await Promise.all([
        api.get('/workers/profile/me'),
        api.get('/payments/earnings/dashboard'),
        api.get('/applications/my-applications'),
      ]);

      setProfile(profRes.data);
      setEmergency(profRes.data.emergencyAvailable);
      setEarnings(earnRes.data);
      setApplications(appRes.data);
    } catch (err) {
      console.error('Failed to load worker dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleEmergency = async () => {
    try {
      const newStatus = !emergency;
      setEmergency(newStatus);
      await api.put('/workers/profile/me', { emergencyAvailable: newStatus });
    } catch (err) {
      setEmergency(!emergency);
    }
  };

  if (loading) return <div className="text-center py-16 text-slate-400">Loading Fundi Dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatarUrl || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150'}
            alt={user?.fullName}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-500"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white">{user?.fullName}</h1>
              {profile?.isIdVerified && (
                <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> ID Verified
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              {profile?.county?.name || 'Kenya'} • Daily Rate: KES {profile?.dailyRate?.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Emergency Toggle */}
        <div className="flex items-center gap-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-700">
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1">
              <Zap className="w-4 h-4 text-amber-400" />
              Emergency Dispatch Ready
            </div>
            <div className="text-[10px] text-slate-400">Accept 1-hour urgent jobs near you</div>
          </div>
          <button
            onClick={toggleEmergency}
            className={`w-12 h-6 rounded-full transition-colors p-1 ${
              emergency ? 'bg-emerald-500' : 'bg-slate-700'
            }`}
          >
            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${emergency ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-800/60 border border-slate-700 p-6 rounded-2xl space-y-1">
          <span className="text-xs text-slate-400 block">Total M-Pesa Earnings</span>
          <span className="text-2xl font-extrabold text-emerald-400">
            KES {earnings?.totalEarned?.toLocaleString() || 0}
          </span>
        </div>

        <div className="bg-slate-800/60 border border-slate-700 p-6 rounded-2xl space-y-1">
          <span className="text-xs text-slate-400 block">Funds Held in Escrow</span>
          <span className="text-2xl font-extrabold text-amber-400">
            KES {earnings?.inEscrow?.toLocaleString() || 0}
          </span>
        </div>

        <div className="bg-slate-800/60 border border-slate-700 p-6 rounded-2xl space-y-1">
          <span className="text-xs text-slate-400 block">Jobs Completed</span>
          <span className="text-2xl font-extrabold text-white">
            {earnings?.completedJobsCount || 0} Jobs
          </span>
        </div>

        <div className="bg-slate-800/60 border border-slate-700 p-6 rounded-2xl space-y-1">
          <span className="text-xs text-slate-400 block">Trust Score</span>
          <span className="text-2xl font-extrabold text-amber-400 flex items-center gap-1">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            {profile?.trustScore?.toFixed(1) || 80}
          </span>
        </div>
      </div>

      {/* Applications List */}
      <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-3xl space-y-4">
        <h3 className="text-lg font-bold text-white">My Job Applications</h3>
        {applications.length === 0 ? (
          <p className="text-xs text-slate-400 py-4">No job applications submitted yet.</p>
        ) : (
          <div className="space-y-3">
            {applications.map((app) => (
              <div key={app.id} className="bg-slate-900/60 border border-slate-700 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm">{app.job?.title}</h4>
                  <p className="text-xs text-slate-400">
                    Proposed Rate: KES {app.proposedRate} • Applied {new Date(app.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${
                  app.status === 'ACCEPTED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-700 text-slate-300'
                }`}>
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
