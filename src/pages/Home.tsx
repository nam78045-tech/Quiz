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
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black text-[#1A1A1A] uppercase tracking-tighter mb-2">My Subjects</h1>
          {isAdminUI ? (
            <p className="text-lg font-bold text-[#FF6B6B]">Hello Master! You have full control.</p>
          ) : (
            <p className="text-lg font-bold text-gray-500">Practice your knowledge and track your progress.</p>
          )}
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search subjects..."
              className="pl-12 pr-4 py-3 bg-white border-4 border-black rounded-xl focus:outline-none w-full md:w-64 font-bold placeholder:text-gray-300 neo-brutal-shadow"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {isAdminUI && (
            <button 
              onClick={() => setIsAdding(!isAdding)}
              className="bg-[#FFE66D] border-4 border-black p-3 rounded-xl hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all neo-brutal-shadow"
              title="Add Subject"
            >
              <Plus size={28} strokeWidth={3} />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white border-4 border-black rounded-2xl neo-brutal-shadow-red group hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1 group-hover:text-[#FF6B6B]">Subjects</p>
          <p className="text-4xl font-black">{subjects.length}</p>
        </div>
        <div className="p-6 bg-white border-4 border-black rounded-2xl neo-brutal-shadow-teal group hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1 group-hover:text-[#4ECDC4]">Storage Used</p>
          <p className="text-4xl font-black text-[#4ECDC4]">0.2MB</p>
        </div>
        <div className="p-6 bg-white border-4 border-black rounded-2xl neo-brutal-shadow-yellow group hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1 group-hover:text-[#FFE66D]">Sync Status</p>
          <div className="text-xl font-black uppercase flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
            Online
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
                className="w-full px-4 py-3 bg-white border-4 border-black rounded-xl focus:outline-none font-bold"
                placeholder="e.g. JAVA SPRING BOOT"
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <button 
                type="button" 
                onClick={() => setIsAdding(false)}
                className="px-6 py-3 bg-white border-4 border-black rounded-xl font-black uppercase text-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all neo-brutal-shadow"
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
                className="group bg-white border-4 border-black rounded-3xl p-8 neo-brutal-shadow-lg hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex flex-col"
              >
                <div className="flex justify-between items-start mb-6">
                  <div 
                    className="w-14 h-14 border-2 border-black rounded-full flex items-center justify-center text-2xl shadow-[4px_4px_0px_0px_#000]"
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
                        className="p-2 bg-white border-2 border-black rounded-xl hover:bg-[#FF6B6B] hover:text-white transition-all shadow-[2px_2px_0px_0px_#000]"
                      >
                        <Trash2 size={16} strokeWidth={3} />
                      </button>
                    )}
                    <span className="px-3 py-1 bg-gray-100 border-2 border-black rounded-full text-[10px] font-black uppercase">
                      Active Course
                    </span>
                  </div>
                </div>
                <h3 className="text-3xl font-black mb-2 group-hover:text-[#FF6B6B] transition-colors uppercase tracking-tighter">
                  {subject.name}
                </h3>
                <p className="text-gray-500 font-bold text-sm mb-8 flex-1">
                  Master the fundamentals and advanced topics of {subject.name}. Created {new Date(subject.createdAt).toLocaleDateString()}.
                </p>
                <div className="mt-auto flex gap-3">
                  <div className="flex-1 py-3 bg-[#4ECDC4] border-2 border-black rounded-xl font-black text-center shadow-[4px_4px_0px_0px_#000] text-sm uppercase">
                    Open Library
                  </div>
                  <div className="p-3 border-2 border-black rounded-xl bg-white hover:bg-gray-50">
                    <ChevronRight size={20} strokeWidth={3} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-white border-4 border-black rounded-[40px] neo-brutal-shadow">
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
