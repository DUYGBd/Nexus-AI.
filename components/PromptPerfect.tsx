
import React, { useState } from 'react';
import { enhancePrompt } from '../services/geminiService';
import { Sparkles, Loader2, ArrowRight } from 'lucide-react';

const PromptPerfect: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGen = async () => {
    if (!input) return;
    setLoading(true);
    try {
      const res = await enhancePrompt(input);
      setOutput(res);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Prompt Perfect</h2>
        <p className="text-slate-400">Turn simple ideas into master-level AI prompts.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
         <div className="space-y-2">
           <label className="text-sm text-slate-500 font-medium">Your Idea</label>
           <textarea value={input} onChange={e=>setInput(e.target.value)} placeholder="e.g. A cat in space" className="w-full h-64 bg-slate-900 border border-slate-700 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
         </div>
         
         <div className="flex justify-center md:rotate-0 rotate-90">
            <button onClick={handleGen} disabled={loading || !input} className="bg-indigo-600 p-4 rounded-full text-white shadow-xl hover:bg-indigo-500 transition-transform hover:scale-110">
              {loading ? <Loader2 className="animate-spin" /> : <ArrowRight />}
            </button>
         </div>

         <div className="space-y-2">
           <label className="text-sm text-indigo-400 font-medium flex items-center gap-2"><Sparkles size={14}/> Optimized Prompt</label>
           <div className="w-full h-64 bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-300 overflow-y-auto custom-scrollbar">
             {output || "Result will appear here..."}
           </div>
         </div>
      </div>
    </div>
  );
};
export default PromptPerfect;
