import { useState } from 'react';
import { User, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { Link } from 'react-router-dom';
import { LogIn, LogOut, User as UserIcon, Shield, ShieldAlert } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAdmin } from '../context/AdminContext';
import PasswordModal from './PasswordModal';

interface NavbarProps {
  user: User | null;
}

export default function Navbar({ user }: NavbarProps) {
  const { isAdminUI, unlockAdmin, lockAdmin } = useAdmin();
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
      alert('Mật khẩu không chính xác!');
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-4 px-4">
      <PasswordModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handlePasswordSubmit} 
      />
      <div className="container mx-auto max-w-5xl flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-indigo-600 p-2 rounded-xl text-white">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tight text-slate-950 dark:text-white leading-none">
              QUIZ<span className="text-indigo-600">APP</span>
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Hệ thống Trắc nghiệm</span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          {/* Admin Toggle */}
          <button 
            onClick={toggleAdmin}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all",
              isAdminUI 
                ? "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400" 
                : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100"
            )}
          >
            {isAdminUI ? <Shield size={14} className="text-red-500" /> : <ShieldAlert size={14} />}
            <span>{isAdminUI ? 'Quản trị viên' : 'Chế độ thi'}</span>
          </button>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1" />

          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{user.displayName}</span>
                <span className="text-[10px] text-slate-500">{isAdminUI ? 'Admin' : 'Học viên'}</span>
              </div>
              
              <div className="relative shrink-0">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="avatar" className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                    <UserIcon size={16} />
                  </div>
                )}
              </div>

              <button 
                onClick={handleLogout}
                className="p-2 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-950/25 hover:text-red-500 transition-all"
                title="Đăng xuất"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogin}
              className="flex items-center gap-1.5 bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-xl font-semibold text-xs active:scale-95 transition-all shadow-sm"
            >
              <LogIn size={13} />
              Đăng nhập
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
