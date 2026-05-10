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
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-[#FDFCF0] border-4 border-black p-8 rounded-[32px] neo-brutal-shadow-lg w-full max-w-sm relative"
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X size={20} strokeWidth={3} />
          </button>

          <div className="flex flex-col items-center text-center space-y-6">
            <div className="w-16 h-16 bg-[#FFE66D] border-4 border-black rounded-2xl flex items-center justify-center neo-brutal-shadow-red animate-bounce">
              <Shield size={32} strokeWidth={3} />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-black uppercase tracking-tighter">Identity Check</h2>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none">Enter the master key (0305)</p>
            </div>

            <div className="w-full relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                autoFocus
                type="password" 
                placeholder="••••"
                className="w-full pl-12 pr-4 py-4 bg-white border-4 border-black rounded-2xl focus:outline-none font-black text-2xl tracking-[0.5em] text-center"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onSubmit(pass)}
              />
            </div>

            <button 
              onClick={() => onSubmit(pass)}
              className="w-full bg-[#4ECDC4] border-4 border-black py-4 rounded-2xl font-black uppercase tracking-widest text-sm neo-brutal-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
            >
              Unlock Terminal
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
