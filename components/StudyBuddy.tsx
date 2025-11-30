
import React, { useState, useRef } from 'react';
import { solveHomework } from '../services/geminiService';
import { GraduationCap, Upload, Loader2, BookOpen } from 'lucide-react';

const StudyBuddy: React.FC = () => {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [question, setQuestion] = useState('');
  const [solution, setSolution] = useState('');
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

  const handleSolve = async () => {
    if (!sourceImage) return;
    setLoading(true);
    try {
      const res = await solveHomework(sourceImage, question);
      setSolution(res);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Study Buddy</h2>
        <p className="text-slate-400">Homework help, math solver, and step-by-step explanations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
           <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-slate-700 bg-slate-900/30 rounded-2xl h-64 flex flex-col items-center justify-center cursor-pointer relative overflow-hidden">
             {sourceImage ? <img src={sourceImage} className="w-full h-full object-contain" /> : <div className="text-center"><Upload className="mx-auto mb-2 text-blue-400" /><p>Upload Problem/Question</p></div>}
             <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
           </div>
           
           <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Specific question? (Optional)" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none" />

           <button onClick={handleSolve} disabled={loading || !sourceImage} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2">
             {loading ? <Loader2 className="animate-spin" /> : <GraduationCap />} Solve & Explain
           </button>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 overflow-y-auto max-h-[600px] custom-scrollbar">
          <div className="text-slate-300 whitespace-pre-wrap leading-relaxed">
            {solution || <span className="text-slate-600 italic">Step-by-step solution will appear here...</span>}
          </div>
        </div>
      </div>
    </div>
  );
};
export default StudyBuddy;
