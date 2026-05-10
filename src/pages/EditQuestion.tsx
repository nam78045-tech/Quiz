import { useState, useEffect, FormEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { quizService } from '../services/quizService';
import { Question } from '../types';
import { ChevronLeft, Save, AlertCircle, Zap, ArrowLeft, RefreshCcw, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export default function EditQuestion() {
  const { sid, qid } = useParams<{ sid: string; qid: string }>();
  const navigate = useNavigate();
  
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState({ A: '', B: '', C: '', D: '' });
  const [correctAnswer, setCorrectAnswer] = useState<'A' | 'B' | 'C' | 'D'>('A');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (sid && qid) {
      loadQuestion();
    }
  }, [sid, qid]);

  const loadQuestion = async () => {
    try {
      const questions = await quizService.getQuestions(sid!);
      const q = questions.find(item => item.id === qid);
      if (q) {
        setQuestionText(q.questionText);
        setOptions({
          A: q.optionA,
          B: q.optionB,
          C: q.optionC,
          D: q.optionD
        });
        setCorrectAnswer(q.correctAnswer);
      }
      setLoading(false);
    } catch (err) {
      setError('Failed to recalibrate question node.');
      setLoading(false);
    }
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!sid || !qid || !questionText || !options.A || !options.B || !options.C || !options.D) {
      setError('Protocol error: Signal incomplete.');
      return;
    }

    setIsSubmitting(true);
    try {
      await quizService.updateQuestion(qid, {
        questionText,
        optionA: options.A,
        optionB: options.B,
        optionC: options.C,
        optionD: options.D,
        correctAnswer
      });
      navigate(`/subject/${sid}`);
    } catch (err) {
      setError('Transmission loss during reconfiguration.');
      setIsSubmitting(false);
    }
  };

  if (loading) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-16 pb-32">
       <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <Link to={`/subject/${sid}`} className="group inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.05] text-[10px] font-black text-slate-500 hover:text-white transition-all uppercase tracking-[0.2em] hover:bg-white/[0.08]">
           <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to Knowledge Nebula
        </Link>
        <div className="relative">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-none inline-block">
            <span className="text-gradient">Recalibrate</span> <span className="text-gradient-cosmic glow-text">Node</span>
          </h1>
          <motion.div 
             animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.1, 1] }}
             transition={{ repeat: Infinity, duration: 5 }}
             className="absolute -top-10 -right-20 w-48 h-48 bg-cyan-500/10 blur-[90px] rounded-full pointer-events-none" 
          />
        </div>
        <p className="text-xl font-medium text-slate-500 max-w-xl leading-relaxed">
          Modifying intelligence node ID: <span className="font-mono text-cyan-400 text-xs">{qid}</span>. Ensure data integrity after update.
        </p>
      </motion.div>

      <form onSubmit={handleSave} className="space-y-10">
        <div className="glass-card p-12 rounded-[56px] space-y-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-px bg-gradient-to-l from-violet-500 to-transparent" />
          
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3 p-5 bg-rose-500/5 border border-rose-500/20 text-rose-400 rounded-[24px] font-bold text-xs"
              >
                <AlertCircle size={18} />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-4">
            <div className="flex items-center gap-3 ml-2">
              <RefreshCcw size={14} className="text-violet-500 animate-[spin_4s_linear_infinite]" />
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Core Transmission</label>
            </div>
            <textarea 
              required
              rows={4}
              placeholder="Update signal content..."
              className="w-full px-10 py-8 bg-white/[0.015] border border-white/[0.04] rounded-[40px] focus:outline-none focus:border-violet-500/50 text-2xl font-bold text-white transition-all placeholder:text-slate-800 focus:bg-white/[0.03]"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
            />
          </div>

          <div className="grid gap-5">
            {(['A', 'B', 'C', 'D'] as const).map((key) => (
              <div key={key} className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.05] flex items-center justify-center font-black text-xs text-slate-500 transition-all group-focus-within:border-violet-500/50 group-focus-within:text-white">
                  {key}
                </div>
                <input 
                  required
                  type="text" 
                  placeholder={`Variant ${key}...`}
                  className={cn(
                    "w-full pl-20 pr-32 py-6 border rounded-[32px] focus:outline-none font-bold transition-all text-lg",
                    correctAnswer === key 
                      ? "bg-cyan-500/[0.03] border-cyan-500/30 text-white" 
                      : "bg-white/[0.01] border-white/[0.04] text-slate-400 focus:text-white focus:bg-white/[0.03]"
                  )}
                  value={options[key]}
                  onChange={(e) => setOptions({ ...options, [key]: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setCorrectAnswer(key)}
                  className={cn(
                    "absolute right-4 top-1/2 -translate-y-1/2 px-5 py-2 rounded-2xl border transition-all text-[8px] font-black uppercase tracking-widest",
                    correctAnswer === key ? "bg-cyan-500 text-black border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]" : "bg-white/5 border-transparent text-slate-600 hover:text-slate-400"
                  )}
                >
                  {correctAnswer === key ? 'Validated Path' : 'Set as Correct'}
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-4 pt-6">
            <Link 
              to={`/subject/${sid}`}
              className="flex-1 px-8 py-7 rounded-[32px] border border-white/5 text-slate-500 font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:bg-white/5 transition-all"
            >
              Abort Signal
            </Link>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="btn-shine flex-[2] bg-white text-black py-7 rounded-[32px] font-black uppercase tracking-[0.4em] text-base hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_50px_rgba(255,255,255,0.2)] disabled:opacity-30 flex items-center justify-center gap-4"
            >
              <Zap size={24} className="fill-black" />
              {isSubmitting ? 'Syncing...' : 'Override Node'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
