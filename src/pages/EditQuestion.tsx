import { useState, useEffect, FormEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { quizService } from '../services/quizService';
import { Question } from '../types';
import { AlertCircle, Zap, ArrowLeft, RefreshCcw, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export default function EditQuestion() {
  const { subjectId, questionId } = useParams<{ subjectId: string; questionId: string }>();
  const navigate = useNavigate();
  
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState({ A: '', B: '', C: '', D: '' });
  const [correctAnswer, setCorrectAnswer] = useState<'A' | 'B' | 'C' | 'D'>('A');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (subjectId && questionId) {
      loadQuestion();
    }
  }, [subjectId, questionId]);

  const loadQuestion = async () => {
    try {
      const questions = await quizService.getQuestions(subjectId!);
      const q = questions.find(item => item.id === questionId);
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
      setError('Lỗi tải dữ liệu: Không thể lấy dữ liệu câu hỏi từ hệ thống.');
      setLoading(false);
    }
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!subjectId || !questionId || !questionText || !options.A || !options.B || !options.C || !options.D) {
      setError('Lỗi: Hãy điền đầy đủ đáp án và nội dung câu hỏi.');
      return;
    }

    setIsSubmitting(true);
    try {
      await quizService.updateQuestion(questionId, {
        questionText,
        optionA: options.A,
        optionB: options.B,
        optionC: options.C,
        optionD: options.D,
        correctAnswer
      });
      navigate(`/subject/${subjectId}`);
    } catch (err) {
      setError('Lỗi lưu trữ: Gặp sự cố kết nối với cơ sở dữ liệu.');
      setIsSubmitting(false);
    }
  };

  if (loading) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-24 px-4">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <Link to={`/subject/${subjectId}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-500 hover:text-indigo-650 transition-all">
          <ArrowLeft size={14} />
          Quay lại môn học
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            Chỉnh sửa câu hỏi
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Đang chỉnh sửa mã câu hỏi: <span className="font-mono text-indigo-500 font-semibold text-xs">{questionId}</span>. Vui lòng đảm bảo tính chính xác của dữ liệu sau khi sửa đổi.
          </p>
        </div>
      </motion.div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-6 relative overflow-hidden">
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 rounded-xl font-semibold text-xs"
              >
                <AlertCircle size={16} />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-2">
            <div className="flex items-center gap-1.5 ml-1">
              <RefreshCcw size={14} className="text-indigo-650" />
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Nội dung câu hỏi</label>
            </div>
            <textarea 
              required
              rows={4}
              placeholder="Nhập nội dung mới..."
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 text-sm font-semibold text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 transition-all"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
            />
          </div>

          <div className="grid gap-4">
            {(['A', 'B', 'C', 'D'] as const).map((key) => (
              <div key={key} className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-150 dark:border-slate-700 flex items-center justify-center font-bold text-xs text-slate-400 transition-all">
                  {key}
                </div>
                <input 
                  required
                  type="text" 
                  placeholder={`Đáp án ${key}...`}
                  className={cn(
                    "w-full pl-16 pr-36 py-3 border rounded-xl focus:outline-none font-semibold text-xs transition-all",
                    correctAnswer === key 
                      ? "bg-slate-50/10 border-indigo-200 text-slate-900 dark:text-white" 
                      : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 focus:text-slate-900 focus:bg-white dark:focus:bg-slate-900"
                  )}
                  value={options[key]}
                  onChange={(e) => setOptions({ ...options, [key]: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setCorrectAnswer(key)}
                  className={cn(
                    "absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg border transition-all text-[10px] font-bold uppercase tracking-wider",
                    correctAnswer === key ? "bg-emerald-600 text-white border-transparent" : "bg-slate-50 dark:bg-slate-800 border-transparent text-slate-400 hover:text-slate-600"
                  )}
                >
                  {correctAnswer === key ? 'Đáp án đúng' : 'Đánh dấu đúng'}
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-4">
            <Link 
              to={`/subject/${subjectId}`}
              className="flex-1 px-5 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-xs text-center flex items-center justify-center transition-all"
            >
              Hủy bỏ
            </Link>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-bold uppercase tracking-wider text-xs shadow-sm flex items-center justify-center gap-1.5 active:scale-95 transition-all"
            >
              <Zap size={14} className="fill-white" />
              {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật câu hỏi'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
