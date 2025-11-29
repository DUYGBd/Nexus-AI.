import React, { useState, useRef } from 'react';
import { analyzeImage } from '../services/geminiService';
import { Eye, Upload, Loader2, Copy, Check } from 'lucide-react';

const VisionTool: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSourceImage(reader.result as string);
        setAnalysis('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!sourceImage) return;

    setLoading(true);
    setAnalysis('');

    try {
      const result = await analyzeImage(sourceImage, prompt);
      setAnalysis(result);
    } catch (err) {
      setAnalysis("Error analyzing image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(analysis);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-white">Visual Intelligence</h2>
        <p className="text-slate-400">
          Upload an image to detect objects, read text, or get detailed descriptions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
           <div 
            onClick={() => fileInputRef.current?.click()}
            className={`
              border-2 border-dashed rounded-2xl h-64 flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden relative
              ${sourceImage 
                ? 'border-indigo-500/50 bg-slate-900/50' 
                : 'border-slate-700 hover:border-indigo-500 hover:bg-slate-800/50 bg-slate-900/30'}
            `}
          >
            {sourceImage ? (
              <img src={sourceImage} alt="Source" className="h-full w-full object-contain" />
            ) : (
              <div className="text-center p-6">
                <Upload size={32} className="mx-auto mb-4 text-indigo-400" />
                <p className="font-medium text-slate-300">Upload Image</p>
              </div>
            )}
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
          </div>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask a question about the image (optional)..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none"
          />

          <button
            onClick={handleAnalyze}
            disabled={loading || !sourceImage}
            className={`
              w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all
              ${loading || !sourceImage 
                ? 'bg-slate-800 cursor-not-allowed text-slate-500' 
                : 'bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/20'}
            `}
          >
            {loading ? <Loader2 className="animate-spin" /> : <Eye size={20} />}
            {loading ? 'Analyzing...' : 'Analyze Image'}
          </button>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 min-h-[400px] flex flex-col">
          <div className="flex items-center justify-between mb-4">
             <h3 className="font-semibold text-slate-200">Analysis Result</h3>
             {analysis && (
               <button onClick={copyToClipboard} className="text-slate-500 hover:text-white transition-colors">
                 {copied ? <Check size={18} /> : <Copy size={18} />}
               </button>
             )}
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {loading ? (
              <div className="space-y-3 animate-pulse">
                <div className="h-4 bg-slate-800 rounded w-3/4"></div>
                <div className="h-4 bg-slate-800 rounded w-1/2"></div>
                <div className="h-4 bg-slate-800 rounded w-5/6"></div>
              </div>
            ) : analysis ? (
              <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{analysis}</p>
            ) : (
              <p className="text-slate-600 text-sm italic">Analysis output will appear here...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisionTool;
