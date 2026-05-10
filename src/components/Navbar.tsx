import { useState } from 'react';
import { User, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { Link } from 'react-router-dom';
import { LogIn, LogOut, BookOpen, User as UserIcon, Shield, ShieldAlert, Moon, Sun } from 'lucide-react';
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
    <nav className="bg-[var(--card-bg)] border-b-4 border-black sticky top-0 z-50 transition-colors duration-300">
      <PasswordModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handlePasswordSubmit} 
      />
      <div className="container mx-auto px-4 h-20 flex items-center justify-between max-w-5xl">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="bg-[#FF6B6B] p-2 border-2 border-black rounded-lg text-white neo-brutal-shadow group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:shadow-none transition-all">
            <BookOpen size={24} />
          </div>
          <span className="font-black text-2xl uppercase tracking-tighter text-[var(--text-main)]">
            Quiz.<span className="text-[#FF6B6B]">App</span>
          </span>
        </Link>

        <div className="flex items-center gap-4 sm:gap-6">
          <button 
            onClick={toggleDarkMode}
            className="p-2 border-2 border-black rounded-xl bg-[var(--card-bg)] text-[var(--text-main)] neo-brutal-shadow transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button 
            onClick={toggleAdmin}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-xl border-2 border-black transition-all font-black uppercase text-[10px] tracking-tighter neo-brutal-shadow",
              isAdminUI 
                ? "bg-[#4ECDC4] text-black" 
                : "bg-white dark:bg-[#2D2D2D] text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white"
            )}
          >
            {isAdminUI ? <Shield size={16} /> : <ShieldAlert size={16} />}
            <span className="hidden sm:inline">{isAdminUI ? 'Admin ON' : 'Admin Mode'}</span>
          </button>

          {user ? (
            <div className="flex items-center gap-4">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-black uppercase text-[var(--text-main)]">{user.displayName}</span>
                <span className="text-xs font-bold text-gray-500">{user.email}</span>
              </div>
              <div className="relative group">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="profile" className="w-10 h-10 rounded-full border-2 border-black neo-brutal-shadow" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#4ECDC4] border-2 border-black flex items-center justify-center text-white neo-brutal-shadow">
                    <UserIcon size={20} />
                  </div>
                )}
              </div>
              <button 
                onClick={handleLogout}
                className="bg-[var(--card-bg)] border-2 border-black p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 neo-brutal-shadow-red transition-all"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogin}
              className="flex items-center gap-2 bg-[#FFE66D] border-2 border-black px-5 py-2.5 rounded-xl font-black uppercase text-sm neo-brutal-shadow hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
            >
              <LogIn size={18} />
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
