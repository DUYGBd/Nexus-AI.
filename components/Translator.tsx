
import React, { useState } from 'react';
import { translateText } from '../services/geminiService';
import { Languages, ArrowRightLeft, Loader2 } from 'lucide-react';

const Translator: React.FC = () => {
  const [text, setText] = useState('');
  const [targetLang, setTargetLang] = useState('Spanish');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTranslate = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await translateText(text, targetLang);
      setResult(res);
    } catch (e) {
      setResult("Error translating.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Universal Translator</h2>
        <p className="text-slate-400">Context-aware translation for any language.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 w-full">
           <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter text to translate..." className="w-full h-48 bg-slate-900 border border-slate-800 rounded-xl p-4 text-white resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        
        <div className="flex flex-col items-center gap-4">
          <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)} className="bg-slate-800 text-white p-2 rounded-lg border border-slate-700 outline-none">
            {['Spanish', 'French', 'German', 'Japanese', 'Chinese', 'Russian', 'Italian', 'Portuguese', 'Korean', 'Hindi'].map(l => <option key={l} value={l}>{l}</option>)}
          </select>
          <button onClick={handleTranslate} disabled={loading || !text} className="bg-indigo-600 p-3 rounded-full text-white hover:bg-indigo-500 disabled:opacity-50 transition-colors">
            {loading ? <Loader2 className="animate-spin" /> : <ArrowRightLeft />}
          </button>
        </div>

        <div className="flex-1 w-full">
          <div className="w-full h-48 bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-300 overflow-y-auto">
            {result || <span className="text-slate-600 italic">Translation appears here...</span>}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Translator;
