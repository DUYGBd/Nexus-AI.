
import React, { useState, useRef } from 'react';
import { analyzeNutrition } from '../services/geminiService';
import { Apple, Upload, Loader2 } from 'lucide-react';

const Nutritionist: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState('');
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
      const res = await analyzeNutrition(image);
      setAnalysis(res);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">AI Nutritionist</h2>
        <p className="text-slate-400">Get calorie estimates and macro stats from food photos.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
           <div onClick={() => fileRef.current?.click()} className="border-2 border-dashed border-slate-700 bg-slate-900/30 rounded-2xl h-80 flex flex-col items-center justify-center cursor-pointer relative overflow-hidden hover:border-green-500 transition-colors">
             {image ? <img src={image} className="w-full h-full object-contain" /> : <div className="text-center"><Upload className="mx-auto mb-2 text-green-500" /><p>Upload Meal Photo</p></div>}
             <input type="file" ref={fileRef} onChange={handleFile} accept="image/*" className="hidden" />
           </div>
           
           <button onClick={handleGen} disabled={loading || !image} className="w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2">
             {loading ? <Loader2 className="animate-spin" /> : <Apple />} Analyze Meal
           </button>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 overflow-y-auto max-h-[600px] custom-scrollbar">
          <div className="text-slate-300 whitespace-pre-wrap leading-relaxed">
            {analysis || <span className="text-slate-600 italic">Nutritional info will appear here...</span>}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Nutritionist;
