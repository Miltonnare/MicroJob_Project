import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ShieldCheck, Users, Briefcase, DollarSign, AlertTriangle } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, reportsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/reports'),
      ]);
      setStats(statsRes.data);
      setReports(reportsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-16 text-slate-400">Loading Admin Control Portal...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-3xl font-extrabold text-white">System Admin & Moderation Portal</h1>
        <p className="text-slate-400 text-sm">Platform oversight, dispute resolution, and escrow metrics</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-800/60 border border-slate-700 p-6 rounded-2xl space-y-1">
          <span className="text-xs text-slate-400 block">Total Registered Users</span>
          <span className="text-2xl font-extrabold text-white">{stats?.totalUsers || 0}</span>
        </div>

        <div className="bg-slate-800/60 border border-slate-700 p-6 rounded-2xl space-y-1">
          <span className="text-xs text-slate-400 block">Registered Fundis</span>
          <span className="text-2xl font-extrabold text-amber-400">{stats?.totalWorkers || 0}</span>
        </div>

        <div className="bg-slate-800/60 border border-slate-700 p-6 rounded-2xl space-y-1">
          <span className="text-xs text-slate-400 block">Total Jobs Posted</span>
          <span className="text-2xl font-extrabold text-white">{stats?.totalJobs || 0}</span>
        </div>

        <div className="bg-slate-800/60 border border-slate-700 p-6 rounded-2xl space-y-1">
          <span className="text-xs text-slate-400 block">Active Escrow Volume</span>
          <span className="text-2xl font-extrabold text-emerald-400">
            KES {stats?.escrowVolumeHeld?.toLocaleString() || 0}
          </span>
        </div>
      </div>

      {/* Moderation Queue */}
      <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-3xl space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          Disputes & Moderation Reports
        </h3>

        {reports.length === 0 ? (
          <p className="text-xs text-slate-400 py-4">No active disputes or reports filed.</p>
        ) : (
          <div className="space-y-3">
            {reports.map((rep) => (
              <div key={rep.id} className="bg-slate-900/60 border border-slate-700 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-white">Reason: {rep.reason}</div>
                  <div className="text-xs text-slate-400">
                    Reporter: {rep.reporter?.fullName} • Target: {rep.reportedUser?.fullName}
                  </div>
                </div>
                <span className="text-xs font-bold bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full uppercase">
                  {rep.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
