import { useEffect, useState, FormEvent } from 'react';
import { quizService } from '../services/quizService';
import { Subject } from '../types';
import { Link } from 'react-router-dom';
import { Plus, Search, Trash2, ArrowRight, BookOpen, Clock, Bookmark, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useAdmin } from '../context/AdminContext';

export default function Home() {
  const { isAdminUI } = useAdmin();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    const data = await quizService.getSubjects();
    setSubjects(data);
    setLoading(false);
  };

  const handleCreateSubject = async (e: FormEvent) => {
    e.preventDefault();
    if (!newSubjectName.trim()) return;
    
    await quizService.addSubject(newSubjectName);
    setNewSubjectName('');
    setIsAdding(false);
    loadSubjects();
  };

  const filteredSubjects = subjects.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-12 pb-24 max-w-5xl mx-auto px-4">
      {/* Hero Section */}
      <section className="pt-12 pb-4 text-left">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/35 border border-indigo-100 dark:border-indigo-900 text-indigo-600 dark:text-indigo-400 text-xs font-semibold tracking-wide">
            Hệ thống đang trực tuyến
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            Nền tảng Ôn tập <br />
            <span className="text-indigo-600 dark:text-indigo-400">Trắc nghiệm Tối giản</span>
          </h1>
          
          <p className="text-base text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
            Học tập hiệu quả và thông minh. Tìm kiếm môn học, ôn tập ngân hàng câu hỏi, đánh dấu các điểm kiến thức quan trọng và thử sức với chế độ thi thử ngay lập tức.
          </p>
          
          <div className="flex flex-wrap gap-4 items-center pt-4">
            <div className="relative group min-w-[280px] flex-1 max-w-md">
              <div className="absolute inset-y-0 left-4 flex items-center text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                <Search size={18} />
              </div>
              <input 
                type="text" 
                placeholder="Tìm kiếm môn học..."
                className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950 text-sm font-medium transition-all text-slate-900 dark:text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {isAdminUI && (
              <button 
                onClick={() => setIsAdding(!isAdding)}
                className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-bold text-xs tracking-wider transition-all shadow-sm active:scale-95"
              >
                <Plus size={16} />
                Thêm môn học
              </button>
            )}
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Tổng số môn học', value: `${subjects.length} bộ đề`, icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-950/20' },
          { label: 'Trạng thái ôn tập', value: 'Tính năng cốt lõi', icon: Clock, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/20' },
          { label: 'Câu hỏi đánh dấu', value: 'Ghi nhớ nhanh', icon: Bookmark, color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-950/20' },
          { label: 'Cấu trúc hệ thống', value: 'Đáp ứng & Đơn giản', icon: Layers, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/20' },
        ].map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * idx }}
            className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl flex items-center gap-4 shadow-sm"
          >
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", stat.bg, stat.color)}>
              <stat.icon size={20} />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">{stat.label}</p>
              <p className="text-lg font-bold text-slate-800 dark:text-slate-200">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.form 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onSubmit={handleCreateSubject}
            className="p-6 bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900/50 rounded-2xl flex flex-col md:flex-row gap-4 items-end shadow-sm"
          >
            <div className="flex-1 w-full">
              <label className="block text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-2 ml-1">
                Tạo môn học mới
              </label>
              <input 
                autoFocus
                type="text" 
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 text-base font-semibold text-slate-900 dark:text-white"
                placeholder="Nhập tên môn học cần tạo..."
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto shrink-0">
              <button 
                type="button" 
                onClick={() => setIsAdding(false)}
                className="flex-1 md:flex-none px-5 py-3 rounded-xl font-bold text-xs border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
              >
                Hủy bỏ
              </button>
              <button 
                type="submit" 
                className="flex-1 md:flex-none bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold text-xs transition-all shadow-sm"
              >
                Tạo mới
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 tracking-tight uppercase flex items-center gap-2">
            <span className="w-1.5 h-4 bg-indigo-600 rounded-full inline-block" />
            Danh sách môn học
          </h2>
          <div className="h-px flex-1 mx-6 bg-slate-100 dark:bg-slate-800" />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-44 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse border border-slate-200 dark:border-slate-700" />
            ))}
          </div>
        ) : filteredSubjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSubjects.map((subject, idx) => (
              <motion.div
                key={subject.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
              >
                <Link 
                  to={`/subject/${subject.id}`}
                  className="group relative block p-6 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-2xl shadow-sm transition-all flex flex-col h-full justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-xl">
                        {idx % 3 === 0 ? '📚' : idx % 3 === 1 ? '✏️' : '⏱️'}
                      </div>
                      {isAdminUI && (
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            if (window.confirm('Bạn có chắc chắn muốn xóa môn học này không? Tất cả câu hỏi đi kèm cũng sẽ bị xóa.')) {
                              quizService.deleteSubject(subject.id).then(loadSubjects);
                            }
                          }}
                          className="p-2 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg text-slate-400 hover:text-red-500 transition-all border border-transparent hover:border-red-100 dark:hover:border-red-900"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors tracking-tight mb-2">
                      {subject.name}
                    </h3>
                    <p className="text-slate-450 text-xs dark:text-slate-400 font-medium leading-relaxed mb-6">
                      Nhấn để quản lý, chỉnh sửa ngân hàng đề thi câu hỏi và bắt đầu chế độ ôn luyện cho môn {subject.name}.
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    <span>Vào học môn này</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-2xl shadow-sm">
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="text-slate-400" size={28} />
            </div>
            <h2 className="text-xl font-bold text-slate-700 dark:text-slate-300">Không tìm thấy môn học nào</h2>
            <p className="text-slate-400 text-xs mt-1 max-w-sm mx-auto mb-6">Thư viện hiện đang trống hoặc từ khóa tìm kiếm không chính xác.</p>
            {isAdminUI && (
              <button 
                onClick={() => setIsAdding(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs tracking-wider transition-all shadow-sm"
              >
                Khởi tạo ngay môn học đầu tiên
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
