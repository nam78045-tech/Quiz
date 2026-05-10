import { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { quizService } from '../services/quizService';
import { Question } from '../types';
import { ChevronLeft, Flag, CheckCircle, XCircle, RotateCcw, Trophy, ArrowRight, Home } from 'lucide-react';
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

  // Randomize options for each question
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

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  if (questions.length === 0) return <div className="text-center py-20">No questions found.</div>;

  if (isFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto text-center space-y-6 py-6"
      >
        <div className="space-y-3">
          <div className="relative inline-block">
            <div className="w-20 h-20 bg-[#FFE66D] border-4 border-black rounded-2xl mx-auto flex items-center justify-center neo-brutal-shadow">
              <Trophy size={40} className="text-black" />
            </div>
            <motion.div 
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: -10 }}
              transition={{ delay: 0.3 }}
              className="absolute -top-3 -right-3 bg-[#FF6B6B] border-2 border-black text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter shadow-[2px_2px_0px_0px_#000]"
            >
              Master!
            </motion.div>
          </div>
          <h1 className="text-3xl font-black text-black dark:text-white uppercase tracking-tighter">Quiz Complete!</h1>
          <p className="text-sm font-bold text-gray-500">You've dominated this session.</p>
        </div>

        <div className="bg-[var(--card-bg)] border-4 border-black rounded-[32px] p-6 neo-brutal-shadow-lg space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-[#4ECDC4] border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_#000]">
              <span className="block text-[8px] font-black text-black uppercase tracking-widest mb-1 opacity-60">Score</span>
              <span className="text-2xl font-black text-black">{score}/{questions.length}</span>
            </div>
            <div className="p-4 bg-[#FFE66D] border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_#000]">
              <span className="block text-[8px] font-black text-black uppercase tracking-widest mb-1 opacity-60">Accuracy</span>
              <span className="text-2xl font-black text-black">{percentage}%</span>
            </div>
          </div>

          <div className="space-y-4">
            {wrongQuestions.length > 0 && !isRetryMode && (
              <button 
                onClick={handleRetryWrong}
                className="w-full flex items-center justify-center gap-3 bg-[#4ECDC4] border-4 border-black text-black py-4 rounded-2xl hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all font-black uppercase text-sm neo-brutal-shadow"
              >
                <RotateCcw size={20} strokeWidth={3} />
                Fix Mistakes ({wrongQuestions.length})
              </button>
            )}
            <button 
              onClick={() => navigate(`/subject/${id}`)}
              className="w-full flex items-center justify-center gap-3 bg-[var(--card-bg)] border-4 border-black text-[var(--text-main)] py-4 rounded-2xl hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all font-black uppercase text-sm neo-brutal-shadow-yellow"
            >
              <Home size={20} strokeWidth={3} />
              Subject Overview
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Quiz Header */}
      <div className="flex items-center justify-between gap-4">
        <Link to={id === 'noted-practice' ? '/' : `/subject/${id}`} className="bg-white dark:bg-[#2D2D2D] border-2 border-black p-2 rounded-xl text-black dark:text-white neo-brutal-shadow transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none">
          <ChevronLeft size={20} strokeWidth={3} />
        </Link>
        <div className="flex-1">
          <div className="h-3 bg-white dark:bg-[#1A1A1A] border-4 border-black rounded-full overflow-hidden neo-brutal-shadow">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              className="h-full bg-[#4ECDC4] border-r-4 border-black"
            />
          </div>
          <p className="text-center text-[8px] font-black text-black dark:text-gray-400 mt-2 tracking-[0.2em] uppercase">
            Progress: {currentIndex + 1} / {questions.length}
          </p>
        </div>
        <button 
          onClick={toggleFlag}
          className={cn(
            "p-2 rounded-xl transition-all border-2 border-black neo-brutal-shadow",
            flaggedIds.includes(currentQuestion?.id) 
              ? "bg-[#FF6B6B] text-white shadow-none translate-x-0.5 translate-y-0.5" 
              : "bg-white dark:bg-[#2D2D2D] text-gray-300 dark:text-gray-600 hover:text-black dark:hover:text-white"
          )}
        >
          <Flag size={18} strokeWidth={3} fill={flaggedIds.includes(currentQuestion?.id) ? "currentColor" : "none"} />
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={currentIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-6"
        >
          <div className="bg-[var(--card-bg)] border-4 border-black p-6 rounded-[32px] neo-brutal-shadow-lg relative">
            <div className="absolute -top-3 left-6 bg-black dark:bg-[var(--primary-yellow)] text-white dark:text-black px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest">
              Prompt
            </div>
            <h2 className="text-xl font-black text-[var(--text-main)] leading-tight tracking-tight mt-2 transition-colors">
              {currentQuestion.questionText}
            </h2>
          </div>

          <div className="grid gap-3">
            {shuffledOptions.map((opt) => {
              const isSelected = selectedOption === opt.key;
              const isCorrect = opt.key === currentQuestion.correctAnswer;
              
              let stateClasses = "bg-[var(--card-bg)] hover:bg-[#F9F9F9] dark:hover:bg-[#2D2D2D] neo-brutal-shadow";
              if (showResult) {
                if (isCorrect) stateClasses = "bg-[#4ECDC4] ring-2 ring-black scale-[1.01] z-10 neo-brutal-shadow shadow-none translate-x-0.5 translate-y-0.5";
                else if (isSelected) stateClasses = "bg-[#FF6B6B] opacity-90 grayscale-[0.2] shadow-none translate-x-0.5 translate-y-0.5";
                else stateClasses = "bg-[var(--card-bg)] dark:bg-black/20 opacity-40 grayscale pointer-events-none";
              }

              return (
                <button 
                  key={opt.key}
                  disabled={showResult}
                  onClick={() => handleSelect(opt.key)}
                  className={cn(
                    "w-full p-4 rounded-2xl border-4 border-black text-left transition-all relative flex items-center gap-4 group",
                    stateClasses
                  )}
                >
                  <span className={cn(
                    "shrink-0 w-8 h-8 border-2 border-black rounded-lg flex items-center justify-center font-black text-xs transition-all",
                    showResult && isCorrect ? "bg-white text-black" : 
                    showResult && isSelected ? "bg-white text-[#FF6B6B]" :
                    "bg-[var(--card-muted)] text-[var(--text-muted)] group-hover:bg-[var(--primary-yellow)] group-hover:text-black shadow-[2px_2px_0px_0px_#000]"
                  )}>
                    {showResult ? (isCorrect ? <CheckCircle size={18} strokeWidth={3} /> : (isSelected ? <XCircle size={18} strokeWidth={3} /> : opt.key)) : opt.key}
                  </span>
                  <span className="font-bold text-base text-[var(--text-main)] leading-snug transition-colors">{opt.text}</span>
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {showResult && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="pt-2"
        >
          <button 
            onClick={handleNext}
            className="w-full bg-[#FFE66D] text-black py-4 rounded-2xl border-4 border-black hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all font-black uppercase tracking-widest text-lg neo-brutal-shadow-teal flex items-center justify-center gap-2"
          >
            {currentIndex < questions.length - 1 ? 'Next' : 'Finish'}
            <ArrowRight size={20} strokeWidth={3} />
          </button>
        </motion.div>
      )}
    </div>
  );
}
