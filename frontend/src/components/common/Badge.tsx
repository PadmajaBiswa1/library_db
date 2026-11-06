import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'primary' | 'accent' | 'neutral';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'neutral' }) => {
  const variants = {
    success: 'bg-emerald-50 text-[#1C8A5C] border-emerald-200',
    warning: 'bg-amber-50 text-[#D98B16] border-amber-200',
    danger: 'bg-[#FDE2E7] text-[#D6264C] border-[#D6264C]/30',
    info: 'bg-sky-50 text-[#2563A6] border-sky-200',
    primary: 'bg-[#EDE4F5] text-[#4E2478] border-[#E3DEE9]',
    accent: 'bg-[#FDE2E7] text-[#F30137] border-[#F30137]/30',
    neutral: 'bg-slate-100 text-[#5C5468] border-[#E3DEE9]',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-body font-medium border ${variants[variant]}`}
    >
      {children}
    </span>
  );
};
