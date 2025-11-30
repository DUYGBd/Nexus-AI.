
import React, { useState } from 'react';
import { summarizeContent } from '../services/geminiService';
import { FileText, AlignLeft, Loader2 } from 'lucide-react';

const Summarizer: React.FC = () => {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await summarizeContent(text);
      setSummary(res);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Content Summarizer</h2>
        <p className="text-slate-400">Turn long articles into quick insights.</p>
      </div>

      <div className="space-y-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste article or text here..."
          className="w-full h-40 bg-slate-900 border border-slate-800 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button onClick={handleSummarize} disabled={loading || !text} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2">
          {loading ? <Loader2 className="animate-spin" /> : <AlignLeft />} Summarize
        </button>
      </div>

      {summary && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><FileText size={18}/> Key Takeaways</h3>
          <div className="prose prose-invert prose-sm max-w-none text-slate-300 whitespace-pre-wrap">
            {summary}
          </div>
        </div>
      )}
    </div>
  );
};
export default Summarizer;
