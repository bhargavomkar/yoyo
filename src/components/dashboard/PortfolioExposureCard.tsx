'use client';

import React, { useState } from 'react';
import { EXPOSURE_DATA } from '@/lib/mock-data';
import { ExposureBreakdown } from '@/types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { ArrowUpRight, ArrowDownRight, Layers, SlidersHorizontal } from 'lucide-react';

type ExposureView = 'assetClass' | 'sector' | 'geography';

export const PortfolioExposureCard: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [view, setView] = useState<ExposureView>('assetClass');

  const currentData: ExposureBreakdown[] = EXPOSURE_DATA[view];

  const viewLabels: Record<ExposureView, string> = {
    assetClass: 'Asset Class',
    sector: 'Sector',
    geography: 'Geography'
  };

  const chartData = currentData.map((item) => ({
    name: item.name,
    allocation: item.allocationPercent,
    amount: item.amountFormatted,
    color: item.color
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#141618] text-white px-3 py-2 rounded shadow-md text-xs border border-white/10">
          <div className="font-semibold">{data.name}</div>
          <div className="text-[#BAD6CC] mt-0.5">
            {data.allocation}% · {data.amount}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`bg-white border border-[#EDEDEB] rounded-lg p-5 shadow-2xs ${className}`}>
      {/* Header & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-[#EDEDEB]/70">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-[#87BAA4] mb-0.5">
            Capital Distribution
          </div>
          <h3 className="text-base font-bold text-[#141618]">
            Portfolio Exposure
          </h3>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center p-1 bg-[#F5F4F5] rounded-md border border-[#EDEDEB]">
          {(['assetClass', 'sector', 'geography'] as ExposureView[]).map((tabKey) => (
            <button
              key={tabKey}
              onClick={() => setView(tabKey)}
              className={`px-3 py-1 text-xs font-medium rounded transition-all ${
                view === tabKey
                  ? 'bg-white text-[#141618] shadow-xs font-semibold'
                  : 'text-[#676E6A] hover:text-[#141618]'
              }`}
            >
              {viewLabels[tabKey]}
            </button>
          ))}
        </div>
      </div>

      {/* Grid: Chart on Left, Breakdown List on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Visual Bar Breakdown */}
        <div className="lg:col-span-5 h-[230px] flex flex-col justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 25, left: 10, bottom: 5 }}
            >
              <XAxis type="number" hide domain={[0, 'dataMax + 5']} />
              <YAxis
                dataKey="name"
                type="category"
                axisLine={false}
                tickLine={false}
                width={120}
                tick={{ fontSize: 11, fill: '#555C58' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="allocation" radius={[0, 4, 4, 0]} barSize={14}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Breakdown Table */}
        <div className="lg:col-span-7">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#EDEDEB] text-[#8C9390] text-[10.5px] uppercase font-semibold">
                  <th className="pb-2 font-medium">Category</th>
                  <th className="pb-2 font-medium text-right">Weight</th>
                  <th className="pb-2 font-medium text-right">AUM Amount</th>
                  <th className="pb-2 font-medium text-right">30D Delta</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDEDEB]/50">
                {currentData.map((item, idx) => (
                  <tr key={idx} className="hover:bg-[#F9FAF9] transition-colors">
                    <td className="py-2.5 flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="font-medium text-[#18191B] truncate max-w-[160px] sm:max-w-none">
                        {item.name}
                      </span>
                    </td>
                    <td className="py-2.5 text-right font-semibold text-[#18191B] tabular-nums">
                      {item.allocationPercent}%
                    </td>
                    <td className="py-2.5 text-right text-[#585F5B] tabular-nums">
                      {item.amountFormatted}
                    </td>
                    <td className="py-2.5 text-right tabular-nums">
                      <span
                        className={`inline-flex items-center gap-0.5 text-[11px] font-medium ${
                          item.isPositiveChange
                            ? 'text-[#2D6B53]'
                            : 'text-[#878E8B]'
                        }`}
                      >
                        {item.isPositiveChange ? (
                          <ArrowUpRight className="w-3 h-3 text-[#3E7C66]" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3 text-[#878E8B]" />
                        )}
                        {item.change30d}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
