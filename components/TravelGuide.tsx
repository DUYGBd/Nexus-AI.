
import React, { useState } from 'react';
import { planTrip } from '../services/geminiService';
import { Map, Loader2, Plane } from 'lucide-react';

const TravelGuide: React.FC = () => {
  const [dest, setDest] = useState('');
  const [days, setDays] = useState('3');
  const [interests, setInterests] = useState('');
  const [plan, setPlan] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGen = async () => {
    if (!dest) return;
    setLoading(true);
    try {
      const res = await planTrip(dest, days, interests);
      setPlan(res);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Travel Guide</h2>
        <p className="text-slate-400">Custom itineraries for your next adventure.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 space-y-1 w-full">
           <label className="text-xs text-slate-500">Destination</label>
           <input value={dest} onChange={e=>setDest(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white" placeholder="Tokyo, Paris..." />
        </div>
        <div className="w-24 space-y-1">
           <label className="text-xs text-slate-500">Days</label>
           <input type="number" value={days} onChange={e=>setDays(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white" />
        </div>
        <div className="flex-1 space-y-1 w-full">
           <label className="text-xs text-slate-500">Interests</label>
           <input value={interests} onChange={e=>setInterests(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white" placeholder="Food, History, Art..." />
        </div>
        <button onClick={handleGen} disabled={loading || !dest} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2">
          {loading ? <Loader2 className="animate-spin" size={18} /> : <Plane size={18} />} Plan
        </button>
      </div>

      {plan && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="prose prose-invert max-w-none prose-sm whitespace-pre-wrap text-slate-300">
            {plan}
          </div>
        </div>
      )}
    </div>
  );
};
export default TravelGuide;
