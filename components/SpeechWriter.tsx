
import React, { useState } from 'react';
import { writeSpeech } from '../services/geminiService';
import { Mic2, Loader2, FileText } from 'lucide-react';

const SpeechWriter: React.FC = () => {
  const [occasion, setOccasion] = useState('');
  const [audience, setAudience] = useState('');
  const [tone, setTone] = useState('Inspirational');
  const [speech, setSpeech] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGen = async () => {
    if (!occasion) return;
    setLoading(true);
    try {
      const res = await writeSpeech(occasion, audience, tone);
      setSpeech(res);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Speech Writer</h2>
        <p className="text-slate-400">Craft memorable speeches for any occasion.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1">
           <label className="text-xs text-slate-500">Occasion</label>
           <input value={occasion} onChange={e=>setOccasion(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white" placeholder="Wedding, Graduation..." />
        </div>
        <div className="space-y-1">
           <label className="text-xs text-slate-500">Audience</label>
           <input value={audience} onChange={e=>setAudience(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white" placeholder="Family, Colleagues..." />
        </div>
        <div className="space-y-1">
           <label className="text-xs text-slate-500">Tone</label>
           <select value={tone} onChange={e=>setTone(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white">
             {['Inspirational', 'Humorous', 'Formal', 'Emotional'].map(o=><option key={o} value={o}>{o}</option>)}
           </select>
        </div>
      </div>
      
      <button onClick={handleGen} disabled={loading || !occasion} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2">
        {loading ? <Loader2 className="animate-spin" /> : <Mic2 />} Write Speech
      </button>

      {speech && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-lg">
          <div className="whitespace-pre-wrap text-slate-300 leading-relaxed font-serif text-lg">
            {speech}
          </div>
        </div>
      )}
    </div>
  );
};
export default SpeechWriter;
