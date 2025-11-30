
import React, { useState, useRef } from 'react';
import { generateSocialCaptions } from '../services/geminiService';
import { Hash, Upload, Loader2, Copy } from 'lucide-react';

const SocialAssistant: React.FC = () => {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [platform, setPlatform] = useState('Instagram');
  const [captions, setCaptions] = useState('');
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
      const res = await generateSocialCaptions(sourceImage, platform);
      setCaptions(res);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Social Assistant</h2>
        <p className="text-slate-400">Viral captions and hashtags from your photos.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
           <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-slate-700 bg-slate-900/30 rounded-2xl h-80 flex flex-col items-center justify-center cursor-pointer relative overflow-hidden">
             {sourceImage ? <img src={sourceImage} className="w-full h-full object-contain" /> : <div className="text-center"><Upload className="mx-auto mb-2" /><p>Upload Photo</p></div>}
             <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
           </div>
           
           <div className="flex gap-2">
             <select value={platform} onChange={e => setPlatform(e.target.value)} className="flex-1 bg-slate-800 text-white p-3 rounded-xl border border-slate-700">
               {['Instagram', 'Twitter/X', 'LinkedIn', 'TikTok', 'Facebook'].map(p => <option key={p} value={p}>{p}</option>)}
             </select>
             <button onClick={handleGenerate} disabled={loading || !sourceImage} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 rounded-xl">
               {loading ? <Loader2 className="animate-spin" /> : <Hash />}
             </button>
           </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="font-semibold text-white mb-4">Generated Captions</h3>
          <div className="text-slate-300 whitespace-pre-wrap leading-relaxed">
            {captions || <span className="text-slate-600 italic">Captions will appear here...</span>}
          </div>
        </div>
      </div>
    </div>
  );
};
export default SocialAssistant;
