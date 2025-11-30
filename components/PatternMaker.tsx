
import React, { useState } from 'react';
import { generatePattern } from '../services/geminiService';
import { Grid3X3, Loader2, Download } from 'lucide-react';

const PatternMaker: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGen = async () => {
    if (!prompt) return;
    setLoading(true);
    try {
      const url = await generatePattern(prompt);
      setImage(url);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Pattern Maker</h2>
        <p className="text-slate-400">Create seamless, tileable textures and backgrounds.</p>
      </div>
      <div className="flex gap-2">
        <input value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder="e.g. Japanese cherry blossoms, vintage floral" className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500" />
        <button onClick={handleGen} disabled={loading} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 rounded-xl font-medium">
          {loading ? <Loader2 className="animate-spin" /> : <Grid3X3 />}
        </button>
      </div>
      
      {/* Tiled Preview */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl h-[400px] overflow-hidden relative">
        {image ? (
          <div 
            className="w-full h-full" 
            style={{ backgroundImage: `url(${image})`, backgroundRepeat: 'repeat', backgroundSize: '150px' }}
          >
             <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md p-2 rounded-lg text-white border border-white/10">
               <a href={image} download="pattern.png" className="flex items-center gap-2 text-sm"><Download size={16}/> Download Tile</a>
             </div>
          </div>
        ) : <div className="w-full h-full flex items-center justify-center text-slate-600">Pattern preview</div>}
      </div>
    </div>
  );
};
export default PatternMaker;
