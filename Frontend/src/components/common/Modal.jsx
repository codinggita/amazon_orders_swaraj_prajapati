import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '../../utils/helpers';

export default function Modal({ show, onClose, title, size = 'md', children }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (show) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [show, onClose]);

  if (!show) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-6xl'
  };

  return createPortal(
    <div 
      className="fixed inset-0 z-50 backdrop-blur-sm bg-black/60 flex items-center justify-center p-4 transition-opacity"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={cn('bg-[#1c1112]/95 backdrop-blur-xl border border-red-900/50 rounded-2xl shadow-2xl shadow-red-950/50 w-full animate-scale-in flex flex-col', sizes[size])}>
        <div className="flex items-center justify-between p-5 border-b border-red-900/30">
          <h2 className="text-lg font-bold text-white">{title}</h2>
          <button onClick={onClose} className="rounded-lg hover:bg-red-950/50 p-1.5 text-red-400 hover:text-red-300 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
