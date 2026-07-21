import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { useAuthStore } from '../store/useAuthStore';
import { Search, MapPin, Briefcase, Sparkles, Filter, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  description: string;
  budgetAmount: number;
  budgetType: string;
  urgency: string;
  address?: string;
  createdAt: string;
  employer: { fullName: string; avatarUrl?: string };
  category: { name: string };
  county?: { name: string };
  skills: { skill: { name: string } }[];
  matchScorePercent?: number;
}

export const JobSearch: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [showAIRecommendations, setShowAIRecommendations] = useState(false);
  const [loading, setLoading] = useState(true);
  const [applyingJobId, setApplyingJobId] = useState<string | null>(null);
  const [applySuccess, setApplySuccess] = useState<string | null>(null);

  const { user } = useAuthStore();

  useEffect(() => {
    fetchJobs();
  }, [searchParams]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const search = searchParams.get('search') || '';
      const county = searchParams.get('county') || '';
      const res = await api.get(`/jobs?search=${search}`);
      setJobs(res.data);

      if (user?.role === 'WORKER') {
        const recRes = await api.get('/jobs/match/recommendations');
        setRecommendations(recRes.data);
      }
    } catch (err) {
      console.error('Failed to fetch jobs', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId: string, proposedRate: number) => {
    setApplyingJobId(jobId);
    setApplySuccess(null);
    try {
      await api.post('/applications', {
        jobId,
        proposedRate,
        coverLetter: 'Ready for immediate dispatch and work.',
      });
      setApplySuccess(jobId);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to apply.');
    } finally {
      setApplyingJobId(null);
    }
  };

  const displayList = showAIRecommendations
    ? recommendations.map((r) => ({ ...r.job, matchScorePercent: r.matchScorePercent }))
    : jobs;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Informal Job Opportunities</h1>
          <p className="text-slate-400 text-sm">Browse physical job site requests ("mjengo", repairs, domestic work)</p>
        </div>

        {user?.role === 'WORKER' && (
          <button
            onClick={() => setShowAIRecommendations(!showAIRecommendations)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              showAIRecommendations
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20'
                : 'bg-slate-800 text-amber-400 border-amber-500/40 hover:bg-slate-700'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            {showAIRecommendations ? 'Showing AI Recommendation Match' : 'Enable AI Proximity Matching'}
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-400 text-sm">Loading informal job listings...</div>
      ) : displayList.length === 0 ? (
        <div className="text-center py-16 bg-slate-800/40 rounded-3xl border border-slate-800 space-y-2">
          <Briefcase className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No jobs found</h3>
          <p className="text-xs text-slate-400">Try adjusting your search criteria or county filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayList.map((job) => (
            <div
              key={job.id}
              className="bg-slate-800/80 border border-slate-700 hover:border-amber-500/40 p-6 rounded-3xl shadow-xl transition-all space-y-4 relative"
            >
              {job.matchScorePercent !== undefined && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 font-black text-xs px-3 py-1 rounded-full shadow">
                  {job.matchScorePercent}% Match
                </div>
              )}

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
                  <span>{job.category?.name}</span>
                  <span>•</span>
                  <span className="uppercase text-[10px] bg-slate-700 px-2 py-0.5 rounded text-slate-300">
                    {job.urgency} Urgency
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white">{job.title}</h3>
              </div>

              <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">{job.description}</p>

              <div className="flex flex-wrap gap-2">
                {job.skills?.map((s, i) => (
                  <span key={i} className="bg-slate-900 text-slate-300 text-[11px] px-2.5 py-1 rounded-lg border border-slate-700">
                    {s.skill?.name}
                  </span>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-700/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 block">Daily Budget</span>
                  <span className="text-lg font-extrabold text-amber-400">
                    KES {job.budgetAmount?.toLocaleString()}
                  </span>
                </div>

                {applySuccess === job.id ? (
                  <span className="text-emerald-400 text-xs font-bold flex items-center gap-1 bg-emerald-950/60 border border-emerald-500/40 px-3 py-2 rounded-xl">
                    <CheckCircle2 className="w-4 h-4" /> Application Sent
                  </span>
                ) : user?.role === 'WORKER' ? (
                  <button
                    onClick={() => handleApply(job.id, job.budgetAmount)}
                    disabled={applyingJobId === job.id}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md shadow-emerald-600/20 disabled:opacity-50"
                  >
                    {applyingJobId === job.id ? 'Applying...' : 'Quick Apply'}
                  </button>
                ) : (
                  <span className="text-xs text-slate-500">Sign in as Worker to apply</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
