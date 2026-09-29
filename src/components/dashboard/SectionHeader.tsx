import React from 'react';

interface SectionHeaderProps {
  kicker?: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  badge?: React.ReactNode;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  kicker,
  title,
  subtitle,
  action,
  badge,
  className = ''
}) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-end justify-between gap-3 ${className}`}>
      <div>
        {kicker && (
          <div className="text-[10px] md:text-[11px] font-semibold tracking-wider uppercase text-[#87BAA4] mb-1">
            {kicker}
          </div>
        )}
        <div className="flex items-center gap-2.5">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#141618]">
            {title}
          </h2>
          {badge}
        </div>
        {subtitle && (
          <p className="text-xs md:text-sm text-[#6C726F] mt-1 max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {action && <div className="shrink-0 flex items-center gap-2">{action}</div>}
    </div>
  );
};
