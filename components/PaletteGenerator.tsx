
import React, { useState } from 'react';
import { generatePalette } from '../services/geminiService';
import { Pipette, Loader2, Copy } from 'lucide-react';

const PaletteGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [palette, setPalette] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGen = async () => {
    if (!prompt) return;
    setLoading(true);
    try {
      const res = await generatePalette(prompt);
      setPalette(res);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Color Palette Generator</h2>
        <p className="text-slate-400">Extract beautiful color schemes from moods or themes.</p>
      </div>
      <div className="flex gap-2">
        <input value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder="e.g. 80s Synthwave, Ocean Breeze, Autumn Forest" className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500" />
        <button onClick={handleGen} disabled={loading} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 rounded-xl font-medium">
          {loading ? <Loader2 className="animate-spin" /> : <Pipette />}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 h-64 mt-8">
        {palette.length > 0 ? (
          palette.map((color, idx) => (
            <div key={idx} className="h-full rounded-2xl flex flex-col justify-end p-4 relative group transition-transform hover:scale-105" style={{ backgroundColor: color.color }}>
              <div className="bg-black/20 backdrop-blur-sm p-3 rounded-xl">
                 <p className="text-white font-bold font-mono uppercase text-sm mb-1">{color.color}</p>
                 <p className="text-white/80 text-xs">{color.name}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full border border-slate-800 border-dashed rounded-2xl flex items-center justify-center text-slate-600">
            Colors will appear here
          </div>
        )}
      </div>
    </div>
  );
};
export default PaletteGenerator;
