import { useState, FormEvent } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { quizService } from '../services/quizService';
import { ChevronLeft, Save, Sparkles, AlertCircle, Zap, ArrowLeft, Cpu, Terminal, Layers } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function AddQuestion() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [rawText, setRawText] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState({ A: '', B: '', C: '', D: '' });
  const [correctAnswer, setCorrectAnswer] = useState<'A' | 'B' | 'C' | 'D'>('A');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isParsing, setIsParsing] = useState(false);

  const parseText = async () => {
    if (!rawText.trim()) return;
    setIsParsing(true);
    
    // Artificial delay for "Processing" feel
    await new Promise(r => setTimeout(r, 800));

    const splitRegex = /(?:\n|^)(?=[A-D][).:\-\]])/i;
    const parts = rawText.split(splitRegex).map(p => p.trim()).filter(Boolean);

    if (parts.length >= 5) {
      setQuestionText(parts[0]);
      setOptions({
        A: parts[1].replace(/^[A][).:\-\]]\s*/i, ''),
        B: parts[2].replace(/^[B][).:\-\]]\s*/i, ''),
        C: parts[3].replace(/^[C][).:\-\]]\s*/i, ''),
        D: parts[4].replace(/^[D][).:\-\]]\s*/i, '')
      });
      setError('');
    } else {
      const altSplit = /\s+(?=[A-D][).:\-\]])/i;
      const altParts = rawText.split(altSplit).map(p => p.trim()).filter(Boolean);
      
      if (altParts.length >= 5) {
        setQuestionText(altParts[0]);
        setOptions({
          A: altParts[1].replace(/^[A][).:\-\]]\s*/i, ''),
          B: altParts[2].replace(/^[B][).:\-\]]\s*/i, ''),
          C: altParts[3].replace(/^[C][).:\-\]]\s*/i, ''),
          D: altParts[4].replace(/^[D][).:\-\]]\s*/i, '')
        });
        setError('');
      } else {
        setError('DATA MISMATCH: Protocol requires A) B) C) D) sequence.');
      }
    }
    setIsParsing(false);
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!id || !questionText || !options.A || !options.B || !options.C || !options.D) {
      setError('CRITICAL ERROR: Neural linkage incomplete.');
      return;
    }

    setIsSubmitting(true);
    try {
      await quizService.addQuestion({
        subjectId: id,
        questionText,
        optionA: options.A,
        optionB: options.B,
        optionC: options.C,
        optionD: options.D,
        correctAnswer
      });
      navigate(`/subject/${id}`);
    } catch (err) {
      setError('UPLINK FAILED: Connection to cosmic database severed.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-16 pb-32">
      {/* Header with improved typography */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <Link to={`/subject/${id}`} className="group inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.05] text-[10px] font-black text-slate-500 hover:text-white transition-all uppercase tracking-[0.2em] hover:bg-white/[0.08]">
           <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to Galactic Sector
        </Link>
        <div className="relative">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-none inline-block">
            <span className="text-gradient">Inject</span> <span className="text-gradient-cosmic glow-text">Intelligence</span>
          </h1>
          <motion.div 
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="absolute -top-10 -right-20 w-40 h-40 bg-violet-500/10 blur-[80px] rounded-full pointer-events-none" 
          />
        </div>
        <p className="text-xl font-medium text-slate-500 max-w-2xl leading-relaxed">
          Initialize new knowledge fragments for the neural network. Use the AI parser for rapid deployment or manual injection for precision.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-[1.2fr,1fr] gap-12 items-start">
        {/* Parser Panel - More Techy */}
        <motion.section 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-10 rounded-[48px] border-cyan-500/10 group relative"
        >
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                <Cpu size={24} />
              </div>
              <div>
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-cyan-400">Smart Link Parser</h2>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Automated Extraction</p>
              </div>
            </div>
            <button 
              onClick={parseText}
              disabled={isParsing || !rawText}
              className={cn(
                "btn-shine px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-2xl disabled:opacity-30",
                isParsing ? "bg-slate-800 text-slate-500" : "bg-cyan-500 text-black hover:scale-105 active:scale-95 shadow-cyan-500/20"
              )}
            >
              {isParsing ? 'Processing...' : 'Deep Scan'}
            </button>
          </div>
          
          <div className="relative">
            <div className="absolute top-4 left-4 text-cyan-500/30 flex items-center gap-2 pointer-events-none">
              <Terminal size={14} />
              <span className="text-[8px] font-mono font-bold tracking-widest">RAW_DATA_INPUT</span>
            </div>
            <textarea 
              placeholder="Waiting for input stream..."
              rows={8}
              className="w-full pt-12 p-8 bg-black/40 border border-white/[0.05] rounded-[32px] focus:outline-none focus:border-cyan-500/50 text-white font-mono text-sm leading-loose transition-all placeholder:text-slate-800 focus:bg-black/60 shadow-inner"
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
            />
          </div>
          
          <div className="mt-8 flex items-center gap-3 text-slate-600">
            <div className="w-1 h-1 rounded-full bg-cyan-500/50" />
            <p className="text-[10px] uppercase font-black tracking-widest">Supported: Q &rarr; A) B) C) D)</p>
          </div>
        </motion.section>

        {/* Manual Configuration */}
        <motion.div
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ delay: 0.2 }}
           className="space-y-8"
        >
          <div className="flex items-center gap-4 px-4">
            <Layers size={18} className="text-violet-500" />
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-violet-400">Node Configuration</h2>
          </div>

          <form onSubmit={handleSave} className="space-y-8">
            <div className="glass-card p-10 rounded-[48px] space-y-10">
              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-3 p-5 bg-rose-500/5 border border-rose-500/20 text-rose-400 rounded-2xl font-bold text-xs"
                  >
                    <AlertCircle size={18} />
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-4">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-2">Core Content</label>
                <textarea 
                  required
                  rows={4}
                  placeholder="Enter Question..."
                  className="w-full px-8 py-6 bg-white/[0.02] border border-white/[0.05] rounded-[32px] focus:outline-none focus:border-violet-500/50 text-xl font-bold text-white transition-all placeholder:text-slate-800"
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                />
              </div>

              <div className="grid gap-4">
                {(['A', 'B', 'C', 'D'] as const).map((key) => (
                  <div key={key} className="space-y-2 group">
                    <div className="flex items-center justify-between px-4">
                      <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-600 transition-colors group-focus-within:text-violet-500">Variant {key}</label>
                      <button
                        type="button"
                        onClick={() => setCorrectAnswer(key)}
                        className={cn(
                          "px-4 py-1.5 rounded-full border transition-all text-[8px] font-black uppercase tracking-widest",
                          correctAnswer === key ? "bg-cyan-500 text-black border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]" : "bg-white/5 border-transparent text-slate-600 hover:text-slate-400"
                        )}
                      >
                        {correctAnswer === key ? 'Correct Path' : 'Select as Correct'}
                      </button>
                    </div>
                    <input 
                      required
                      type="text" 
                      placeholder={`Option ${key}...`}
                      className={cn(
                        "w-full px-6 py-5 border rounded-3xl focus:outline-none font-bold transition-all placeholder:text-slate-800",
                        correctAnswer === key 
                          ? "bg-cyan-500/[0.03] border-cyan-500/30 text-white shadow-[0_0_15px_rgba(6,182,212,0.05)]" 
                          : "bg-white/[0.015] border-white/[0.05] text-slate-400 focus:text-white"
                      )}
                      value={options[key]}
                      onChange={(e) => setOptions({ ...options, [key]: e.target.value })}
                    />
                  </div>
                ))}
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="btn-shine w-full bg-white text-black py-7 rounded-[32px] font-black uppercase tracking-[0.4em] text-base hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_50px_rgba(255,255,255,0.2)] disabled:opacity-30 flex items-center justify-center gap-4 mt-4"
              >
                <Zap size={24} className="fill-black" />
                {isSubmitting ? 'Syncing...' : 'Deploy Node'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
