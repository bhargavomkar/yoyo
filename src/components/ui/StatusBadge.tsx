import React from 'react';

type BadgeVariant = 
  | 'sage' 
  | 'neutral' 
  | 'warning' 
  | 'danger' 
  | 'info' 
  | 'success'
  | 'outline';

interface StatusBadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'xs' | 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'sm',
  dot = false,
  className = ''
}) => {
  const variantStyles: Record<BadgeVariant, { bg: string; text: string; dotColor: string; border: string }> = {
    sage: {
      bg: 'bg-[#BAD6CC]/25',
      text: 'text-[#2E5E4C]',
      dotColor: 'bg-[#87BAA4]',
      border: 'border-[#BAD6CC]/60'
    },
    neutral: {
      bg: 'bg-[#EDEDEB]/70',
      text: 'text-[#4A504D]',
      dotColor: 'bg-[#9AA19E]',
      border: 'border-[#EDEDEB]'
    },
    warning: {
      bg: 'bg-[#FEF3EB]',
      text: 'text-[#A05A20]',
      dotColor: 'bg-[#E58A38]',
      border: 'border-[#F8DCC4]'
    },
    danger: {
      bg: 'bg-[#FDECEB]',
      text: 'text-[#A5342C]',
      dotColor: 'bg-[#E5483D]',
      border: 'border-[#F8CDC9]'
    },
    info: {
      bg: 'bg-[#EBF2FA]',
      text: 'text-[#285786]',
      dotColor: 'bg-[#3E82C2]',
      border: 'border-[#CFE1F4]'
    },
    success: {
      bg: 'bg-[#EAF6EE]',
      text: 'text-[#23683C]',
      dotColor: 'bg-[#30A46C]',
      border: 'border-[#C8EAD2]'
    },
    outline: {
      bg: 'bg-transparent',
      text: 'text-[#656C68]',
      dotColor: 'bg-[#9AA19E]',
      border: 'border-[#EDEDEB]'
    }
  };

  const sizeStyles = {
    xs: 'text-[10px] px-1.5 py-0.5 font-medium tracking-wide',
    sm: 'text-[11px] px-2 py-0.5 font-medium tracking-wide',
    md: 'text-xs px-2.5 py-1 font-medium'
  };

  const dotSizes = {
    xs: 'w-1 h-1',
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2'
  };

  const style = variantStyles[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-[4px] border ${style.bg} ${style.text} ${style.border} ${sizeStyles[size]} ${className}`}
    >
      {dot && (
        <span className={`rounded-full shrink-0 ${dotSizes[size]} ${style.dotColor}`} />
      )}
      <span>{children}</span>
    </span>
  );
};
