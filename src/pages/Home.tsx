import { useEffect, useState, FormEvent } from 'react';
import { quizService } from '../services/quizService';
import { Subject } from '../types';
import { Link } from 'react-router-dom';
import { Plus, Book, ChevronRight, Search, Zap, Star, Trophy, Trash2, ArrowRight, Sparkles, Orbit } from 'lucide-react';
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
    <div className="space-y-24 pb-32">
      {/* Hero Section */}
      <section className="relative pt-20 pb-12 text-center md:text-left">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl relative z-10"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[10px] font-black uppercase tracking-[0.3em] mb-10 glow-border"
          >
            <Sparkles size={14} className="fill-violet-400" />
            Neural Network Online
          </motion.div>
          
          <h1 className="text-6xl md:text-8xl font-extrabold mb-10 tracking-tighter leading-[0.9] text-white">
            <span className="text-gradient">Elevate Your</span> <br />
            <span className="text-gradient-cosmic glow-text">Cognitive Core</span>
          </h1>
          
          <p className="text-xl text-slate-400 font-medium max-w-2xl leading-relaxed mb-12">
            The ultimate knowledge fusion environment. Navigate through diverse constellations of information, master neural patterns, and reach stellar enlightenment.
          </p>
          
          <div className="flex flex-wrap gap-6 items-center justify-center md:justify-start">
            <div className="relative group min-w-[320px]">
              <div className="absolute inset-y-0 left-6 flex items-center text-slate-500 group-focus-within:text-cyan-400 transition-colors">
                <Search size={22} />
              </div>
              <input 
                type="text" 
                placeholder="Scan knowledge markers..."
                className="w-full pl-16 pr-8 py-6 bg-white/[0.02] border border-white/[0.05] rounded-[28px] focus:outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/5 font-bold text-lg text-white transition-all backdrop-blur-3xl placeholder:text-slate-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {isAdminUI && (
              <button 
                onClick={() => setIsAdding(!isAdding)}
                className="btn-shine flex items-center gap-3 bg-white text-black px-10 py-6 rounded-[28px] font-black uppercase text-xs tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-[0_0_50px_rgba(255,255,255,0.2)]"
              >
                <Plus size={20} strokeWidth={3} />
                Deploy Sector
              </button>
            )}
          </div>
        </motion.div>

        {/* Decorative element */}
        <div className="absolute right-0 top-0 w-1/3 h-full overflow-hidden pointer-events-none hidden lg:block">
           <motion.div 
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{ 
              rotate: { duration: 60, repeat: Infinity, ease: "linear" },
              scale: { duration: 10, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute top-0 right-[-10%] w-[600px] h-[600px] border border-violet-500/20 rounded-full flex items-center justify-center"
           >
              <div className="w-[80%] h-[80%] border border-cyan-500/10 rounded-full" />
              <div className="w-[60%] h-[60%] border border-violet-500/10 rounded-full" />
              <div className="absolute top-1/2 left-0 w-4 h-4 bg-violet-500 rounded-full blur-[4px] shadow-[0_0_20px_#8B5CF6]" />
           </motion.div>
        </div>
      </section>

      {/* Modern Dashboard Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Intelligence Core', value: `${subjects.length} Sectors`, icon: Book, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
          { label: 'Neural Sync', value: '94.2%', icon: Zap, color: 'text-violet-400', bg: 'bg-violet-500/10' },
          { label: 'Stellar Run', value: '12 Units', icon: Star, color: 'text-rose-400', bg: 'bg-rose-500/10' },
          { label: 'Galactic Rank', value: '#1,248', icon: Trophy, color: 'text-amber-400', bg: 'bg-amber-500/10' },
        ].map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * idx }}
            className="group glass-card p-8 rounded-[40px] relative overflow-hidden"
          >
            <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br from-white/[0.03] to-transparent")} />
            <div className="relative z-10 flex flex-col gap-6">
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center border border-white/5 shadow-inner", stat.bg, stat.color)}>
                <stat.icon size={28} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">{stat.label}</p>
                <p className="text-3xl font-extrabold text-white tracking-tighter">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.form 
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.95 }}
            onSubmit={handleCreateSubject}
            className="glass-card p-12 rounded-[56px] border-violet-500/30 flex flex-col md:flex-row gap-8 items-end relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 blur-[100px] rounded-full group-hover:bg-violet-500/20 transition-all duration-700" />
            <div className="flex-1 w-full relative z-10">
              <label className="block text-[10px] font-black uppercase text-violet-400 tracking-[0.4em] mb-5 ml-4">Sector Initialization Protocol</label>
              <input 
                autoFocus
                type="text" 
                className="w-full px-10 py-6 bg-black/40 border border-white/5 rounded-[32px] focus:outline-none focus:border-violet-500/50 text-2xl font-bold text-white placeholder:text-slate-800 transition-all focus:bg-black/60 shadow-inner"
                placeholder="Declare Subject Designation..."
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
              />
            </div>
            <div className="flex gap-4 relative z-10 w-full md:w-auto">
              <button 
                type="button" 
                onClick={() => setIsAdding(false)}
                className="flex-1 md:flex-none px-10 py-6 rounded-[32px] font-black uppercase text-xs tracking-widest border border-white/5 hover:bg-white/5 transition-all text-slate-500 hover:text-white"
              >
                Abort
              </button>
              <button 
                type="submit" 
                className="btn-shine flex-1 md:flex-none bg-white text-black px-12 py-6 rounded-[32px] font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl"
              >
                Launch
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="space-y-12">
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Orbit className="text-cyan-400 animate-[spin_10s_linear_infinite]" size={24} />
            <h2 className="text-xl font-black tracking-[0.4em] text-white uppercase glow-text">Knowledge Galaxy</h2>
          </div>
          <div className="h-px flex-1 mx-12 bg-gradient-to-r from-white/10 via-white/5 to-transparent" />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-80 glass-card rounded-[48px] animate-pulse" />
            ))}
          </div>
        ) : filteredSubjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredSubjects.map((subject, idx) => (
              <motion.div
                key={subject.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
              >
                <Link 
                  to={`/subject/${subject.id}`}
                  className="group relative block glass-card glass-card-hover p-10 rounded-[64px] h-full flex flex-col overflow-hidden"
                >
                  {/* Decorative background glow */}
                  <div className={cn(
                    "absolute -top-20 -right-20 w-40 h-40 blur-[80px] rounded-full transition-all duration-700 opacity-20",
                    idx % 3 === 0 ? "bg-violet-500" : idx % 3 === 1 ? "bg-cyan-500" : "bg-rose-500"
                  )} />

                  <div className="flex justify-between items-start mb-12 relative z-10">
                    <div className="w-20 h-20 rounded-[32px] bg-gradient-to-br from-white/5 to-transparent border border-white/5 flex items-center justify-center text-4xl shadow-inner group-hover:rotate-[15deg] transition-all duration-500">
                      {idx % 3 === 0 ? '🪐' : idx % 3 === 1 ? '☄️' : '🛸'}
                    </div>
                    {isAdminUI && (
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          if (window.confirm('Erase this knowledge constellation?')) {
                            quizService.deleteSubject(subject.id).then(loadSubjects);
                          }
                        }}
                        className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-rose-600 group/del transition-all"
                      >
                        <Trash2 size={18} className="text-slate-600 group-hover/del:text-white" />
                      </button>
                    )}
                  </div>
                  
                  <div className="flex-1 relative z-10">
                    <h3 className="text-3xl font-extrabold mb-4 group-hover:text-cyan-400 transition-colors tracking-tighter text-white">
                      {subject.name}
                    </h3>
                    <p className="text-slate-500 font-medium text-sm leading-relaxed mb-10 overflow-hidden line-clamp-3">
                      Initialize deep-learning protocol for {subject.name}. Journey log started {new Date(subject.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}.
                    </p>
                  </div>

                  <div className="mt-auto pt-8 border-t border-white/[0.03] flex items-center justify-between relative z-10">
                    <span className="text-[10px] font-black text-violet-400 uppercase tracking-[0.3em] group-hover:translate-x-2 transition-transform duration-500">Engage Sector</span>
                    <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-500">
                      <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-40 glass-card rounded-[80px]"
          >
            <div className="relative inline-block mb-12">
              <div className="w-32 h-32 bg-slate-500/5 rounded-full flex items-center justify-center">
                <Book className="text-slate-800" size={64} />
              </div>
              <motion.div 
                animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.4, 1] }}
                transition={{ repeat: Infinity, duration: 4 }}
                className="absolute inset-0 bg-cyan-500/20 blur-3xl rounded-full" 
              />
            </div>
            <h2 className="text-4xl font-extrabold tracking-tighter mb-4 text-white">Quiet Galaxy</h2>
            <p className="text-slate-600 font-medium max-w-sm mx-auto mb-12">Your personal library is waiting to be filled with stars of knowledge.</p>
            {isAdminUI && (
              <button 
                onClick={() => setIsAdding(true)}
                className="btn-shine bg-white text-black px-12 py-7 rounded-[32px] font-black uppercase text-xs tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-2xl"
              >
                Launch First Station
              </button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
