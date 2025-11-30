
import React, { useState, useRef } from 'react';
import { redesignRoom } from '../services/geminiService';
import { Sofa, Upload, Loader2, Download } from 'lucide-react';

const InteriorDesign: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [style, setStyle] = useState('Modern Minimalist');
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      const r = new FileReader();
      r.onload = () => setImage(r.result as string);
      r.readAsDataURL(f);
    }
  };

  const handleGen = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const url = await redesignRoom(image, style);
      setResult(url);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Interior Designer</h2>
        <p className="text-slate-400">Re-imagine your room in any style.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
           <div onClick={() => fileRef.current?.click()} className="border-2 border-dashed border-slate-700 bg-slate-900/30 rounded-2xl h-64 flex flex-col items-center justify-center cursor-pointer relative overflow-hidden">
             {image ? <img src={image} className="w-full h-full object-contain" /> : <div className="text-center"><Upload className="mx-auto mb-2 text-indigo-400" /><p>Upload Room Photo</p></div>}
             <input type="file" ref={fileRef} onChange={handleFile} accept="image/*" className="hidden" />
           </div>
           
           <div className="flex gap-2">
             <input value={style} onChange={e=>setStyle(e.target.value)} placeholder="Style (e.g. Industrial, Boho)" className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white" />
             <button onClick={handleGen} disabled={loading || !image} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 rounded-xl">
               {loading ? <Loader2 className="animate-spin" /> : <Sofa />}
             </button>
           </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl h-64 md:h-auto flex items-center justify-center relative min-h-[300px]">
          {result ? (
            <>
              <img src={result} className="max-w-full max-h-full object-contain" />
              <a href={result} download="interior.png" className="absolute bottom-4 right-4 bg-indigo-600 p-2 rounded-lg text-white"><Download size={20} /></a>
            </>
          ) : (
            <p className="text-slate-600">Redesign preview</p>
          )}
        </div>
      </div>
    </div>
  );
};
export default InteriorDesign;
