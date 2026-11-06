import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  title,
  subtitle,
  action,
}) => {
  return (
    <div className={`bg-white rounded-xl border border-[#E3DEE9] shadow-xs p-5 ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-[#E3DEE9]">
          <div>
            {title && <h3 className="font-heading font-semibold text-[#1A1523] text-sm tracking-tight">{title}</h3>}
            {subtitle && <p className="font-body text-xs text-[#5C5468] mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
