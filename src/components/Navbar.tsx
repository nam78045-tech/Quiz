import { useState } from 'react';
import { User, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { Link } from 'react-router-dom';
import { LogIn, LogOut, BookOpen, User as UserIcon, Shield, ShieldAlert, Moon, Sun, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAdmin } from '../context/AdminContext';
import { useTheme } from '../context/ThemeContext';
import PasswordModal from './PasswordModal';

interface NavbarProps {
  user: User | null;
}

export default function Navbar({ user }: NavbarProps) {
  const { isAdminUI, unlockAdmin, lockAdmin } = useAdmin();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  const handleLogout = () => signOut(auth);

  const toggleAdmin = () => {
    if (isAdminUI) {
      lockAdmin();
    } else {
      setIsModalOpen(true);
    }
  };

  const handlePasswordSubmit = (pass: string) => {
    const success = unlockAdmin(pass);
    if (success) {
      setIsModalOpen(false);
    } else {
      alert('Wrong password! Access denied.');
    }
  };

  return (
    <nav className="sticky top-6 z-50 px-4 md:px-0">
      <PasswordModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handlePasswordSubmit} 
      />
      <div className="container mx-auto max-w-6xl">
        <div className="glass-card rounded-[32px] px-6 h-20 flex items-center justify-between border-white/20 shadow-2xl backdrop-blur-2xl">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-gradient-to-br from-violet-600 to-cyan-500 p-2.5 rounded-2xl text-white shadow-lg shadow-violet-500/20 group-hover:rotate-6 transition-transform">
              <Sparkles size={24} className="fill-white/20" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-2xl tracking-tighter text-white leading-none">
                QUIZ.<span className="text-cyan-400">APP</span>
              </span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-bold">The Knowledge Engine</span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
             {/* Admin Toggle */}
            <button 
              onClick={toggleAdmin}
              className={cn(
                "hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-2xl border transition-all font-bold uppercase text-[10px] tracking-widest",
                isAdminUI 
                  ? "bg-violet-500/20 border-violet-500/50 text-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.3)]" 
                  : "bg-white/5 border-white/10 text-slate-500 hover:text-white"
              )}
            >
              {isAdminUI ? <Shield size={16} /> : <ShieldAlert size={16} />}
              <span>{isAdminUI ? 'Admin Access' : 'Operator Mode'}</span>
            </button>

            <div className="h-8 w-px bg-white/10 mx-2 hidden sm:block" />

            {user ? (
              <div className="flex items-center gap-4">
                <div className="hidden lg:flex flex-col items-end">
                  <span className="text-xs font-black uppercase text-white tracking-wider">{user.displayName}</span>
                  <span className="text-[10px] font-bold text-slate-500">Explorer</span>
                </div>
                
                <div className="relative">
                   {user.photoURL ? (
                    <img src={user.photoURL} alt="profile" className="w-10 h-10 rounded-xl border border-white/20 p-0.5" />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/40 flex items-center justify-center text-violet-400">
                      <UserIcon size={20} />
                    </div>
                  )}
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-[#050510] rounded-full" />
                </div>

                <button 
                  onClick={handleLogout}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-500/40 transition-all"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="flex items-center gap-3 bg-white text-black px-6 py-3 rounded-2xl font-bold uppercase text-xs hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10"
              >
                <LogIn size={16} />
                Initiate Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
