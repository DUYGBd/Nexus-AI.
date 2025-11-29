import React, { useState } from 'react';
import { generateImage } from '../services/geminiService';
import { Sparkles, Download, Loader2 } from 'lucide-react';

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const url = await generateImage(prompt);
      setGeneratedImage(url);
    } catch (err: any) {
      setError(err.message || "Failed to generate image. Please try a different prompt.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-white">Imagine Anything</h2>
        <p className="text-slate-400 max-w-lg mx-auto">
          Turn your wildest ideas into reality with our powerful AI image generator. Just describe what you want to see.
        </p>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
        <form onSubmit={handleGenerate} className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A cyberpunk city floating in the clouds, neon lights, 4k..."
            className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-5 py-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !prompt}
            className={`
              px-8 py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all
              ${loading || !prompt 
                ? 'bg-slate-800 cursor-not-allowed text-slate-500' 
                : 'bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 active:scale-95'}
            `}
          >
            {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
            {loading ? 'Generating...' : 'Generate'}
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-center">
          {error}
        </div>
      )}

      {generatedImage && (
        <div className="animate-fade-in bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="relative aspect-square md:aspect-video w-full">
            <img 
              src={generatedImage} 
              alt="Generated Result" 
              className="w-full h-full object-contain bg-slate-950"
            />
          </div>
          <div className="p-4 flex items-center justify-between border-t border-slate-800 bg-slate-900/80 backdrop-blur-md">
            <p className="text-sm text-slate-400 truncate max-w-md">
              "{prompt}"
            </p>
            <a 
              href={generatedImage} 
              download={`nexus-ai-${Date.now()}.png`}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-white transition-colors"
            >
              <Download size={16} />
              Download
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGenerator;
