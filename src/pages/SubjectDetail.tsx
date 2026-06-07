import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { quizService } from '../services/quizService';
import { Subject, Question } from '../types';
import { Play, Plus, ChevronLeft, Flag, Edit2, Pin, Sparkles, Activity, ArrowLeft } from 'lucide-react';
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

  if (loading) return null;

  if (!subject) return (
    <div className="text-center py-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl mx-auto px-4">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">Không tìm thấy môn học</h1>
      <Link to="/" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold text-xs tracking-wider inline-block">Trở lại trang chủ</Link>
    </div>
  );

  return (
    <div className="space-y-8 pb-24 max-w-5xl mx-auto px-4">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-6">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <Link to="/" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-all">
            <ArrowLeft size={14} />
            Quay lại trang chủ
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900 flex items-center justify-center text-3xl shrink-0">
              📖
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
                {subject.name}
              </h1>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 border border-indigo-100/40 dark:border-indigo-900/40">
                  <Activity size={12} />
                  <span className="text-[11px] font-bold uppercase tracking-wider">
                    {questions.length} câu hỏi
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border border-rose-100/45 dark:border-rose-900/40">
                  <Flag size={12} />
                  <span className="text-[11px] font-bold uppercase tracking-wider">
                    {flaggedIds.length} đã đánh dấu thi
                  </span>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-705">
                  <Sparkles size={12} />
                  <span className="text-[11px] font-bold uppercase tracking-wider">
                    Tạo ngày {new Date(subject.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-2.5 shrink-0"
        >
          {isAdminUI && (
            <Link 
              to={`/add/${id}`}
              className="flex items-center gap-1 px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-705 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 font-bold text-xs tracking-wider transition-all"
            >
              <Plus size={16} />
              Thêm câu hỏi
            </Link>
          )}
          <Link 
            to={`/quiz/${id}`}
            className={cn(
              "flex items-center gap-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl hover:scale-[1.02] active:scale-95 transition-all font-bold text-xs tracking-wider shadow-sm",
              questions.length === 0 && "opacity-30 cursor-not-allowed pointer-events-none"
            )}
          >
            <Play size={14} fill="currentColor" stroke="none" />
            Luyện tập trắc nghiệm
          </Link>
        </motion.div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center">
          <h2 className="text-base font-bold tracking-tight text-slate-800 dark:text-slate-200 uppercase flex items-center gap-2">
            <span className="w-1.5 h-4 bg-indigo-600 rounded-full inline-block" />
            Danh sách câu hỏi của môn học
          </h2>
          <div className="h-px flex-1 ml-6 bg-slate-100 dark:bg-slate-800" />
        </div>

        {questions.length > 0 ? (
          <div className="grid gap-4">
            {questions.map((q, index) => (
              <motion.div 
                key={q.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={cn(
                  "p-5 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-2xl transition-all shadow-sm flex flex-col md:flex-row items-stretch justify-between gap-6",
                  flaggedIds.includes(q.id) ? "border-rose-200 dark:border-rose-900 bg-rose-50/10 dark:bg-rose-950/5" : ""
                )}
              >
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded-md font-bold text-slate-500 uppercase tracking-wider">
                      Câu {index + 1}
                    </span>
                    {q.isNoted && (
                      <span className="text-[10px] bg-amber-50 dark:bg-amber-950 text-amber-650 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/50 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
                        Đánh dấu khó
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                    {q.questionText}
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(['A', 'B', 'C', 'D'] as const).map(opt => (
                      <div 
                        key={opt} 
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-xl border transition-all text-xs",
                          q.correctAnswer === opt 
                            ? "bg-indigo-50/40 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900" 
                            : "bg-slate-50/30 border-transparent opacity-80"
                        )}
                      >
                        <div className={cn(
                          "shrink-0 w-6 h-6 flex items-center justify-center rounded-lg border text-[10px] font-bold",
                          q.correctAnswer === opt 
                            ? "border-indigo-500 bg-indigo-600 text-white shadow-sm" 
                            : "border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-500"
                        )}>
                          {opt}
                        </div>
                        <span className={cn(
                          "font-semibold truncate",
                          q.correctAnswer === opt ? "text-slate-900 dark:text-white" : "text-slate-500"
                        )}>
                          {q[`option${opt}` as keyof Question]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {isAdminUI && (
                  <div className="flex md:flex-col gap-2 shrink-0 md:pl-5 md:border-l border-slate-100 dark:border-slate-850 justify-center">
                    <Link 
                      to={`/edit/${id}/${q.id}`}
                      className="flex-1 md:flex-initial w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-750 transition-all"
                      title="Chỉnh sửa câu hỏi"
                    >
                      <Edit2 size={16} />
                    </Link>
                    <button 
                      onClick={() => handleToggleNote(q)}
                      className={cn(
                        "flex-1 md:flex-initial w-10 h-10 flex items-center justify-center rounded-xl border transition-all",
                        q.isNoted 
                          ? "bg-amber-100 border-amber-300 dark:bg-amber-950/55 dark:border-amber-800 text-amber-700 dark:text-amber-400" 
                          : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600"
                      )}
                      title={q.isNoted ? "Bỏ đánh dấu khó" : "Ghim là câu hỏi khó"}
                    >
                      <Pin size={16} fill={q.isNoted ? "currentColor" : "none"} />
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="text-slate-400" size={28} />
            </div>
            <p className="text-slate-500 font-bold text-base mb-2">Môn học này hiện chưa có câu hỏi nào</p>
            <p className="text-slate-400 text-xs max-w-sm mx-auto mb-6">Bạn có thể tạo câu hỏi mới bằng bộ quét thông minh AI hoặc nhập tay thủ công.</p>
            {isAdminUI && (
              <Link 
                to={`/add/${id}`} 
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs tracking-wider inline-block shadow-sm"
              >
                Tạo câu hỏi đầu tiên
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
