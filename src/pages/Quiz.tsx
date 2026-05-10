import { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { quizService } from '../services/quizService';
import { Question } from '../types';
import { ChevronLeft, Flag, CheckCircle, XCircle, RotateCcw, Trophy, ArrowRight, Home, Sparkles, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface ShuffledOption {
  key: 'A' | 'B' | 'C' | 'D';
  text: string;
}

export default function Quiz() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [wrongQuestions, setWrongQuestions] = useState<Question[]>([]);
  const [flaggedIds, setFlaggedIds] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [isRetryMode, setIsRetryMode] = useState(false);

  useEffect(() => {
    if (id) {
      if (id === 'noted-practice') {
        loadNotedQuestions();
      } else {
        loadQuestions(id);
      }
      const savedFlags = localStorage.getItem('flagged_' + id);
      if (savedFlags) setFlaggedIds(JSON.parse(savedFlags));
    }
  }, [id]);

  const loadQuestions = async (subjectId: string) => {
    const data = await quizService.getQuestions(subjectId);
    setQuestions(shuffleArray([...data]));
    setLoading(false);
  };

  const loadNotedQuestions = async () => {
    const data = await quizService.getNotedQuestions();
    setQuestions(shuffleArray([...data]));
    setLoading(false);
  };

  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  };

  const currentQuestion = questions[currentIndex];

  const shuffledOptions = useMemo(() => {
    if (!currentQuestion) return [];
    const opts: ShuffledOption[] = [
      { key: 'A', text: currentQuestion.optionA },
      { key: 'B', text: currentQuestion.optionB },
      { key: 'C', text: currentQuestion.optionC },
      { key: 'D', text: currentQuestion.optionD },
    ];
    return shuffleArray(opts);
  }, [currentQuestion]);

  const handleSelect = (key: 'A' | 'B' | 'C' | 'D') => {
    if (showResult) return;
    setSelectedOption(key);
    setShowResult(true);

    if (key === currentQuestion.correctAnswer) {
      setScore(s => s + 1);
    } else {
      setWrongQuestions(prev => [...prev, currentQuestion]);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setShowResult(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleRetryWrong = () => {
    setQuestions(shuffleArray([...wrongQuestions]));
    setWrongQuestions([]);
    setCurrentIndex(0);
    setScore(0);
    setSelectedOption(null);
    setShowResult(false);
    setIsFinished(false);
    setIsRetryMode(true);
  };

  const toggleFlag = () => {
    if (!currentQuestion) return;
    const newFlags = flaggedIds.includes(currentQuestion.id)
      ? flaggedIds.filter(f => f !== currentQuestion.id)
      : [...flaggedIds, currentQuestion.id];
    
    setFlaggedIds(newFlags);
    localStorage.setItem('flagged_' + id, JSON.stringify(newFlags));
  };

  if (loading) return null; // Let App.tsx handle the loading state

  if (questions.length === 0) return (
    <div className="text-center py-20 glass-card rounded-[40px] max-w-2xl mx-auto">
      <Sparkles size={48} className="mx-auto mb-4 text-cyan-400 animate-pulse" />
      <h2 className="text-2xl font-bold text-white uppercase tracking-widest">No Intelligence Data</h2>
      <p className="text-slate-400 mt-2">This constellation currently holds no knowledge nodes.</p>
      <Link to="/" className="mt-8 inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-2xl font-bold">
        Return to Command
      </Link>
    </div>
  );

  if (isFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto text-center space-y-10 py-12"
      >
        <div className="space-y-4">
          <motion.div 
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ repeat: Infinity, duration: 5 }}
            className="w-24 h-24 bg-gradient-to-br from-violet-600 to-cyan-500 rounded-[32px] mx-auto flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.3)]"
          >
            <Trophy size={48} className="text-white" />
          </motion.div>
          <h1 className="text-4xl font-extrabold text-white tracking-tighter uppercase glow-text">Mission Accomplished</h1>
          <p className="text-slate-400 font-medium">You've traversed the knowledge nebula successfully.</p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="glass-card p-8 rounded-[40px] border-cyan-500/20">
            <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Efficiency</span>
            <span className="text-4xl font-black text-cyan-400">{score}/{questions.length}</span>
          </div>
          <div className="glass-card p-8 rounded-[40px] border-violet-500/20">
            <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Sync Accuracy</span>
            <span className="text-4xl font-black text-violet-400">{percentage}%</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          {wrongQuestions.length > 0 && !isRetryMode && (
            <button 
              onClick={handleRetryWrong}
              className="px-8 py-5 rounded-[24px] bg-white text-black font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-xl"
            >
              <RotateCcw size={18} />
              Re-sync Mistakes ({wrongQuestions.length})
            </button>
          )}
          <button 
            onClick={() => navigate(`/subject/${id}`)}
            className="px-8 py-5 rounded-[24px] bg-white/5 border border-white/10 text-white font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-3 hover:bg-white/10 transition-all"
          >
            <Home size={18} />
            Command Center
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-4">
      {/* Quiz Header */}
      <div className="flex items-center gap-4">
        <Link to={id === 'noted-practice' ? '/' : `/subject/${id}`} className="glass-card p-2 rounded-xl text-slate-400 hover:text-white transition-colors">
          <ChevronLeft size={20} />
        </Link>
        <div className="flex-1 space-y-2">
          <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              className="h-full bg-gradient-to-r from-violet-500 to-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
            />
          </div>
          <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
            <span>Neural Sync</span>
            <span className="text-cyan-400">{currentIndex + 1} / {questions.length} Nodes</span>
          </div>
        </div>
        <button 
          onClick={toggleFlag}
          className={cn(
            "p-2 rounded-xl transition-all border",
            flaggedIds.includes(currentQuestion?.id) 
              ? "bg-rose-500/20 border-rose-500/50 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.3)]" 
              : "bg-white/5 border-white/10 text-slate-500"
          )}
        >
          <Flag size={18} fill={flaggedIds.includes(currentQuestion?.id) ? "currentColor" : "none"} />
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-6"
        >
          <div className="glass-card p-6 md:p-8 rounded-[32px] relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-violet-500 to-cyan-500" />
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400">
                <Zap size={16} className="fill-violet-400/20" />
              </div>
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Active Transmission</span>
            </div>
            <h2 className="text-2xl font-bold text-white leading-tight tracking-tight">
              {currentQuestion.questionText}
            </h2>
          </div>

          <div className="grid gap-3">
            {shuffledOptions.map((opt, idx) => {
              const isSelected = selectedOption === opt.key;
              const isCorrect = opt.key === currentQuestion.correctAnswer;
              
              let stateClasses = "glass-card hover:bg-white/[0.07] border-white/10";
              if (showResult) {
                if (isCorrect) stateClasses = "bg-cyan-500/20 border-cyan-500/50 glow-border text-white";
                else if (isSelected) stateClasses = "bg-rose-500/20 border-rose-500/50 text-rose-400 scale-[0.98] blur-[0.5px]";
                else stateClasses = "opacity-30 blur-sm grayscale pointer-events-none";
              }

              return (
                <button 
                  key={opt.key}
                  disabled={showResult}
                  onClick={() => handleSelect(opt.key)}
                  className={cn(
                    "w-full p-4 rounded-2xl text-left transition-all duration-300 relative flex items-center gap-4 group overflow-hidden",
                    stateClasses,
                    !showResult && "hover:translate-x-1"
                  )}
                >
                  <div className={cn(
                    "shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm transition-all",
                    showResult && isCorrect ? "bg-cyan-400 text-black shadow-[0_0_15px_rgba(6,182,212,0.6)]" : 
                    showResult && isSelected ? "bg-rose-500 text-white" :
                    "bg-white/5 border border-white/10 text-slate-500 group-hover:text-white group-hover:border-white/30"
                  )}>
                    {showResult ? (isCorrect ? <CheckCircle size={18} /> : (isSelected ? <XCircle size={18} /> : opt.key)) : opt.key}
                  </div>
                  <span className="font-bold text-base text-white/90 leading-snug">{opt.text}</span>
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {showResult && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <button 
              onClick={handleNext}
              className="btn-shine w-full bg-white text-black py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3"
            >
              {currentIndex < questions.length - 1 ? 'Next Memory Core' : 'Mission Result'}
              <ArrowRight size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
