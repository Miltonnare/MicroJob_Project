import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Hammer, Home as HomeIcon, Wrench, Sprout, Truck, ShieldCheck, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';

export const Home: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCounty, setSelectedCounty] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/jobs?search=${search}&county=${selectedCounty}`);
  };

  const categories = [
    { title: 'Construction & Masonry', icon: Hammer, slug: 'construction-masonry', count: '1,420 Fundis', color: 'from-amber-500/20 to-amber-600/10 border-amber-500/30 text-amber-400' },
    { title: 'Domestic & House Cleaning', icon: HomeIcon, slug: 'domestic-services', count: '980 Workers', color: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 text-emerald-400' },
    { title: 'Repairs & Technical Fixes', icon: Wrench, slug: 'repairs-technical', count: '750 Techs', color: 'from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400' },
    { title: 'Agriculture & Farm Labor', icon: Sprout, slug: 'agriculture-farm', count: '630 Helpers', color: 'from-green-500/20 to-green-600/10 border-green-500/30 text-green-400' },
    { title: 'Transport & Boda Delivery', icon: Truck, slug: 'transport-logistics', count: '1,100 Riders', color: 'from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-400' },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-slate-900 to-slate-950" />
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-4 py-1.5 rounded-full text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <Zap className="w-4 h-4 text-amber-400" />
            Kenya's #1 Informal Sector Labor Marketplace
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Connect Directly with Kenya's Most Skilled <span className="bg-gradient-to-r from-amber-400 via-emerald-400 to-amber-500 bg-clip-text text-transparent">Fundis & Casual Workers</span>
          </h1>

          <p className="max-w-3xl mx-auto text-lg text-slate-300 font-normal leading-relaxed">
            From Masons, Carpenters, Welders, Electricians, Plumbers, and Mechanics to House Cleaners, Nannies, and Boda Riders—hire verified informal labor instantly across all 47 Counties with secure M-Pesa Escrow protection.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto bg-slate-800/90 border border-slate-700 p-2 sm:p-3 rounded-2xl shadow-2xl flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex items-center gap-3 px-3 py-2 bg-slate-900/60 rounded-xl border border-slate-700/60">
              <Search className="w-5 h-5 text-amber-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="What fundi or job do you need? (e.g. Mason, Cleaner, Plumber)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
              />
            </div>

            <div className="sm:w-48 flex items-center gap-2 px-3 py-2 bg-slate-900/60 rounded-xl border border-slate-700/60">
              <MapPin className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <select
                value={selectedCounty}
                onChange={(e) => setSelectedCounty(e.target.value)}
                className="w-full bg-transparent text-sm text-white focus:outline-none cursor-pointer"
              >
                <option value="" className="bg-slate-900">All 47 Counties</option>
                <option value="Nairobi" className="bg-slate-900">Nairobi</option>
                <option value="Kisumu" className="bg-slate-900">Kisumu</option>
                <option value="Mombasa" className="bg-slate-900">Mombasa</option>
                <option value="Nakuru" className="bg-slate-900">Nakuru</option>
                <option value="Kiambu" className="bg-slate-900">Kiambu</option>
                <option value="Uasin Gishu" className="bg-slate-900">Uasin Gishu (Eldoret)</option>
              </select>
            </div>

            <button
              type="submit"
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              Search
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Popular Informal Trade Categories</h2>
            <p className="text-slate-400 text-sm">Explore specialized fundis and trade professionals near you</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => {
            const IconComponent = cat.icon;
            return (
              <div
                key={idx}
                onClick={() => navigate(`/jobs?category=${cat.slug}`)}
                className={`p-6 rounded-2xl bg-gradient-to-br ${cat.color} border glass-card glass-card-hover cursor-pointer transition-all space-y-4`}
              >
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold text-slate-300 bg-slate-900/60 px-2.5 py-1 rounded-full border border-slate-700">
                    {cat.count}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{cat.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">Instant dispatch & daily rates</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* M-Pesa Escrow Trust Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-amber-950/80 border border-emerald-500/30 rounded-3xl p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" /> Built for Kenya's Trust Economy
            </div>
            <h2 className="text-3xl font-extrabold text-white">
              Guaranteed Payment with <span className="text-emerald-400">M-Pesa Escrow Protection</span>
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Employers deposit job funds into secure escrow via M-Pesa STK push. Funds are only released to the fundi once the work is completed and verified. No deposit scams, no delayed payments for workers.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-slate-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span>Verified National ID check for all registered fundis</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span>GPS radius matching for immediate physical job sites ("mjengo")</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span>Real-time voice note and photo chat messaging</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="font-bold text-white text-base">Quick Escrow Workflow Demo</h3>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                <span>1. Employer posts Masonry job</span>
                <span className="font-bold text-amber-400">KES 1,800 / Day</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                <span>2. M-Pesa STK Push holds funds</span>
                <span className="text-emerald-400 font-semibold">HELD IN ESCROW</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                <span>3. Fundi completes job & submits photo</span>
                <span className="text-blue-400 font-semibold">WORK COMPLETE</span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-between">
                <span>4. Employer releases payment</span>
                <span className="font-bold text-emerald-400">RELEASED TO MPESA</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
