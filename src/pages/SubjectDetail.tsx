import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { quizService } from '../services/quizService';
import { Subject, Question } from '../types';
import { Play, Plus, BookOpen, ChevronLeft, Flag, Edit2, Info, Pin, Sparkles, Zap, ArrowLeft, ArrowRight, Activity, Map } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
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

  if (loading) return null;

  if (!subject) return (
    <div className="text-center py-40 glass-card rounded-[80px]">
      <h1 className="text-3xl font-black text-white glow-text uppercase tracking-widest mb-6">Subject Void Detected</h1>
      <Link to="/" className="btn-shine bg-white text-black px-10 py-5 rounded-[32px] font-black uppercase text-xs tracking-widest inline-block">Return to Command Map</Link>
    </div>
  );

  return (
    <div className="space-y-24 pb-32">
      {/* Header Section - Refined */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 pt-12">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <Link to="/" className="group inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.05] text-[10px] font-black text-slate-500 hover:text-white transition-all uppercase tracking-[0.2em] hover:bg-white/[0.08]">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back to Galactic Map
          </Link>
          
          <div className="flex items-center gap-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-violet-500/20 blur-[30px] rounded-full group-hover:bg-violet-500/40 transition-all duration-700" />
              <div className="w-24 h-24 rounded-[40px] bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 flex items-center justify-center text-5xl relative z-10 shadow-inner group-hover:rotate-12 transition-transform duration-700">
                🪐
              </div>
            </div>
            <div>
              <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tighter leading-none mb-4">
                <span className="text-gradient">{subject.name}</span>
              </h1>
              <div className="flex items-center gap-6 flex-wrap">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
                  <Activity size={14} className="text-cyan-400" />
                  <span className="text-[10px] font-black uppercase text-cyan-400 tracking-wider">
                    {questions.length} Knowledge Nodes
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                  <Flag size={14} className="text-rose-400" />
                  <span className="text-[10px] font-black uppercase text-rose-400 tracking-wider">
                    {flaggedIds.length} Critical Points
                  </span>
                </div>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white/[0.03] border border-white/[0.05]">
                  <Sparkles size={14} className="text-slate-500" />
                  <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                    Synced {new Date(subject.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-4"
        >
          {isAdminUI && (
              <Link 
                to={`/add/${id}`}
                className="group flex items-center gap-3 px-8 py-5 rounded-[28px] border border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.08] transition-all font-black uppercase text-[10px] tracking-[0.2em] text-white backdrop-blur-3xl"
              >
              <Plus size={18} className="text-violet-400 group-hover:rotate-90 transition-transform" />
              Inject DNA
            </Link>
          )}
          <Link 
            to={`/quiz/${id}`}
            className={cn(
              "btn-shine flex items-center gap-4 px-12 py-5 bg-white text-black rounded-[28px] hover:scale-105 active:scale-95 transition-all font-black uppercase text-xs tracking-[0.4em] shadow-[0_0_50px_rgba(255,255,255,0.2)]",
              questions.length === 0 && "opacity-30 cursor-not-allowed pointer-events-none grayscale"
            )}
          >
            <Play size={20} fill="currentColor" stroke="none" />
            Initiate Warp
          </Link>
        </motion.div>
      </div>

      <div className="space-y-12">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <Map className="text-violet-400" size={24} />
            <h2 className="text-xl font-black tracking-[0.4em] text-white uppercase ml-1">Intelligence Map</h2>
          </div>
          <div className="h-px flex-1 bg-gradient-to-r from-white/10 via-white/5 to-transparent" />
        </div>

        {questions.length > 0 ? (
          <div className="grid gap-10">
            {questions.map((q, index) => (
              <motion.div 
                key={q.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: (index % 5) * 0.05 }}
                className={cn(
                  "glass-card p-6 md:p-8 rounded-[32px] group relative overflow-hidden transition-all duration-500",
                  flaggedIds.includes(q.id) ? "border-rose-500/20 shadow-[0_0_30px_rgba(244,63,94,0.06)]" : "hover:border-white/10"
                )}
              >
                <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
                  <div className="space-y-6 flex-1 w-full">
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="bg-white/[0.03] border border-white/[0.05] px-3 py-1 rounded-full flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-violet-400" />
                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em]">Node {index + 1}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl md:text-2xl font-bold text-white leading-tight tracking-tight">
                      {q.questionText}
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {(['A', 'B', 'C', 'D'] as const).map(opt => (
                        <div 
                          key={opt} 
                          className={cn(
                            "flex items-center gap-4 p-3.5 rounded-2xl border transition-all duration-500",
                            q.correctAnswer === opt 
                              ? "bg-cyan-500/5 border-cyan-500/20" 
                              : "bg-white/[0.01] border-transparent opacity-40"
                          )}
                        >
                          <div className={cn(
                            "shrink-0 w-8 h-8 flex items-center justify-center rounded-xl border text-[9px] font-black",
                            q.correctAnswer === opt 
                              ? "border-cyan-400 bg-cyan-400 text-black shadow-[0_0_10px_rgba(6,182,212,0.4)]" 
                              : "border-white/10 bg-white/5 text-slate-600"
                          )}>
                            {opt}
                          </div>
                          <span className={cn(
                            "font-bold text-sm tracking-tight truncate",
                            q.correctAnswer === opt ? "text-white" : "text-slate-500"
                          )}>
                            {q[`option${opt}` as keyof Question]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {isAdminUI && (
                    <div className="flex lg:flex-col gap-4 w-full lg:w-auto mt-6 lg:mt-0 pt-8 lg:pt-0 border-t lg:border-t-0 lg:border-l border-white/[0.03] lg:pl-10">
                      <Link 
                        to={`/edit/${id}/${q.id}`}
                        className="flex-1 lg:w-16 lg:h-16 h-14 flex items-center justify-center rounded-[24px] bg-white/[0.02] border border-white/[0.05] text-slate-500 hover:bg-violet-600 hover:text-white hover:border-violet-500 transition-all shadow-xl group/edit"
                      >
                        <Edit2 size={24} className="group-hover:rotate-12 transition-transform" />
                      </Link>
                      <button 
                        onClick={() => handleToggleNote(q)}
                        className={cn(
                          "flex-1 lg:w-16 lg:h-16 h-14 flex items-center justify-center rounded-[24px] transition-all shadow-xl border",
                          q.isNoted ? "bg-amber-500 border-amber-400 text-black" : "bg-white/[0.02] border-white/[0.05] text-slate-500 hover:text-white"
                        )}
                        title={q.isNoted ? "De-prioritize Node" : "Prioritize Node"}
                      >
                        <Pin size={24} fill={q.isNoted ? "currentColor" : "none"} />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-40 glass-card rounded-[80px]">
             <div className="relative inline-block mb-12">
              <div className="w-32 h-32 bg-slate-500/5 rounded-full flex items-center justify-center">
                <Sparkles className="text-slate-800" size={64} />
              </div>
              <motion.div 
                animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.4, 1] }}
                transition={{ repeat: Infinity, duration: 4 }}
                className="absolute inset-0 bg-violet-500/20 blur-3xl rounded-full" 
              />
            </div>
            <p className="text-slate-500 font-bold text-2xl mb-12 max-w-md mx-auto">
              This intelligence map is currently blank. Ready to deploy new knowledge assets?
            </p>
            {isAdminUI && (
              <Link 
                to={`/add/${id}`} 
                className="btn-shine bg-white text-black px-12 py-6 rounded-[32px] font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl"
              >
                Initalize Deployment
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
