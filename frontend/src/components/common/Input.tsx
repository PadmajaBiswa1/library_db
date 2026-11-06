import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-[11px] font-body font-semibold text-[#1A1523] mb-1">
          {label}
        </label>
      )}
      <div className="relative rounded-lg">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#5C5468]">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={`w-full rounded-lg border bg-white px-3 py-1.5 text-xs font-body text-[#1A1523] placeholder-[#5C5468]/50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#4E2478]/20 focus:border-[#4E2478] ${
            icon ? 'pl-9' : ''
          } ${
            error ? 'border-[#D6264C] focus:border-[#D6264C] focus:ring-[#D6264C]/20' : 'border-[#E3DEE9]'
          } ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs font-body text-[#D6264C]">{error}</p>}
    </div>
  );
};
