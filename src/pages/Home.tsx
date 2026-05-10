import { useEffect, useState, FormEvent } from 'react';
import { quizService } from '../services/quizService';
import { Subject } from '../types';
import { Link } from 'react-router-dom';
import { Plus, Book, ChevronRight, Search, LayoutGrid, List, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { auth } from '../lib/firebase';

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
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-[var(--text-main)] uppercase tracking-tighter transition-colors">My Subjects</h1>
          {isAdminUI ? (
            <p className="text-sm font-bold text-[#FF6B6B]">Hello Master! You have full control.</p>
          ) : (
            <p className="text-sm font-bold text-gray-500">Practice your knowledge and track your progress.</p>
          )}
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search subjects..."
              className="pl-10 pr-4 py-2 bg-[var(--card-bg)] text-[var(--text-main)] border-4 border-black rounded-xl focus:outline-none w-full md:w-64 font-bold placeholder:[var(--text-muted)] transition-colors neo-brutal-shadow"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {isAdminUI && (
            <button 
              onClick={() => setIsAdding(!isAdding)}
              className="bg-[#FFE66D] border-4 border-black p-2 rounded-xl hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all neo-brutal-shadow"
              title="Add Subject"
            >
              <Plus size={24} strokeWidth={3} />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Link to="/quiz/noted-practice" className="p-4 bg-[#FF6B6B] border-4 border-black rounded-2xl neo-brutal-shadow text-white group hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
          <div className="flex justify-between items-start">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Focus Study</p>
            <Book size={16} />
          </div>
          <p className="text-xl font-black uppercase tracking-tighter">Noted Ques.</p>
          <div className="mt-2 flex items-center gap-2 text-[10px] font-bold">
            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
            Review Difficult Items
          </div>
        </Link>
        <div className="p-4 bg-[var(--card-bg)] border-4 border-black rounded-2xl neo-brutal-shadow-red group hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all transition-colors">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 group-hover:text-[#FF6B6B]">Subjects</p>
          <p className="text-3xl font-black text-[var(--text-main)]">{subjects.length}</p>
        </div>
        <div className="p-4 bg-[var(--card-bg)] border-4 border-black rounded-2xl neo-brutal-shadow-teal group hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all transition-colors">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 group-hover:text-[#4ECDC4]">Accuracy</p>
          <p className="text-3xl font-black text-[#4ECDC4]">78%</p>
        </div>
        <div className="p-4 bg-[var(--card-bg)] border-4 border-black rounded-2xl neo-brutal-shadow-yellow group hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all transition-colors text-[var(--text-main)]">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 group-hover:text-[#FFE66D]">Status</p>
          <div className="text-sm font-black uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            Ready
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.form 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onSubmit={handleCreateSubject}
            className="bg-[#4ECDC4] p-8 rounded-3xl border-4 border-black neo-brutal-shadow-lg flex flex-col sm:flex-row gap-4 items-end"
          >
            <div className="flex-1 w-full">
              <label className="block text-sm font-black uppercase text-black mb-2">Subject Name</label>
              <input 
                autoFocus
                type="text" 
                className="w-full px-4 py-3 bg-[var(--card-bg)] border-4 border-black rounded-xl focus:outline-none font-bold text-[var(--text-main)]"
                placeholder="e.g. JAVA SPRING BOOT"
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <button 
                type="button" 
                onClick={() => setIsAdding(false)}
                className="px-6 py-3 bg-[var(--card-bg)] border-4 border-black rounded-xl font-black uppercase text-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all neo-brutal-shadow"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="bg-[#FFE66D] border-4 border-black px-8 py-3 rounded-xl font-black uppercase text-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all neo-brutal-shadow"
              >
                Create
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2].map(i => (
            <div key={i} className="h-48 bg-gray-200 border-4 border-black rounded-3xl animate-pulse"></div>
          ))}
        </div>
      ) : filteredSubjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredSubjects.map((subject, idx) => {
            const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D'];
            const color = colors[idx % colors.length];
            return (
    <Link 
      key={subject.id} 
      to={`/subject/${subject.id}`}
      className="group bg-[var(--card-bg)] border-4 border-black rounded-3xl p-6 neo-brutal-shadow-lg hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex flex-col"
    >
      <div className="flex justify-between items-start mb-4">
        <div 
          className="w-10 h-10 border-2 border-black rounded-full flex items-center justify-center text-xl shadow-[2px_2px_0px_0px_#000]"
          style={{ backgroundColor: color }}
        >
          {idx % 2 === 0 ? '☕' : '🗄️'}
        </div>
        <div className="flex gap-2">
          {isAdminUI && (
            <button 
              onClick={(e) => {
                e.preventDefault();
                if (window.confirm('Delete subject and all questions?')) {
                  quizService.deleteSubject(subject.id).then(loadSubjects);
                }
              }}
              className="p-1 px-2 bg-[var(--card-bg)] border-2 border-black rounded-lg hover:bg-[#FF6B6B] hover:text-white dark:text-white transition-all shadow-[1px_1px_0px_0px_#000]"
            >
              <Trash2 size={14} strokeWidth={3} />
            </button>
          )}
          <span className="px-2 py-0.5 bg-gray-100 dark:bg-black/40 border-2 border-black rounded-full text-[8px] font-black uppercase dark:text-gray-400">
            Active
          </span>
        </div>
      </div>
      <h3 className="text-xl font-black mb-1 group-hover:text-[#FF6B6B] text-[var(--text-main)] transition-colors uppercase tracking-tighter">
        {subject.name}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 font-bold text-xs mb-4 flex-1">
        Master {subject.name}. Created {new Date(subject.createdAt).toLocaleDateString()}.
      </p>
      <div className="mt-auto flex gap-2">
        <div className="flex-1 py-1.5 bg-[#4ECDC4] border-2 border-black rounded-lg font-black text-center shadow-[2px_2px_0px_0px_#000] text-[10px] uppercase text-black">
          Open Library
        </div>
        <div className="p-1.5 border-2 border-black rounded-lg bg-[var(--card-bg)] text-[var(--text-main)] hover:bg-gray-50">
          <ChevronRight size={14} strokeWidth={3} />
        </div>
      </div>
    </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-[var(--card-bg)] border-4 border-black rounded-[40px] neo-brutal-shadow">
          <Book className="mx-auto text-gray-200 mb-6" size={64} />
          <h2 className="text-2xl font-black uppercase tracking-tighter">Empty Library</h2>
          <p className="text-gray-500 font-bold max-w-xs mx-auto mt-2">Time to add your first subject and start building your knowledge base!</p>
          {!auth.currentUser && (
            <div className="mt-6 inline-block bg-[#FF6B6B] border-2 border-black px-4 py-2 rounded-lg font-black text-white text-xs uppercase neo-brutal-shadow">
              Please sign in to begin
            </div>
          )}
        </div>
      )}
    </div>
  );
}
