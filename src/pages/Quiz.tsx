import { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { quizService } from '../services/quizService';
import { Question } from '../types';
import { ChevronLeft, Flag, CheckCircle, XCircle, RotateCcw, Trophy, ArrowRight, Home, Sparkles, BookOpen } from 'lucide-react';
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

  if (loading) return null;

  if (questions.length === 0) return (
    <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl mx-auto px-4">
      <BookOpen size={36} className="mx-auto mb-4 text-slate-400" />
      <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide">Chưa có câu hỏi nào</h2>
      <p className="text-slate-400 text-xs mt-2">Môn ôn tập này hiện đang trống, chưa có câu hỏi trắc nghiệm nào.</p>
      <Link to="/" className="mt-6 inline-flex items-center gap-1 bg-indigo-600 text-white hover:bg-indigo-700 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm">
        Quay lại trang chủ
      </Link>
    </div>
  );

  if (isFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl mx-auto text-center space-y-6 py-8 px-4"
      >
        <div className="space-y-3">
          <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-2xl mx-auto flex items-center justify-center border border-emerald-100 dark:border-emerald-900">
            <Trophy size={32} />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Hoàn thành bài tập!</h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold">Bạn đã hoàn tất tất cả câu hỏi của bài đăng ký này.</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
            <span className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Số câu trả lời đúng</span>
            <span className="text-2xl font-bold text-emerald-600">{score} / {questions.length}</span>
          </div>
          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
            <span className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Tỉ lệ chính xác</span>
            <span className="text-2xl font-bold text-indigo-600">{percentage}%</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 justify-center pt-4">
          {wrongQuestions.length > 0 && !isRetryMode && (
            <button 
              onClick={handleRetryWrong}
              className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
            >
              <RotateCcw size={14} />
              Làm lại các câu sai ({wrongQuestions.length})
            </button>
          )}
          <button 
            onClick={() => navigate(`/subject/${id}`)}
            className="px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-350 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
          >
            <Home size={14} />
            Quay về trang môn học
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-4 py-2 px-4">
      {/* Quiz Header */}
      <div className="flex items-center gap-3">
        <Link to={id === 'noted-practice' ? '/' : `/subject/${id}`} className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors">
          <ChevronLeft size={16} />
        </Link>
        <div className="flex-1 space-y-1.5">
          <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-100 dark:border-slate-900">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              className="h-full bg-indigo-600"
            />
          </div>
          <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            <span>Tiến trình</span>
            <span className="text-indigo-600 dark:text-indigo-400">Câu {currentIndex + 1} / {questions.length}</span>
          </div>
        </div>
        <button 
          onClick={toggleFlag}
          className={cn(
            "p-2.5 rounded-xl transition-all border",
            flaggedIds.includes(currentQuestion?.id) 
              ? "bg-rose-50 border-rose-200 dark:bg-rose-950/20 dark:border-rose-900 text-rose-600 dark:text-rose-400 shadow-sm" 
              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600"
          )}
          title="Đánh dấu câu hỏi cần xem lại"
        >
          <Flag size={16} fill={flaggedIds.includes(currentQuestion?.id) ? "currentColor" : "none"} />
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={currentIndex}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          className="space-y-4"
        >
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-1.5 mb-3">
              <span className="text-[10px] bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                Câu hỏi luyện tập
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-950 dark:text-white leading-snug">
              {currentQuestion.questionText}
            </h2>
          </div>

          <div className="grid gap-2.5">
            {shuffledOptions.map((opt) => {
              const isSelected = selectedOption === opt.key;
              const isCorrect = opt.key === currentQuestion.correctAnswer;
              
              let stateClasses = "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-805 text-slate-800 dark:text-slate-200 hover:border-indigo-600 dark:hover:border-indigo-500 hover:bg-slate-50 dark:hover:bg-slate-850/50";
              if (showResult) {
                if (isCorrect) stateClasses = "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300";
                else if (isSelected) stateClasses = "bg-rose-50 dark:bg-rose-950/20 border-rose-350 dark:border-rose-800 text-rose-700 dark:text-rose-300 opacity-90";
                else stateClasses = "opacity-30 grayscale pointer-events-none";
              }

              return (
                <button 
                  key={opt.key}
                  disabled={showResult}
                  onClick={() => handleSelect(opt.key)}
                  className={cn(
                    "w-full p-4 rounded-xl text-left border transition-all flex items-center gap-4 hover:scale-[1.005] active:scale-95 font-medium text-sm cursor-pointer",
                    stateClasses
                  )}
                >
                  <div className={cn(
                    "shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs transition-all",
                    showResult && isCorrect ? "bg-emerald-600 text-white" : 
                    showResult && isSelected ? "bg-rose-600 text-white" :
                    "bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-350"
                  )}>
                    {showResult ? (isCorrect ? <CheckCircle size={15} /> : (isSelected ? <XCircle size={15} /> : opt.key)) : opt.key}
                  </div>
                  <span className="font-semibold text-slate-900 dark:text-slate-100 leading-snug">{opt.text}</span>
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {showResult && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="pt-2"
          >
            <button 
              onClick={handleNext}
              className="w-full bg-slate-900 hover:bg-slate-950 dark:bg-white dark:hover:bg-slate-105 text-white dark:text-black py-4.5 rounded-xl font-bold uppercase tracking-wider text-xs shadow-sm flex items-center justify-center gap-1.5"
            >
              {currentIndex < questions.length - 1 ? 'Câu hỏi tiếp theo' : 'Xem kết quả bài tập'}
              <ArrowRight size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
