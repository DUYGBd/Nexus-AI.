
import React, { useState } from 'react';
import { generateInterviewQuestion } from '../services/geminiService';
import { Briefcase, Loader2, RefreshCw } from 'lucide-react';

const InterviewCoach: React.FC = () => {
  const [role, setRole] = useState('');
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGen = async () => {
    if (!role) return;
    setLoading(true);
    try {
      const res = await generateInterviewQuestion(role);
      setQuestion(res);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Interview Coach</h2>
        <p className="text-slate-400">Practice with role-specific interview questions.</p>
      </div>

      <div className="flex gap-2">
        <input value={role} onChange={e=>setRole(e.target.value)} placeholder="Target Role (e.g. Product Manager, Nurse)" className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500" />
        <button onClick={handleGen} disabled={loading} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 rounded-xl font-medium">
          {loading ? <Loader2 className="animate-spin" /> : <Briefcase />}
        </button>
      </div>

      {question && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 relative">
          <p className="text-xl text-white font-medium text-center leading-relaxed">"{question}"</p>
          <div className="mt-8 flex justify-center">
             <button onClick={handleGen} className="text-slate-400 hover:text-white flex items-center gap-2 text-sm">
               <RefreshCw size={16}/> New Question
             </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default InterviewCoach;
