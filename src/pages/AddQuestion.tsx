import { useState, FormEvent } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { quizService } from '../services/quizService';
import { ChevronLeft, Save, AlertCircle, Zap, ArrowLeft, FileText, Terminal, Layers } from 'lucide-react';
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
    
    // Quick delay for smoother UI feedback
    await new Promise(r => setTimeout(r, 150));

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
        setError('Sai định dạng: Định dạng văn bản quét yêu cầu đầy đủ đáp án A), B), C), D)');
      }
    }
    setIsParsing(false);
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!id || !questionText || !options.A || !options.B || !options.C || !options.D) {
      setError('Lỗi: Hãy điền đầy đủ nội dung câu hỏi và các lựa chọn đáp án.');
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
      setError('Lỗi kết nối: Không thể gửi câu hỏi lên cơ sở dữ liệu.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-24 px-4">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <Link to={`/subject/${id}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-500 hover:text-indigo-650 transition-all">
          <ArrowLeft size={14} />
          Quay lại môn học
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            Thêm câu hỏi trắc nghiệm
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Khởi tạo các câu hỏi mới vào kho dữ liệu môn học. Bạn có thể dán nội dung thô để tự động phân tích bóc tách hoặc điền tay thủ công.
          </p>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-[1fr,1.1fr] gap-8 items-start">
        {/* Parser Panel */}
        <motion.section 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm relative group"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                <FileText size={18} />
              </div>
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">Tự động bóc tách</h2>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest mt-0.5">Phân tích theo quy tắc</p>
              </div>
            </div>
            <button 
              type="button"
              onClick={parseText}
              disabled={isParsing || !rawText}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all shadow-sm active:scale-95 disabled:opacity-30",
                isParsing ? "bg-slate-100 text-slate-400" : "bg-cyan-600 hover:bg-cyan-700 text-white"
              )}
            >
              {isParsing ? 'Đang phân tích...' : 'Bóc tách nhanh'}
            </button>
          </div>
          
          <div className="relative">
            <textarea 
              placeholder="Dán nội dung thô ở đây. Ví dụ:
Nước nào có diện tích lớn nhất thế giới?
A) Nga
B) Canada
C) Mỹ
D) Trung Quốc"
              rows={12}
              className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-cyan-500 text-slate-900 dark:text-white font-mono text-xs leading-relaxed"
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
            />
          </div>
          
          <div className="mt-4 flex items-center gap-2 text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
            <p>Hỗ trợ cấu trúc định dạng: Q &rarr; A) B) C) D)</p>
          </div>
        </motion.section>

        {/* Manual Configuration */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-2 px-1">
            <Layers size={16} className="text-indigo-600" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-750 dark:text-slate-300">Biểu mẫu câu hỏi</h2>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-6">
              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-2 p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 rounded-xl font-semibold text-xs"
                  >
                    <AlertCircle size={16} />
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Nội dung câu hỏi</label>
                <textarea 
                  required
                  rows={4}
                  placeholder="Nhập nội dung câu hỏi trắc nghiệm của bạn..."
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 text-sm font-semibold text-slate-905 dark:text-white"
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                />
              </div>

              <div className="grid gap-4">
                {(['A', 'B', 'C', 'D'] as const).map((key) => (
                  <div key={key} className="space-y-1.5 group">
                    <div className="flex items-center justify-between px-1">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 transition-colors group-focus-within:text-indigo-600">Lựa chọn {key}</label>
                      <button
                        type="button"
                        onClick={() => setCorrectAnswer(key)}
                        className={cn(
                          "px-3 py-1 rounded-lg border transition-all text-[10px] font-bold uppercase tracking-wider",
                          correctAnswer === key ? "bg-emerald-600 text-white border-emerald-55F shadow-none" : "bg-slate-50 dark:bg-slate-800 border-transparent text-slate-500 hover:text-slate-700"
                        )}
                      >
                        {correctAnswer === key ? 'Đáp án đúng' : 'Chọn làm đáp án đúng'}
                      </button>
                    </div>
                    <input 
                      required
                      type="text" 
                      placeholder={`Nhập đáp án lựa chọn ${key}...`}
                      className={cn(
                        "w-full px-4 py-2.5 border rounded-xl focus:outline-none text-xs font-semibold",
                        correctAnswer === key 
                          ? "bg-emerald-50/10 dark:bg-emerald-950/10 border-emerald-5D0 text-slate-900 dark:text-white" 
                          : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-705 text-slate-600 dark:text-slate-300 focus:text-slate-900"
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
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-bold uppercase tracking-wider text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-30"
              >
                <Zap size={14} className="fill-white" />
                {isSubmitting ? 'Đang lưu trữ dữ liệu...' : 'Lưu câu hỏi mới'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
