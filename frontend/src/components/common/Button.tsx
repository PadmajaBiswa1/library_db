import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-body font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-[#4E2478] text-white hover:bg-[#38195A] focus:ring-[#4E2478]/30 shadow-xs',
    secondary: 'bg-[#EDE4F5] text-[#4E2478] hover:bg-[#dfd0ed] focus:ring-[#4E2478]/20',
    accent: 'bg-[#F30137] text-white hover:bg-[#C4012C] focus:ring-[#F30137]/30 shadow-xs',
    outline: 'border border-[#E3DEE9] bg-white text-[#1A1523] hover:bg-[#EDE4F5]/40 focus:ring-[#4E2478]/20',
    danger: 'bg-[#D6264C] text-white hover:bg-[#b01e3d] focus:ring-[#D6264C]/30 shadow-xs',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-xs px-3.5 py-2 gap-2',
    lg: 'text-sm px-5 py-2.5 gap-2.5',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}
      <span>{children}</span>
    </button>
  );
};
