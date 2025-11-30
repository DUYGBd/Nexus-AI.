
import React, { useState, useRef } from 'react';
import { generateRecipe } from '../services/geminiService';
import { ChefHat, Upload, Loader2, Utensils } from 'lucide-react';

const AiChef: React.FC = () => {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [recipe, setRecipe] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSourceImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!sourceImage) return;
    setLoading(true);
    try {
      const res = await generateRecipe(sourceImage);
      setRecipe(res);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">AI Chef</h2>
        <p className="text-slate-400">Snap a photo of ingredients or a dish to get the recipe.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
           <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-slate-700 bg-slate-900/30 rounded-2xl h-80 flex flex-col items-center justify-center cursor-pointer relative overflow-hidden hover:border-emerald-500 transition-colors">
             {sourceImage ? <img src={sourceImage} className="w-full h-full object-contain" /> : <div className="text-center"><Upload className="mx-auto mb-2 text-emerald-500" /><p>Upload Food/Ingredients</p></div>}
             <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
           </div>
           
           <button onClick={handleGenerate} disabled={loading || !sourceImage} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2">
             {loading ? <Loader2 className="animate-spin" /> : <Utensils />} Get Recipe
           </button>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 overflow-y-auto max-h-[600px] custom-scrollbar">
          <div className="text-slate-300 whitespace-pre-wrap leading-relaxed">
            {recipe || <span className="text-slate-600 italic">Recipe details will appear here...</span>}
          </div>
        </div>
      </div>
    </div>
  );
};
export default AiChef;
