import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Briefcase, MapPin, DollarSign, Hammer, CheckCircle2, AlertCircle } from 'lucide-react';

export const PostJob: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [counties, setCounties] = useState<any[]>([]);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [countyId, setCountyId] = useState('');
  const [budgetAmount, setBudgetAmount] = useState('1800');
  const [budgetType, setBudgetType] = useState('DAILY');
  const [urgency, setUrgency] = useState('HIGH');
  const [address, setAddress] = useState('');
  const [selectedSkillIds, setSelectedSkillIds] = useState<string[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [catRes, countyRes] = await Promise.all([
        api.get('/locations/categories'),
        api.get('/locations/counties'),
      ]);
      setCategories(catRes.data);
      setCounties(countyRes.data);
      if (catRes.data.length > 0) setCategoryId(catRes.data[0].id);
      if (countyRes.data.length > 0) setCountyId(countyRes.data[0].id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSkillToggle = (skillId: string) => {
    if (selectedSkillIds.includes(skillId)) {
      setSelectedSkillIds(selectedSkillIds.filter((id) => id !== skillId));
    } else {
      setSelectedSkillIds([...selectedSkillIds, skillId]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/jobs', {
        title,
        description,
        categoryId,
        countyId,
        budgetAmount: Number(budgetAmount),
        budgetType,
        urgency,
        address,
        skillIds: selectedSkillIds,
      });

      navigate('/dashboard/employer');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to post job. Check details.');
    } finally {
      setLoading(false);
    }
  };

  const activeCategoryObj = categories.find((c) => c.id === categoryId);

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="bg-slate-800/80 border border-slate-700 p-8 rounded-3xl shadow-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Post an Informal Job / Casual Opportunity</h1>
          <p className="text-xs text-slate-400">Describe physical site requirements ("mjengo", house clean, repairs) and set daily rates</p>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Job Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Stonemasonry Wall Repair or Full Apartment Deep Clean"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Trade Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id} className="bg-slate-900">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">County Location</label>
              <select
                value={countyId}
                onChange={(e) => setCountyId(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none"
              >
                {counties.map((c) => (
                  <option key={c.id} value={c.id} className="bg-slate-900">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {activeCategoryObj && activeCategoryObj.skills?.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Select Specific Required Skills</label>
              <div className="flex flex-wrap gap-2">
                {activeCategoryObj.skills.map((s: any) => {
                  const isSelected = selectedSkillIds.includes(s.id);
                  return (
                    <button
                      type="button"
                      key={s.id}
                      onClick={() => handleSkillToggle(s.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-500 text-amber-400 font-bold'
                          : 'bg-slate-900/60 border-slate-700 text-slate-400'
                      }`}
                    >
                      {s.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Budget Amount (KES)</label>
              <input
                type="number"
                required
                value={budgetAmount}
                onChange={(e) => setBudgetAmount(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Rate Type</label>
              <select
                value={budgetType}
                onChange={(e) => setBudgetType(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none"
              >
                <option value="DAILY" className="bg-slate-900">Per Day (Daily Rate)</option>
                <option value="FIXED" className="bg-slate-900">Fixed Total</option>
                <option value="HOURLY" className="bg-slate-900">Per Hour</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Urgency Level</label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none"
              >
                <option value="HIGH" className="bg-slate-900">High (Immediate)</option>
                <option value="URGENT" className="bg-slate-900">Urgent (Today)</option>
                <option value="MEDIUM" className="bg-slate-900">Medium</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Physical Address / Directions</label>
            <input
              type="text"
              placeholder="e.g. Milimani, Kisumu near Kisumu Hotel"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Detailed Description</label>
            <textarea
              rows={4}
              required
              placeholder="Provide clear details about the work required, tools needed, and expectations..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-amber-500/20 text-sm disabled:opacity-50"
          >
            {loading ? 'Publishing Opportunity...' : 'Post Opportunity & Match Fundis'}
          </button>
        </form>
      </div>
    </div>
  );
};
