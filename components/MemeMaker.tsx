
import React, { useState } from 'react';
import { generateMeme } from '../services/geminiService';
import { SmilePlus, Loader2, Download } from 'lucide-react';

const MemeMaker: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [memeUrl, setMemeUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const res = await generateMeme(topic);
      setMemeUrl(res);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Meme Maker</h2>
        <p className="text-slate-400">Instant AI humor generator.</p>
      </div>

      <div className="flex gap-2">
        <input 
          type="text" 
          value={topic} 
          onChange={(e) => setTopic(e.target.value)} 
          placeholder="Topic (e.g. programmers trying to fix a bug, cats)" 
          className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500"
        />
        <button onClick={handleGenerate} disabled={loading || !topic} className="bg-yellow-600 hover:bg-yellow-500 text-white px-6 rounded-xl font-medium">
          {loading ? <Loader2 className="animate-spin" /> : <SmilePlus />}
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 min-h-[400px] flex items-center justify-center relative">
        {memeUrl ? (
          <>
             <img src={memeUrl} alt="Generated Meme" className="max-w-full max-h-[500px] rounded-lg shadow-lg" />
             <a href={memeUrl} download="meme.png" className="absolute bottom-6 right-6 bg-yellow-600 p-2 rounded-lg text-white shadow-lg hover:scale-105 transition-transform"><Download size={20} /></a>
          </>
        ) : (
          <p className="text-slate-600">Your meme will appear here</p>
        )}
      </div>
    </div>
  );
};
export default MemeMaker;
