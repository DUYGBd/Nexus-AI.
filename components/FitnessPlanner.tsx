
import React, { useState } from 'react';
import { planWorkout } from '../services/geminiService';
import { Dumbbell, Loader2, Activity } from 'lucide-react';

const FitnessPlanner: React.FC = () => {
  const [goal, setGoal] = useState('Muscle Gain');
  const [level, setLevel] = useState('Beginner');
  const [equip, setEquip] = useState('Gym');
  const [plan, setPlan] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGen = async () => {
    setLoading(true);
    try {
      const res = await planWorkout(goal, level, equip);
      setPlan(res);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Fitness Planner</h2>
        <p className="text-slate-400">Personalized workout routines for any goal.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div className="space-y-1">
           <label className="text-xs text-slate-500">Goal</label>
           <select value={goal} onChange={e=>setGoal(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white">
             {['Muscle Gain', 'Weight Loss', 'Endurance', 'Flexibility'].map(o=><option key={o} value={o}>{o}</option>)}
           </select>
        </div>
        <div className="space-y-1">
           <label className="text-xs text-slate-500">Level</label>
           <select value={level} onChange={e=>setLevel(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white">
             {['Beginner', 'Intermediate', 'Advanced'].map(o=><option key={o} value={o}>{o}</option>)}
           </select>
        </div>
        <div className="space-y-1">
           <label className="text-xs text-slate-500">Equipment</label>
           <select value={equip} onChange={e=>setEquip(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white">
             {['Gym', 'Dumbbells Only', 'Bodyweight', 'Home Gym'].map(o=><option key={o} value={o}>{o}</option>)}
           </select>
        </div>
        <button onClick={handleGen} disabled={loading} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2">
          {loading ? <Loader2 className="animate-spin" size={18} /> : <Activity size={18} />} Generate
        </button>
      </div>

      {plan && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="whitespace-pre-wrap text-slate-300 leading-relaxed font-mono text-sm">
            {plan}
          </div>
        </div>
      )}
    </div>
  );
};
export default FitnessPlanner;
