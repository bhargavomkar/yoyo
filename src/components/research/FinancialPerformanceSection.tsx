'use client';

import React, { useState } from 'react';
import { FinancialYearData } from '@/types/research';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';

interface FinancialPerformanceSectionProps {
  history: FinancialYearData[];
}

type Timeframe = '1Y' | '3Y' | '5Y' | '10Y';
type MetricKey = 'revenue' | 'ebitda' | 'netIncome' | 'freeCashFlow' | 'eps' | 'grossMargin';

export const FinancialPerformanceSection: React.FC<FinancialPerformanceSectionProps> = ({
  history
}) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('5Y');
  const [activeMetrics, setActiveMetrics] = useState<Record<MetricKey, boolean>>({
    revenue: true,
    ebitda: true,
    netIncome: false,
    freeCashFlow: true,
    eps: false,
    grossMargin: false
  });

  const toggleMetric = (metric: MetricKey) => {
    setActiveMetrics((prev) => ({
      ...prev,
      [metric]: !prev[metric]
    }));
  };

  // Filter based on timeframe
  const filteredData = React.useMemo(() => {
    if (timeframe === '1Y') return history.slice(-2);
    if (timeframe === '3Y') return history.slice(-3);
    return history;
  }, [history, timeframe]);

  const METRIC_CONFIG: Record<
    MetricKey,
    { label: string; color: string; type: 'bar' | 'line'; yAxisId: 'left' | 'right'; format: (v: number) => string }
  > = {
    revenue: {
      label: 'Revenue ($M)',
      color: '#87BAA4',
      type: 'bar',
      yAxisId: 'left',
      format: (v) => `$${v.toLocaleString()}M`
    },
    ebitda: {
      label: 'EBITDA ($M)',
      color: '#556B60',
      type: 'bar',
      yAxisId: 'left',
      format: (v) => `$${v.toLocaleString()}M`
    },
    freeCashFlow: {
      label: 'Free Cash Flow ($M)',
      color: '#BAD6CC',
      type: 'bar',
      yAxisId: 'left',
      format: (v) => `$${v.toLocaleString()}M`
    },
    netIncome: {
      label: 'Net Income ($M)',
      color: '#9AA19E',
      type: 'line',
      yAxisId: 'left',
      format: (v) => `$${v.toLocaleString()}M`
    },
    eps: {
      label: 'Diluted EPS ($)',
      color: '#141618',
      type: 'line',
      yAxisId: 'right',
      format: (v) => `$${v.toFixed(2)}`
    },
    grossMargin: {
      label: 'Gross Margin (%)',
      color: '#2E5E4C',
      type: 'line',
      yAxisId: 'right',
      format: (v) => `${v.toFixed(1)}%`
    }
  };

  const CustomChartTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#141618] text-white p-3 rounded-lg shadow-xl text-xs border border-white/10 space-y-1.5 min-w-[170px]">
          <div className="font-bold border-b border-white/15 pb-1 text-[#EDEDEB]">
            {label} Fiscal Period
          </div>
          {payload.map((entry: any, index: number) => {
            const config = Object.values(METRIC_CONFIG).find((c) => c.label === entry.name);
            const formatted = config ? config.format(entry.value) : entry.value;
            return (
              <div key={index} className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-1.5 text-neutral-300">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: entry.color }}
                  />
                  {entry.name.split(' ')[0]}
                </span>
                <span className="font-bold text-white tabular-nums">{formatted}</span>
              </div>
            );
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white border border-[#EDEDEB] rounded-lg p-5 shadow-2xs space-y-5">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EDEDEB]/70">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-[#87BAA4] mb-0.5">
            Historical Trajectory
          </div>
          <h3 className="text-base font-bold text-[#141618]">
            Financial Performance
          </h3>
        </div>

        {/* Timeframe selector */}
        <div className="flex items-center p-0.5 bg-[#F5F4F5] rounded-md border border-[#EDEDEB]">
          {(['1Y', '3Y', '5Y', '10Y'] as Timeframe[]).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-all ${
                timeframe === tf
                  ? 'bg-white text-[#141618] shadow-xs font-semibold'
                  : 'text-[#6C726F] hover:text-[#141618]'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Toggles */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-[11px] font-semibold text-[#8C9390] uppercase tracking-wide mr-1">
          Metrics:
        </span>
        {(Object.keys(METRIC_CONFIG) as MetricKey[]).map((key) => {
          const config = METRIC_CONFIG[key];
          const isSelected = activeMetrics[key];
          return (
            <button
              key={key}
              onClick={() => toggleMetric(key)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium border flex items-center gap-1.5 transition-all cursor-pointer ${
                isSelected
                  ? 'border-[#87BAA4] bg-[#EBF5F1] text-[#1E4D3C] font-semibold'
                  : 'border-[#EDEDEB] text-[#717874] hover:bg-[#F9FAF9]'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: config.color }}
              />
              <span>{config.label.replace(/\(.*\)/, '').trim()}</span>
            </button>
          );
        })}
      </div>

      {/* Chart Canvas */}
      <div className="h-[280px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={filteredData}
            margin={{ top: 10, right: 25, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0EFEF" />
            <XAxis
              dataKey="year"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#7C8480' }}
            />
            <YAxis
              yAxisId="left"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#7C8480' }}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}B`}
            />
            {(activeMetrics.eps || activeMetrics.grossMargin) && (
              <YAxis
                yAxisId="right"
                orientation="right"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#7C8480' }}
                tickFormatter={(v) => `${v}`}
              />
            )}
            <Tooltip content={<CustomChartTooltip />} />

            {/* Bars */}
            {activeMetrics.revenue && (
              <Bar
                yAxisId="left"
                dataKey="revenue"
                name={METRIC_CONFIG.revenue.label}
                fill={METRIC_CONFIG.revenue.color}
                radius={[4, 4, 0, 0]}
                barSize={28}
              />
            )}
            {activeMetrics.ebitda && (
              <Bar
                yAxisId="left"
                dataKey="ebitda"
                name={METRIC_CONFIG.ebitda.label}
                fill={METRIC_CONFIG.ebitda.color}
                radius={[4, 4, 0, 0]}
                barSize={28}
              />
            )}
            {activeMetrics.freeCashFlow && (
              <Bar
                yAxisId="left"
                dataKey="freeCashFlow"
                name={METRIC_CONFIG.freeCashFlow.label}
                fill={METRIC_CONFIG.freeCashFlow.color}
                radius={[4, 4, 0, 0]}
                barSize={28}
              />
            )}

            {/* Lines */}
            {activeMetrics.netIncome && (
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="netIncome"
                name={METRIC_CONFIG.netIncome.label}
                stroke={METRIC_CONFIG.netIncome.color}
                strokeWidth={2.5}
                dot={{ r: 3, fill: METRIC_CONFIG.netIncome.color }}
              />
            )}
            {activeMetrics.eps && (
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="eps"
                name={METRIC_CONFIG.eps.label}
                stroke={METRIC_CONFIG.eps.color}
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 3 }}
              />
            )}
            {activeMetrics.grossMargin && (
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="grossMargin"
                name={METRIC_CONFIG.grossMargin.label}
                stroke={METRIC_CONFIG.grossMargin.color}
                strokeWidth={2.5}
                dot={{ r: 3 }}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
