
import React, { useState } from 'react';
import { writeCreative } from '../services/geminiService';
import { PenTool, BookOpen, Loader2 } from 'lucide-react';

const StoryWriter: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [type, setType] = useState('Short Story');
  const [story, setStory] = useState('');
  const [loading, setLoading] = useState(false);

  const handleWrite = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const res = await writeCreative(topic, type);
      setStory(res);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Creative Writer</h2>
        <p className="text-slate-400">Generate stories, poems, scripts, and lyrics.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-4">
        <select value={type} onChange={(e) => setType(e.target.value)} className="bg-slate-800 text-white p-3 rounded-lg border border-slate-700 outline-none">
          {['Short Story', 'Poem', 'Song Lyrics', 'Movie Script', 'Email', 'Blog Post'].map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="What should I write about?" className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 text-white focus:outline-none focus:border-indigo-500" />
        <button onClick={handleWrite} disabled={loading || !topic} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg font-medium">
          {loading ? <Loader2 className="animate-spin" /> : 'Write'}
        </button>
      </div>

      {story && (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-8 min-h-[300px] shadow-inner">
          <div className="whitespace-pre-wrap text-slate-300 leading-relaxed font-serif text-lg">
            {story}
          </div>
        </div>
      )}
    </div>
  );
};
export default StoryWriter;
