
import React, { useState, useRef } from 'react';
import { changeBackground } from '../services/geminiService';
import { ImageMinus, Upload, Loader2, Download } from 'lucide-react';

const BackgroundChanger: React.FC = () => {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSourceImage(reader.result as string);
        setResultImage(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProcess = async () => {
    if (!sourceImage || !prompt.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const url = await changeBackground(sourceImage, prompt);
      setResultImage(url);
    } catch (err: any) {
      setError(err.message || "Failed to change background.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-white">Background Changer</h2>
        <p className="text-slate-400">Keep the subject, change the world behind them.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
           <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-slate-700 hover:border-indigo-500 bg-slate-900/30 rounded-2xl h-64 flex flex-col items-center justify-center cursor-pointer relative overflow-hidden">
             {sourceImage ? <img src={sourceImage} className="w-full h-full object-contain" /> : <div className="text-center"><Upload className="mx-auto mb-2 text-indigo-400" /><p>Upload Image</p></div>}
             <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
           </div>
           
           <div className="flex gap-2">
             <input type="text" value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="New background (e.g., white studio, beach)..." className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
             <button onClick={handleProcess} disabled={loading || !sourceImage || !prompt} className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-6 rounded-xl font-medium transition-colors">
               {loading ? <Loader2 className="animate-spin" /> : <ImageMinus />}
             </button>
           </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl h-64 md:h-auto flex items-center justify-center relative">
          {resultImage ? (
            <>
              <img src={resultImage} className="max-w-full max-h-full object-contain" />
              <a href={resultImage} download="bg-change.png" className="absolute bottom-4 right-4 bg-indigo-600 p-2 rounded-lg text-white"><Download size={20} /></a>
            </>
          ) : (
            <p className="text-slate-600">Result will appear here</p>
          )}
        </div>
      </div>
      {error && <div className="text-red-400 text-center bg-red-900/20 p-3 rounded-lg">{error}</div>}
    </div>
  );
};
export default BackgroundChanger;
