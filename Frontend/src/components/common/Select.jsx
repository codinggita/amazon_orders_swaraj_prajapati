import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Select({ 
  options, 
  value, 
  onChange, 
  placeholder = 'Select an option', 
  className = '',
  name
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => {
    const optValue = typeof opt === 'object' ? opt.value : opt;
    return optValue === value;
  });
  
  const displayValue = selectedOption 
    ? (typeof selectedOption === 'object' ? selectedOption.label : selectedOption) 
    : placeholder;

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <div 
        className="w-full bg-[#1c1112]/80 backdrop-blur-md border border-[#2d1515] rounded-lg h-10 px-3 flex items-center justify-between text-sm text-white cursor-pointer hover:border-red-600/50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={selectedOption ? 'text-white' : 'text-red-300/40'}>{displayValue}</span>
        <ChevronDown className={`w-4 h-4 text-red-400/50 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-1 bg-[#110a0a]/95 backdrop-blur-xl border border-red-900/30 rounded-lg shadow-2xl overflow-hidden"
          >
            <div className="max-h-60 overflow-y-auto custom-scrollbar p-1">
              {options.map((option, idx) => {
                const optionValue = typeof option === 'object' ? option.value : option;
                const optionLabel = typeof option === 'object' ? option.label : option;
                const isSelected = value === optionValue;
                
                return (
                  <div
                    key={idx}
                    className={`flex items-center justify-between px-3 py-2 text-sm rounded-md cursor-pointer transition-colors ${
                      isSelected 
                        ? 'bg-red-950/40 text-red-300' 
                        : 'text-red-100/80 hover:bg-[#2d1515]/80 hover:text-white'
                    }`}
                    onClick={() => {
                      if (onChange) {
                        onChange({ target: { name, value: optionValue } });
                      }
                      setIsOpen(false);
                    }}
                  >
                    <span>{optionLabel}</span>
                    {isSelected && <Check className="w-3 h-3 text-red-400" />}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
