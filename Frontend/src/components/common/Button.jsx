import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/helpers';

const Button = React.forwardRef(({ variant = 'primary', size = 'md', loading, disabled, icon: Icon, children, className, ...rest }, ref) => {
  const baseClasses = 'inline-flex items-center justify-center gap-2 rounded-lg font-btn transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/40 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-brand-600 text-white hover:bg-brand-700 shadow-lg shadow-red-900/20',
    secondary: 'bg-brand-900/60 border border-brand-800 text-brand-300 hover:bg-brand-900/80',
    danger: 'bg-red-700 text-white hover:bg-red-800',
    ghost: 'hover:bg-red-950/40 text-red-300',
    outline: 'border border-red-700 text-red-400 hover:bg-red-950/30'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      {...rest}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;
