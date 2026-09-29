import React from 'react';

interface FaroLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const FaroLogo: React.FC<FaroLogoProps> = ({ 
  className = '', 
  size = 'md',
  showText = true 
}) => {
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-7 h-7'
  };

  const textSizes = {
    sm: 'text-base font-semibold tracking-tight',
    md: 'text-[1.25rem] font-bold tracking-tight',
    lg: 'text-2xl font-bold tracking-tight'
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Institutional Faro Arrow Icon */}
      <div className={`flex items-center justify-center text-neutral-900 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5`}>
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.75" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className={`${iconSizes[size]} text-black`}
        >
          <line x1="7" y1="17" x2="17" y2="7"></line>
          <polyline points="7 7 17 7 17 17"></polyline>
        </svg>
      </div>

      {showText && (
        <span className={`${textSizes[size]} text-[#111315] font-sans lowercase`}>
          faro
        </span>
      )}
    </div>
  );
};
