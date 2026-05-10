import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { quizService } from '../services/quizService';
import { Subject, Question } from '../types';
import { Play, Plus, BookOpen, ChevronLeft, Flag, Edit2, Info } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

import { useAdmin } from '../context/AdminContext';

export default function SubjectDetail() {
  const { isAdminUI } = useAdmin();
  const { id } = useParams<{ id: string }>();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [flaggedIds, setFlaggedIds] = useState<string[]>([]);

  useEffect(() => {
    if (id) {
      loadData(id);
      const saved = localStorage.getItem('flagged_' + id);
      if (saved) setFlaggedIds(JSON.parse(saved));
    }
  }, [id]);

  const loadData = async (subjectId: string) => {
    const [subData, questData] = await Promise.all([
      quizService.getSubjects().then(list => list.find(s => s.id === subjectId) || null),
      quizService.getQuestions(subjectId)
    ]);
    setSubject(subData);
    setQuestions(questData);
    setLoading(false);
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  if (!subject) return <div className="text-center py-20">Subject not found</div>;

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <Link to="/" className="flex items-center gap-2 text-sm font-black uppercase text-gray-500 hover:text-black transition-colors mb-4 group">
            <div className="bg-white border-2 border-black p-1 rounded group-hover:bg-[#FFE66D] transition-all">
              <ChevronLeft size={16} strokeWidth={3} />
            </div>
            Back to Library
          </Link>
          <h1 className="text-5xl font-black text-[#1A1A1A] uppercase tracking-tighter">{subject.name}</h1>
          <div className="flex items-center gap-4">
            <p className="text-sm font-black uppercase bg-[#4ECDC4] px-3 py-1 border-2 border-black rounded-full flex items-center gap-2 shadow-[2px_2px_0px_0px_#000]">
              <BookOpen size={14} /> {questions.length} Questions
            </p>
            <p className="text-sm font-black uppercase bg-[#FFE66D] px-3 py-1 border-2 border-black rounded-full flex items-center gap-2 shadow-[2px_2px_0px_0px_#000]">
              <Flag size={14} /> {flaggedIds.length} Flagged
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          {isAdminUI && (
            <Link 
              to={`/add/${id}`}
              className="flex items-center gap-2 px-6 py-3 bg-white border-4 border-black rounded-xl hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all font-black uppercase text-sm neo-brutal-shadow"
            >
              <Plus size={20} strokeWidth={3} />
              Add New
            </Link>
          )}
          <Link 
            to={`/quiz/${id}`}
            disabled={questions.length === 0}
            className={cn(
              "flex items-center gap-2 px-8 py-3 bg-[#FF6B6B] text-white border-4 border-black rounded-xl hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all font-black uppercase text-sm neo-brutal-shadow-teal",
              questions.length === 0 && "opacity-50 cursor-not-allowed pointer-events-none grayscale"
            )}
          >
            <Play size={20} fill="currentColor" />
            Start Quiz
          </Link>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-black uppercase tracking-tighter border-b-4 border-black pb-2 inline-block">Curriculum</h2>

        {questions.length > 0 ? (
          <div className="grid gap-6">
            {questions.map((q, index) => (
              <motion.div 
                key={q.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "bg-white p-8 rounded-[32px] border-4 border-black transition-all",
                  flaggedIds.includes(q.id) ? "neo-brutal-shadow-red bg-[#FFF5F5]" : "neo-brutal-shadow hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
                )}
              >
                <div className="flex flex-col md:flex-row items-start justify-between gap-6">
                  <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black bg-black text-white px-3 py-1 rounded-full uppercase tracking-tighter leading-none">
                        Case {index + 1}
                      </span>
                      {flaggedIds.includes(q.id) && (
                        <span className="text-xs font-black text-[#FF6B6B] bg-white border-2 border-[#FF6B6B] px-3 py-1 rounded-full uppercase tracking-tighter leading-none flex items-center gap-1">
                          <Flag size={12} fill="currentColor" /> flagged
                        </span>
                      )}
                    </div>
                    <p className="text-xl font-bold text-black leading-tight tracking-tight">{q.questionText}</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(['A', 'B', 'C', 'D'] as const).map(opt => (
                        <div 
                          key={opt} 
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-xl border-2 transition-all font-bold text-sm",
                            q.correctAnswer === opt ? "bg-[#4ECDC4]/20 border-[#4ECDC4] text-black" : "bg-gray-50 border-transparent text-gray-400"
                          )}
                        >
                          <span className={cn(
                            "shrink-0 w-6 h-6 flex items-center justify-center rounded border-2 text-[10px] uppercase font-black",
                            q.correctAnswer === opt ? "border-[#4ECDC4] bg-[#4ECDC4] text-white" : "border-gray-300"
                          )}>
                            {opt}
                          </span>
                          <span className="truncate">{q[`option${opt}` as keyof Question]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {isAdminUI && (
                    <div className="flex md:flex-col gap-3">
                      <Link 
                        to={`/edit/${id}/${q.id}`}
                        className="bg-white border-2 border-black p-3 rounded-2xl hover:bg-[#FFE66D] transition-all shadow-[2px_2px_0px_0px_#000]"
                      >
                        <Edit2 size={20} strokeWidth={3} />
                      </Link>
                      <button className="bg-white border-2 border-black p-3 rounded-2xl hover:bg-gray-100 transition-all shadow-[2px_2px_0px_0px_#000]">
                        <Info size={20} strokeWidth={3} />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white border-4 border-black rounded-[40px] neo-brutal-shadow">
            <p className="text-gray-400 font-bold text-lg mb-6 tracking-tight">
              {isAdminUI ? "Your question bank is empty." : "No curriculum available yet."}
            </p>
            {isAdminUI && (
              <Link 
                to={`/add/${id}`} 
                className="bg-[#4ECDC4] border-4 border-black px-8 py-3 rounded-xl font-black uppercase text-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all neo-brutal-shadow"
              >
                Add first question
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
