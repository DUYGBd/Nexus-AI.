
import React, { useState, useRef } from 'react';
import { enhanceImageQuality } from '../services/geminiService';
import { Zap, Upload, Loader2, Download, Image as ImageIcon, Sparkles } from 'lucide-react';

const ImageEnhancer: React.FC = () => {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
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

  const handleEnhance = async () => {
    if (!sourceImage) return;
    setLoading(true);
    setError(null);

    try {
      const url = await enhanceImageQuality(sourceImage);
      setResultImage(url);
    } catch (err: any) {
      setError(err.message || "Failed to enhance image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-white">AI Quality Enhancer</h2>
        <p className="text-slate-400">
          Transform blurry, low-res, or old photos into crisp, high-definition masterpieces.
        </p>
      </div>

      {!sourceImage ? (
         <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-700 hover:border-indigo-500 bg-slate-900/30 hover:bg-slate-800/50 rounded-2xl h-80 flex flex-col items-center justify-center cursor-pointer transition-all group max-w-2xl mx-auto"
        >
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Upload size={32} className="text-emerald-400" />
          </div>
          <p className="font-semibold text-lg text-slate-200">Upload Image to Enhance</p>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Before */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Original</span>
              <button 
                onClick={() => { setSourceImage(null); setResultImage(null); }} 
                className="text-xs text-slate-500 hover:text-white"
              >
                Remove
              </button>
            </div>
            <div className="relative aspect-[4/3] bg-slate-900 rounded-2xl overflow-hidden border border-slate-800">
              <img src={sourceImage} alt="Original" className="w-full h-full object-contain" />
            </div>
            
            <button
              onClick={handleEnhance}
              disabled={loading || !!resultImage}
              className={`
                w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all
                ${loading 
                  ? 'bg-slate-800 cursor-not-allowed' 
                  : resultImage
                    ? 'bg-emerald-600/20 text-emerald-400 cursor-default border border-emerald-500/30'
                    : 'bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-500/20 hover:scale-[1.02]'}
              `}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" /> Enhancing...
                </>
              ) : resultImage ? (
                <>
                  <Sparkles size={20} /> Enhanced
                </>
              ) : (
                <>
                  <Zap size={20} fill="currentColor" /> Enhance Quality
                </>
              )}
            </button>
          </div>

          {/* After */}
          <div className="space-y-4">
             <div className="flex items-center justify-between px-2">
              <span className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">Enhanced Result</span>
              {resultImage && (
                <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  HD Ready
                </span>
              )}
            </div>
            <div className="relative aspect-[4/3] bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center">
              {loading ? (
                <div className="text-center">
                   <div className="relative w-16 h-16 mx-auto mb-4">
                     <div className="absolute inset-0 border-4 border-slate-700 rounded-full"></div>
                     <div className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
                   </div>
                   <p className="text-slate-400 animate-pulse">Upscaling resolution...</p>
                </div>
              ) : resultImage ? (
                <img src={resultImage} alt="Enhanced" className="w-full h-full object-contain" />
              ) : (
                <div className="text-center text-slate-600 p-8">
                  <ImageIcon size={48} className="mx-auto mb-3 opacity-20" />
                  <p>Enhancement result will appear here</p>
                </div>
              )}
            </div>

            {resultImage && (
              <a 
                href={resultImage}
                download="nexus-enhanced.png"
                className="block w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold text-center transition-colors flex items-center justify-center gap-2"
              >
                <Download size={18} /> Download Enhanced Image
              </a>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-center">
          {error}
        </div>
      )}
    </div>
  );
};

export default ImageEnhancer;
