import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { quizService } from '../services/quizService';
import { Subject, Question } from '../types';
import { Play, Plus, BookOpen, ChevronLeft, Flag, Edit2, Info, Pin } from 'lucide-react';
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

  const handleToggleNote = async (q: Question) => {
    try {
      await quizService.toggleNote(q.id, !q.isNoted);
      setQuestions(prev => prev.map(item => item.id === q.id ? { ...item, isNoted: !item.isNoted } : item));
    } catch (err) {
      console.error(err);
    }
  };

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
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <Link to="/" className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors mb-2 group">
            <div className="bg-[var(--card-bg)] border-2 border-black p-1 rounded group-hover:bg-[#FFE66D] transition-all">
              <ChevronLeft size={12} strokeWidth={3} />
            </div>
            Back to Library
          </Link>
          <h1 className="text-3xl font-black text-[var(--text-main)] uppercase tracking-tighter transition-colors">{subject.name}</h1>
          <div className="flex items-center gap-3">
            <p className="text-[10px] font-black uppercase bg-[#4ECDC4] px-3 py-0.5 border-2 border-black rounded-full flex items-center gap-2 shadow-[2px_2px_0px_0px_#000]">
              <BookOpen size={12} /> {questions.length} Questions
            </p>
            <p className="text-[10px] font-black uppercase bg-[#FFE66D] px-3 py-0.5 border-2 border-black rounded-full flex items-center gap-2 shadow-[2px_2px_0px_0px_#000]">
              <Flag size={12} /> {flaggedIds.length} Flagged
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          {isAdminUI && (
              <Link 
                to={`/add/${id}`}
                className="flex items-center gap-2 px-6 py-3 bg-[var(--card-bg)] border-4 border-black rounded-xl hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all font-black uppercase text-sm neo-brutal-shadow text-[var(--text-main)]"
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

      <div className="space-y-4">
        <h2 className="text-xl font-black uppercase tracking-tighter border-b-4 border-black dark:border-white pb-1 inline-block dark:text-white transition-colors">Curriculum</h2>

        {questions.length > 0 ? (
          <div className="grid gap-4">
            {questions.map((q, index) => (
              <motion.div 
                key={q.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "bg-[var(--card-bg)] p-5 rounded-[24px] border-4 border-black transition-all",
                  flaggedIds.includes(q.id) ? "neo-brutal-shadow-red bg-[#FFF5F5] dark:bg-[#2A1F1F]" : "neo-brutal-shadow hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
                )}
              >
                <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-black bg-black dark:bg-[#FFE66D] text-white dark:text-black px-2 py-0.5 rounded-full uppercase tracking-tighter leading-none">
                        Case {index + 1}
                      </span>
                      {q.isNoted && (
                        <span className="text-[10px] font-black bg-[#FFE66D] text-black px-2 py-0.5 border-2 border-black rounded-full uppercase tracking-tighter leading-none flex items-center gap-1">
                          <Pin size={10} fill="currentColor" /> NOTED
                        </span>
                      )}
                      {flaggedIds.includes(q.id) && (
                        <span className="text-[10px] font-black text-[#FF6B6B] bg-white dark:bg-gray-800 border-2 border-[#FF6B6B] px-2 py-0.5 rounded-full uppercase tracking-tighter leading-none flex items-center gap-1">
                          <Flag size={10} fill="currentColor" /> flagged
                        </span>
                      )}
                    </div>
                    <p className="text-lg font-bold text-[var(--text-main)] leading-snug tracking-tight transition-colors">{q.questionText}</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {(['A', 'B', 'C', 'D'] as const).map(opt => (
                        <div 
                          key={opt} 
                          className={cn(
                            "flex items-center gap-2 p-3 rounded-xl border-2 transition-all font-bold text-xs",
                            q.correctAnswer === opt 
                              ? "bg-[#4ECDC4]/20 border-[#4ECDC4] text-[var(--text-main)]" 
                              : "bg-[var(--card-muted)] border-transparent text-[var(--text-muted)]"
                          )}
                        >
                          <span className={cn(
                            "shrink-0 w-6 h-6 flex items-center justify-center rounded-lg border-2 text-[10px] uppercase font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-colors",
                            q.correctAnswer === opt 
                              ? "border-black bg-black text-white" 
                              : "border-black bg-[var(--card-bg)] text-[var(--text-main)]"
                          )}>
                            {opt}
                          </span>
                          <span className="truncate">{q[`option${opt}` as keyof Question]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {isAdminUI && (
                    <div className="flex md:flex-col gap-2">
                      <Link 
                        to={`/edit/${id}/${q.id}`}
                        className="bg-[var(--card-bg)] border-2 border-black p-2 rounded-xl hover:bg-[#FFE66D] dark:hover:bg-[#FFE66D] dark:hover:text-black text-[var(--text-main)] transition-all shadow-[2px_2px_0px_0px_#000]"
                      >
                        <Edit2 size={16} strokeWidth={3} />
                      </Link>
                      <button 
                        onClick={() => handleToggleNote(q)}
                        className={cn(
                          "border-2 border-black p-2 rounded-xl transition-all shadow-[2px_2px_0px_0px_#000]",
                          q.isNoted ? "bg-[#FFE66D] text-black" : "bg-[var(--card-bg)] text-[var(--text-main)] hover:bg-gray-100"
                        )}
                        title={q.isNoted ? "Unnote Question" : "Note Question"}
                      >
                        <Pin size={16} strokeWidth={3} fill={q.isNoted ? "currentColor" : "none"} />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-[var(--card-bg)] border-4 border-black rounded-[40px] neo-brutal-shadow">
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
