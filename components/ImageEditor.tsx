import React, { useState, useRef } from 'react';
import { editImage } from '../services/geminiService';
import { Wand2, Upload, Loader2, Download, ImagePlus, ZoomOut, Paintbrush } from 'lucide-react';

const ImageEditor: React.FC = () => {
  const [prompt, setPrompt] = useState('');
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

  const handleEdit = async () => {
    if (!prompt.trim() || !sourceImage) return;

    setLoading(true);
    setError(null);

    try {
      const url = await editImage(sourceImage, prompt);
      setResultImage(url);
    } catch (err: any) {
      setError(err.message || "Failed to edit image.");
    } finally {
      setLoading(false);
    }
  };

  const applyPreset = (presetText: string) => {
    setPrompt(presetText);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-white">Magic Editor</h2>
        <p className="text-slate-400">
          Upload an image and use AI to modify, extend, or completely remix it.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`
              border-2 border-dashed rounded-2xl h-80 flex flex-col items-center justify-center cursor-pointer transition-all
              ${sourceImage 
                ? 'border-indigo-500/50 bg-slate-900/50' 
                : 'border-slate-700 hover:border-indigo-500 hover:bg-slate-800/50 bg-slate-900/30'}
            `}
          >
            {sourceImage ? (
              <img src={sourceImage} alt="Source" className="h-full w-full object-contain rounded-xl" />
            ) : (
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-400">
                  <Upload size={32} />
                </div>
                <p className="font-medium text-slate-300">Click to upload image</p>
                <p className="text-sm text-slate-500 mt-2">PNG, JPG up to 5MB</p>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
          </div>

          <div className="space-y-4">
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              <button onClick={() => applyPreset("Zoom out and extend the background")} className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-full text-xs text-slate-300 transition-colors whitespace-nowrap">
                <ZoomOut size={14} /> Zoom Out / Extend
              </button>
              <button onClick={() => applyPreset("Turn this into a oil painting")} className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-full text-xs text-slate-300 transition-colors whitespace-nowrap">
                <Paintbrush size={14} /> Style Transfer
              </button>
              <button onClick={() => applyPreset("Add a futuristic neon city background")} className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-full text-xs text-slate-300 transition-colors whitespace-nowrap">
                <ImagePlus size={14} /> Change Background
              </button>
            </div>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe how to change the image (e.g., 'Add fireworks to the sky', 'Make it look like a sketch')..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none h-24"
            />

            <button
              onClick={handleEdit}
              disabled={loading || !sourceImage || !prompt}
              className={`
                w-full py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all
                ${loading || !sourceImage || !prompt 
                  ? 'bg-slate-800 cursor-not-allowed text-slate-500' 
                  : 'bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/20'}
              `}
            >
              {loading ? <Loader2 className="animate-spin" /> : <Wand2 size={20} />}
              {loading ? 'Processing Magic...' : 'Apply Magic Edit'}
            </button>
          </div>
        </div>

        {/* Output Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl h-full min-h-[400px] flex flex-col overflow-hidden relative">
          <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-xs font-medium text-white border border-white/10">
            Result
          </div>
          
          <div className="flex-1 flex items-center justify-center p-4 bg-slate-950/50">
            {loading ? (
              <div className="text-center">
                <Loader2 className="animate-spin mx-auto text-indigo-500 mb-4" size={40} />
                <p className="text-slate-400 animate-pulse">Generating pixels...</p>
              </div>
            ) : resultImage ? (
              <img src={resultImage} alt="Result" className="max-h-full max-w-full object-contain shadow-2xl rounded-lg" />
            ) : (
              <div className="text-slate-600 flex flex-col items-center">
                <Wand2 size={48} className="mb-4 opacity-20" />
                <p>Edit result will appear here</p>
              </div>
            )}
          </div>

          {resultImage && (
            <div className="p-4 border-t border-slate-800 bg-slate-900 flex justify-end">
               <a 
                href={resultImage} 
                download={`nexus-edit-${Date.now()}.png`}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm text-white transition-colors shadow-lg shadow-indigo-500/20"
              >
                <Download size={16} />
                Download Result
              </a>
            </div>
          )}
        </div>
      </div>
       {error && (
        <div className="mt-4 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-center">
          {error}
        </div>
      )}
    </div>
  );
};

export default ImageEditor;
