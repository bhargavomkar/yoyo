'use client';

import React, { useState } from 'react';
import { FinancialYearData } from '@/types/research';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface FinancialStatementsTableProps {
  history: FinancialYearData[];
}

type StatementTab = 'income' | 'balance' | 'cashflow';

export const FinancialStatementsTable: React.FC<FinancialStatementsTableProps> = ({
  history
}) => {
  const [activeTab, setActiveTab] = useState<StatementTab>('income');

  // Sorted latest first or oldest first; chronological oldest to newest works best for statement reading
  const years = history.map((h) => h.year);

  // Helper to format currency in millions
  const fmt = (val: number | undefined) => {
    if (val === undefined) return '—';
    return `$${val.toLocaleString()}`;
  };

  // Helper for YoY delta calculation
  const renderRow = (
    label: string,
    getValue: (d: FinancialYearData) => number | undefined,
    isBold: boolean = false,
    indent: boolean = false
  ) => {
    return (
      <tr className="hover:bg-[#F9FAF9] transition-colors">
        <td className={`py-2 px-3 text-xs text-[#18191B] ${isBold ? 'font-bold' : 'font-medium'} ${indent ? 'pl-6 text-[#585F5B]' : ''}`}>
          {label}
        </td>
        {history.map((d, idx) => {
          const val = getValue(d);
          const prevVal = idx > 0 ? getValue(history[idx - 1]) : undefined;
          let yoyDelta: string | null = null;
          let isPositiveDelta = true;

          if (val !== undefined && prevVal !== undefined && prevVal !== 0) {
            const delta = ((val - prevVal) / Math.abs(prevVal)) * 100;
            isPositiveDelta = delta >= 0;
            yoyDelta = `${isPositiveDelta ? '+' : ''}${delta.toFixed(1)}%`;
          }

          return (
            <td key={d.year} className="py-2 px-3 text-right text-xs tabular-nums">
              <span className={`${isBold ? 'font-bold text-[#141618]' : 'text-[#3E4542]'}`}>
                {fmt(val)}
              </span>
              {yoyDelta && (
                <span
                  className={`block text-[10px] font-medium ${
                    isPositiveDelta ? 'text-[#2D6B53]' : 'text-[#878E8B]'
                  }`}
                >
                  {yoyDelta}
                </span>
              )}
            </td>
          );
        })}
      </tr>
    );
  };

  return (
    <div className="bg-white border border-[#EDEDEB] rounded-lg overflow-hidden shadow-2xs">
      {/* Header and Statement Switcher */}
      <div className="p-5 pb-3 border-b border-[#EDEDEB]/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-[#87BAA4] mb-0.5">
            GAAP & SEC Normalized
          </div>
          <h3 className="text-base font-bold text-[#141618]">
            Financial Statements
          </h3>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-0.5 bg-[#F5F4F5] rounded-md border border-[#EDEDEB]">
          <button
            onClick={() => setActiveTab('income')}
            className={`px-3 py-1 text-xs font-medium rounded transition-all ${
              activeTab === 'income'
                ? 'bg-white text-[#141618] shadow-xs font-semibold'
                : 'text-[#6C726F] hover:text-[#141618]'
            }`}
          >
            Income Statement
          </button>
          <button
            onClick={() => setActiveTab('balance')}
            className={`px-3 py-1 text-xs font-medium rounded transition-all ${
              activeTab === 'balance'
                ? 'bg-white text-[#141618] shadow-xs font-semibold'
                : 'text-[#6C726F] hover:text-[#141618]'
            }`}
          >
            Balance Sheet
          </button>
          <button
            onClick={() => setActiveTab('cashflow')}
            className={`px-3 py-1 text-xs font-medium rounded transition-all ${
              activeTab === 'cashflow'
                ? 'bg-white text-[#141618] shadow-xs font-semibold'
                : 'text-[#6C726F] hover:text-[#141618]'
            }`}
          >
            Cash Flow
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#EDEDEB] bg-[#FAFAF9] text-[#7A827E] text-[10.5px] uppercase font-semibold">
              <th className="py-2.5 px-3 font-medium">Line Item ($M)</th>
              {years.map((y) => (
                <th key={y} className="py-2.5 px-3 text-right font-medium">
                  {y}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EDEDEB]/50">
            {/* Income Statement */}
            {activeTab === 'income' && (
              <>
                {renderRow('Revenue', (d) => d.revenue, true)}
                {renderRow('Cost of Goods Sold (COGS)', (d) => d.cogs, false, true)}
                {renderRow('Gross Profit', (d) => d.grossProfit, true)}
                {renderRow('Operating Expenses (OpEx)', (d) => d.operatingExpenses, false, true)}
                {renderRow('Operating Income (EBIT)', (d) => d.operatingIncome, true)}
                {renderRow('Net Income', (d) => d.netIncome, true)}
              </>
            )}

            {/* Balance Sheet */}
            {activeTab === 'balance' && (
              <>
                {renderRow('Cash & Short-Term Investments', (d) => d.cash, true)}
                {renderRow('Accounts Receivable', (d) => d.accountsReceivable, false, true)}
                {renderRow('Inventory', (d) => d.inventory, false, true)}
                {renderRow('Property, Plant & Equipment (PP&E)', (d) => d.ppe, false, true)}
                {renderRow('Total Assets', (d) => d.totalAssets, true)}
                {renderRow('Short & Long-Term Debt', (d) => d.debt, false, true)}
                {renderRow('Total Liabilities', (d) => d.liabilities, true)}
                {renderRow("Stockholders' Equity", (d) => d.equity, true)}
              </>
            )}

            {/* Cash Flow */}
            {activeTab === 'cashflow' && (
              <>
                {renderRow('Operating Cash Flow', (d) => d.operatingCashFlow, true)}
                {renderRow('Capital Expenditures (CapEx)', (d) => d.capex, false, true)}
                {renderRow('Free Cash Flow (FCF)', (d) => d.freeCashFlow, true)}
                {renderRow('Financing Cash Flow', (d) => d.financingCashFlow, false, true)}
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
