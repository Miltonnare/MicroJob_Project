import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { WorkerMap } from '../components/maps/WorkerMap';
import { Search, MapPin, ShieldCheck, Phone, Star, Zap, Map } from 'lucide-react';

interface Worker {
  id: string;
  bio: string;
  dailyRate: number;
  trustScore: number;
  emergencyAvailable: boolean;
  latitude?: number;
  longitude?: number;
  travelRadiusKm?: number;
  user: { fullName: string; phone: string; avatarUrl?: string; isVerified: boolean };
  county?: { name: string };
  skills: { skill: { name: string } }[];
}

export const WorkerDirectory: React.FC = () => {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [emergencyOnly, setEmergencyOnly] = useState(false);
  const [showMapView, setShowMapView] = useState(false);

  useEffect(() => {
    fetchWorkers();
  }, [emergencyOnly]);

  const fetchWorkers = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/workers?search=${search}&emergencyOnly=${emergencyOnly}`);
      setWorkers(res.data);
    } catch (err) {
      console.error('Failed to fetch workers', err);
    } finally {
      setLoading(false);
    }
  };

  const mapWorkers = workers
    .filter((w) => w.latitude && w.longitude)
    .map((w) => ({
      id: w.id,
      fullName: w.user.fullName,
      phone: w.user.phone,
      dailyRate: w.dailyRate,
      trustScore: w.trustScore,
      latitude: w.latitude!,
      longitude: w.longitude!,
      travelRadiusKm: w.travelRadiusKm,
      skills: w.skills.map((s) => s.skill.name),
    }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Verified Fundis & Casual Laborers</h1>
          <p className="text-slate-400 text-sm">Direct access to skilled masons, plumbers, cleaners, and artisans across Kenya</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setEmergencyOnly(!emergencyOnly)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              emergencyOnly
                ? 'bg-rose-500/20 border-rose-500 text-rose-400 shadow-lg shadow-rose-500/20'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-400" />
            {emergencyOnly ? 'Showing Emergency Dispatch Only' : 'Filter Emergency Available'}
          </button>

          <button
            onClick={() => setShowMapView(!showMapView)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              showMapView
                ? 'bg-amber-500 text-slate-950 border-amber-400'
                : 'bg-slate-800 text-amber-400 border-slate-700'
            }`}
          >
            <Map className="w-4 h-4" />
            {showMapView ? 'Grid View' : 'Map View'}
          </button>
        </div>
      </div>

      {showMapView && mapWorkers.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-300">Interactive Proximity Map (Nearby Fundis)</h3>
          <WorkerMap workers={mapWorkers} />
        </div>
      )}

      {loading ? (
        <div className="text-center py-16 text-slate-400 text-sm">Loading fundi directory...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workers.map((worker) => (
            <div
              key={worker.id}
              className="bg-slate-800/80 border border-slate-700 hover:border-emerald-500/40 p-6 rounded-3xl shadow-xl transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <img
                    src={worker.user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                    alt={worker.user.fullName}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-500/40"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white text-base">{worker.user.fullName}</h3>
                      {worker.user.isVerified && (
                        <span title="ID Verified Fundi">
                          <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-400">{worker.county?.name || 'Kenya'}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">{worker.bio || 'Experienced trade fundi.'}</p>

                <div className="flex flex-wrap gap-1.5">
                  {worker.skills.map((s, i) => (
                    <span key={i} className="bg-slate-900 text-slate-300 text-[10px] font-semibold px-2 py-0.5 rounded border border-slate-700">
                      {s.skill?.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-700/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase text-slate-400 block">Trust Score</span>
                  <span className="text-sm font-extrabold text-emerald-400 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {worker.trustScore.toFixed(1)} / 100
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase text-slate-400 block">Daily Rate</span>
                  <span className="text-sm font-extrabold text-amber-400">
                    KES {worker.dailyRate.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
