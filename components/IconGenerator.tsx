
import React, { useState } from 'react';
import { generateIcon } from '../services/geminiService';
import { AppWindow, Loader2, Download } from 'lucide-react';

const IconGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGen = async () => {
    if (!prompt) return;
    setLoading(true);
    try {
      const url = await generateIcon(prompt);
      setImage(url);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">App Icon Generator</h2>
        <p className="text-slate-400">Professional, vector-style icons for your apps.</p>
      </div>
      <div className="flex gap-2">
        <input value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder="e.g. A fast rocket ship" className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500" />
        <button onClick={handleGen} disabled={loading} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 rounded-xl font-medium">
          {loading ? <Loader2 className="animate-spin" /> : <AppWindow />}
        </button>
      </div>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 flex items-center justify-center min-h-[300px]">
        {image ? (
          <div className="relative group">
            <img src={image} className="w-48 h-48 rounded-3xl shadow-2xl" />
            <a href={image} download="icon.png" className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-indigo-400 hover:text-white flex items-center gap-2"><Download size={16}/> Download</a>
          </div>
        ) : <p className="text-slate-600">Icon preview</p>}
      </div>
    </div>
  );
};
export default IconGenerator;
