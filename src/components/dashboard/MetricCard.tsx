import React from 'react';
import { FinancialMetric } from '@/types';
import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';

interface MetricCardProps {
  metric: FinancialMetric;
  className?: string;
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  metric,
  className = '',
  onClick
}) => {
  const { label, value, delta, subtext, sparkline } = metric;

  // Render a minimal SVG sparkline
  const renderSparkline = () => {
    if (!sparkline || sparkline.length < 2) return null;
    const min = Math.min(...sparkline);
    const max = Math.max(...sparkline);
    const range = max - min || 1;
    const width = 64;
    const height = 24;

    const points = sparkline
      .map((val, idx) => {
        const x = (idx / (sparkline.length - 1)) * width;
        const y = height - ((val - min) / range) * (height - 6) - 3;
        return `${x},${y}`;
      })
      .join(' ');

    const strokeColor = delta?.isPositive !== false ? '#87BAA4' : '#9AA19E';

    return (
      <svg width={width} height={height} className="overflow-visible shrink-0 opacity-80">
        <polyline
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    );
  };

  return (
    <div
      onClick={onClick}
      className={`group relative bg-white border border-[#EDEDEB] rounded-lg p-4 transition-all duration-150 hover:border-[#87BAA4]/50 hover:shadow-xs ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-[11.5px] font-medium tracking-wide text-[#737A77]">
          {label}
        </span>
        {renderSparkline()}
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <div className="text-2xl font-bold tracking-tight text-[#141618] tabular-nums">
          {value}
        </div>
      </div>

      <div className="mt-2.5 pt-2 border-t border-[#EDEDEB]/50 flex items-center justify-between text-[11px]">
        {delta ? (
          <div className="flex items-center gap-1.5 font-medium">
            <span
              className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10.5px] ${
                delta.isPositive
                  ? 'bg-[#EBF5F1] text-[#245241]'
                  : 'bg-[#EDEDEB]/70 text-[#555C58]'
              }`}
            >
              {delta.isPositive ? (
                <ArrowUpRight className="w-3 h-3 text-[#3E7C66]" />
              ) : (
                <ArrowDownRight className="w-3 h-3 text-[#7B827E]" />
              )}
              {delta.value}
            </span>
            <span className="text-[#8C9390] text-[10px] hidden sm:inline">
              {delta.period}
            </span>
          </div>
        ) : (
          <span className="text-[#8C9390] text-[10px] truncate max-w-full">
            {subtext}
          </span>
        )}

        {delta && subtext && (
          <span className="text-[#9AA19E] text-[10px] truncate ml-auto hidden xl:inline">
            {subtext}
          </span>
        )}
      </div>
    </div>
  );
};
