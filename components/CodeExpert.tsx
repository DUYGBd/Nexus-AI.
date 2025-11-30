
import React, { useState } from 'react';
import { generateCode } from '../services/geminiService';
import { Code2, Play, Copy, Check, Loader2 } from 'lucide-react';

const CodeExpert: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const result = await generateCode(prompt);
      setCode(result);
    } catch (e) {
      setCode("Error generating code.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Code Expert</h2>
        <p className="text-slate-400">Generate, debug, or explain code in any language.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., Write a React component for a carousel..."
          className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 h-32"
        />
        <div className="mt-4 flex justify-end">
          <button onClick={handleGenerate} disabled={loading || !prompt} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2">
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Play size={18} />} Generate
          </button>
        </div>
      </div>

      {code && (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="bg-slate-900 p-3 flex justify-between items-center border-b border-slate-800">
            <span className="text-xs text-slate-400 font-mono">Output</span>
            <button onClick={copyToClipboard} className="text-slate-400 hover:text-white transition-colors">
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
          <pre className="p-4 overflow-x-auto text-sm text-slate-300 font-mono leading-relaxed custom-scrollbar">
            {code}
          </pre>
        </div>
      )}
    </div>
  );
};
export default CodeExpert;
