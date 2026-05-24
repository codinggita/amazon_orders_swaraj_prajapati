import React from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '../../utils/helpers';

const Input = React.forwardRef(({ label, error, icon: Icon, rightIcon: RightIcon, type = 'text', className, ...rest }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="font-table-header text-[9px] tracking-[0.18em] text-red-400/50 block mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && <Icon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-red-400/50" />}
        <input
          ref={ref}
          type={type}
          className={cn(
            'w-full bg-[#0d0d0d] border rounded-lg h-11 text-white transition-all duration-200 focus:outline-none focus:ring-1',
            error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30' : 'border-[#2d1515] focus:border-red-600 focus:ring-red-600/30',
            Icon ? 'pl-11' : 'px-4',
            RightIcon ? 'pr-11' : 'pr-4',
            'font-body text-[13px] placeholder:text-red-900/40',
            className
          )}
          {...rest}
        />
        {RightIcon && <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-red-400/50 hover:text-red-300 cursor-pointer">{RightIcon}</div>}
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
