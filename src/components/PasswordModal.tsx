import { useState } from 'react';
import { Shield, X, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (pass: string) => void;
}

export default function PasswordModal({ isOpen, onClose, onSubmit }: PasswordModalProps) {
  const [pass, setPass] = useState('');

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl w-full max-w-sm relative transition-colors shadow-xl"
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-400 hover:text-slate-650 rounded-lg transition-colors"
          >
            <X size={16} />
          </button>

          <div className="flex flex-col items-center text-center space-y-5">
            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/25 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center">
              <Shield size={24} />
            </div>
            
            <div className="space-y-1.5">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Xác thực Quyền quản trị</h2>
              <p className="text-xs text-slate-400">Vui lòng cung cấp mật khẩu để tiếp tục</p>
            </div>

            <div className="w-full relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                autoFocus
                type="password" 
                placeholder="Nhập mật khẩu..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 font-semibold text-center tracking-widest"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onSubmit(pass)}
              />
            </div>

            <button 
              onClick={() => onSubmit(pass)}
              className="w-full bg-indigo-600 hover:bg-indigo-750 text-white py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-sm"
            >
              Xác nhận
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
