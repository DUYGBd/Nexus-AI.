
import React, { useState } from 'react';
import { generateSticker } from '../services/geminiService';
import { Sticker, Loader2, Download } from 'lucide-react';

const StickerMaker: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGen = async () => {
    if (!prompt) return;
    setLoading(true);
    try {
      const url = await generateSticker(prompt);
      setImage(url);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Sticker Maker</h2>
        <p className="text-slate-400">Generate vibrant, die-cut style stickers.</p>
      </div>
      <div className="flex gap-2">
        <input value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder="e.g. A cute robot drinking coffee" className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500" />
        <button onClick={handleGen} disabled={loading} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 rounded-xl font-medium">
          {loading ? <Loader2 className="animate-spin" /> : <Sticker />}
        </button>
      </div>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 flex items-center justify-center min-h-[300px]">
        {image ? (
          <div className="relative">
            <img src={image} className="max-w-[300px] drop-shadow-2xl" />
            <a href={image} download="sticker.png" className="absolute bottom-4 right-4 bg-slate-800 p-2 rounded-lg text-white"><Download size={20}/></a>
          </div>
        ) : <p className="text-slate-600">Sticker preview</p>}
      </div>
    </div>
  );
};
export default StickerMaker;
