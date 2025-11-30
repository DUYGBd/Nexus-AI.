
import React, { useState } from 'react';
import { interpretDream } from '../services/geminiService';
import { CloudMoon, Loader2, Sparkles } from 'lucide-react';

const DreamWeaver: React.FC = () => {
  const [dream, setDream] = useState('');
  const [result, setResult] = useState<{interpretation: string, imageUrl: string} | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInterpret = async () => {
    if (!dream.trim()) return;
    setLoading(true);
    try {
      const res = await interpretDream(dream);
      setResult(res);
    } catch(e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Dream Weaver</h2>
        <p className="text-slate-400">Unlock the meaning of your dreams and see them visualized.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <textarea
          value={dream}
          onChange={(e) => setDream(e.target.value)}
          placeholder="Describe your dream in detail..."
          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white h-32 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button onClick={handleInterpret} disabled={loading || !dream} className="w-full bg-purple-600 hover:bg-purple-500 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2">
          {loading ? <Loader2 className="animate-spin" /> : <CloudMoon />} Interpret & Visualize
        </button>
      </div>

      {result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <img src={result.imageUrl} alt="Dream Visualization" className="w-full h-full object-cover" />
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-purple-400 mb-3 flex items-center gap-2"><Sparkles size={18} /> Interpretation</h3>
            <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{result.interpretation}</p>
          </div>
        </div>
      )}
    </div>
  );
};
export default DreamWeaver;
