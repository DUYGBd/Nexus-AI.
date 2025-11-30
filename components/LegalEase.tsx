
import React, { useState } from 'react';
import { simplifyLegal } from '../services/geminiService';
import { Scale, Loader2, FileText } from 'lucide-react';

const LegalEase: React.FC = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGen = async () => {
    if (!text) return;
    setLoading(true);
    try {
      const res = await simplifyLegal(text);
      setResult(res);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Legal Ease</h2>
        <p className="text-slate-400">Simplify complex contracts and legal jargon.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
           <label className="text-sm text-slate-500">Legal Text</label>
           <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Paste legal text here..." className="w-full h-80 bg-slate-900 border border-slate-700 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-xs font-mono" />
           <button onClick={handleGen} disabled={loading || !text} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2">
             {loading ? <Loader2 className="animate-spin" /> : <Scale />} Simplify
           </button>
        </div>
        <div className="space-y-2">
           <label className="text-sm text-emerald-400">Simplified Explanation</label>
           <div className="w-full h-80 bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-300 overflow-y-auto custom-scrollbar text-sm leading-relaxed">
             {result || "Explanation will appear here..."}
           </div>
        </div>
      </div>
    </div>
  );
};
export default LegalEase;
