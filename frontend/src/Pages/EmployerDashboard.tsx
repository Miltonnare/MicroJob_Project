import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuthStore } from '../store/useAuthStore';
import { Briefcase, Users, ShieldCheck, CheckCircle2, DollarSign, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const EmployerDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [releasingContractId, setReleasingContractId] = useState<string | null>(null);

  useEffect(() => {
    fetchEmployerJobs();
  }, []);

  const fetchEmployerJobs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/jobs');
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptApplication = async (appId: string) => {
    try {
      await api.post(`/applications/${appId}/accept`);
      alert('Application accepted! Contract & Escrow created.');
      fetchEmployerJobs();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to accept application.');
    }
  };

  const handleReleaseEscrow = async (contractId: string) => {
    setReleasingContractId(contractId);
    try {
      await api.post(`/payments/escrow/release/${contractId}`);
      alert('Escrow payment released to Fundi M-Pesa!');
      fetchEmployerJobs();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to release payment.');
    } finally {
      setReleasingContractId(null);
    }
  };

  if (loading) return <div className="text-center py-16 text-slate-400">Loading Employer Dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Employer & Contractor Dashboard</h1>
          <p className="text-slate-400 text-sm">Manage posted jobs, active contracts, and M-Pesa escrow payments</p>
        </div>

        <Link
          to="/post-job"
          className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center gap-2 text-sm w-fit"
        >
          <PlusCircle className="w-4 h-4" />
          Post New Job Opportunity
        </Link>
      </div>

      {/* Jobs List */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-white">My Posted Job Opportunities</h3>
        {jobs.length === 0 ? (
          <div className="text-center py-12 bg-slate-800/40 rounded-3xl border border-slate-800">
            <p className="text-slate-400 text-sm">No jobs posted yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {jobs.map((job) => (
              <div key={job.id} className="bg-slate-800/80 border border-slate-700 p-6 rounded-3xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-white">{job.title}</h4>
                    <span className="text-xs text-slate-400">
                      Budget: <span className="font-bold text-amber-400">KES {job.budgetAmount?.toLocaleString()}</span> ({job.budgetType})
                    </span>
                  </div>
                  <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full uppercase border border-emerald-500/30">
                    {job.status}
                  </span>
                </div>

                {/* Applicants Sub-Section */}
                {job.applications && job.applications.length > 0 && (
                  <div className="pt-4 border-t border-slate-700/60 space-y-3">
                    <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Fundi Applicants</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {job.applications.map((app: any) => (
                        <div key={app.id} className="bg-slate-900/80 p-3 rounded-xl border border-slate-700 flex items-center justify-between">
                          <div>
                            <div className="font-bold text-sm text-white">{app.worker?.fullName}</div>
                            <div className="text-xs text-slate-400">Rate: KES {app.proposedRate}</div>
                          </div>
                          {app.status === 'PENDING' ? (
                            <button
                              onClick={() => handleAcceptApplication(app.id)}
                              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition-all"
                            >
                              Hire & Fund Escrow
                            </button>
                          ) : (
                            <span className="text-xs font-bold text-emerald-400">Hired</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
