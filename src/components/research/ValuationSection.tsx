'use client';

import React, { useState, useMemo } from 'react';
import { PublicCompanyIdentity, DCFModelInputs } from '@/types/research';
import { ValuationService } from '@/services/valuationService';
import { Sliders, ArrowUpRight, ArrowDownRight, RefreshCw, Calculator, TrendingUp } from 'lucide-react';

interface ValuationSectionProps {
  company: PublicCompanyIdentity;
}

export const ValuationSection: React.FC<ValuationSectionProps> = ({ company }) => {
  // Interactive DCF assumption controls
  const [inputs, setInputs] = useState<DCFModelInputs>({
    revenueGrowthRate: 18.0,
    operatingMargin: 55.0,
    taxRate: 15.0,
    wacc: 9.5,
    terminalGrowthRate: 3.5
  });

  const comparables = useMemo(() => {
    return ValuationService.getComparables(company.ticker);
  }, [company.ticker]);

  // Dynamically compute DCF outputs
  const dcfOutput = useMemo(() => {
    return ValuationService.computeDCF(
      inputs,
      128500, // FY25 base revenue
      24600,  // shares diluted
      43200,  // cash
      9800,   // debt
      company.sharePrice
    );
  }, [inputs, company.sharePrice]);

  const resetAssumptions = () => {
    setInputs({
      revenueGrowthRate: 18.0,
      operatingMargin: 55.0,
      taxRate: 15.0,
      wacc: 9.5,
      terminalGrowthRate: 3.5
    });
  };

  const isUpside = dcfOutput.upsideDownsidePercent >= 0;

  return (
    <div className="bg-white border border-[#EDEDEB] rounded-lg p-5 shadow-2xs space-y-6">
      {/* 1. Header & Valuation Multiples Bar */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EDEDEB]/70">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-[#87BAA4] mb-0.5">
              Intrinsic & Relative Multiples
            </div>
            <h3 className="text-base font-bold text-[#141618]">
              Valuation & Comparable Benchmark
            </h3>
          </div>

          <div className="text-xs text-[#6C726F]">
            Last price: <span className="font-bold text-[#141618]">{company.sharePriceFormatted}</span>
          </div>
        </div>

        {/* Multiples strip */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4">
          <div className="p-3 bg-[#F9F9F8] rounded-lg border border-[#EDEDEB]">
            <span className="text-[10.5px] text-[#8C9390] block mb-0.5 font-medium">Trailing P/E</span>
            <span className="text-base font-bold text-[#141618] tabular-nums">
              {company.peRatio}x
            </span>
          </div>
          <div className="p-3 bg-[#F9F9F8] rounded-lg border border-[#EDEDEB]">
            <span className="text-[10.5px] text-[#8C9390] block mb-0.5 font-medium">EV / Revenue</span>
            <span className="text-base font-bold text-[#141618] tabular-nums">
              {company.evToRevenue}x
            </span>
          </div>
          <div className="p-3 bg-[#F9F9F8] rounded-lg border border-[#EDEDEB]">
            <span className="text-[10.5px] text-[#8C9390] block mb-0.5 font-medium">EV / EBITDA</span>
            <span className="text-base font-bold text-[#141618] tabular-nums">
              {company.evToEbitda}x
            </span>
          </div>
          <div className="p-3 bg-[#F9F9F8] rounded-lg border border-[#EDEDEB]">
            <span className="text-[10.5px] text-[#8C9390] block mb-0.5 font-medium">Price / Sales</span>
            <span className="text-base font-bold text-[#141618] tabular-nums">
              {company.priceToSales}x
            </span>
          </div>
          <div className="p-3 bg-[#F9F9F8] rounded-lg border border-[#EDEDEB]">
            <span className="text-[10.5px] text-[#8C9390] block mb-0.5 font-medium">FCF Yield</span>
            <span className="text-base font-bold text-[#204A3B] tabular-nums">
              {company.fcfYield}%
            </span>
          </div>
        </div>
      </div>

      {/* 2. Interactive DCF Analysis Box */}
      <div className="p-5 rounded-lg border border-[#EDEDEB] bg-[#FAFAF9] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EDEDEB] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#EBF5F1] flex items-center justify-center text-[#245241]">
              <Calculator className="w-3.5 h-3.5 text-[#87BAA4]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#141618]">
                Dynamic Multi-Stage DCF Analysis
              </h4>
              <p className="text-[11px] text-[#6C726F]">
                Adjust fundamental assumptions to recalculate intrinsic equity value in real time.
              </p>
            </div>
          </div>

          <button
            onClick={resetAssumptions}
            className="inline-flex items-center gap-1 text-[11px] text-[#6C726F] hover:text-[#18191B] self-start sm:self-auto cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset Baseline</span>
          </button>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 text-xs">
          {/* Revenue Growth Slider */}
          <div className="p-3 rounded-md bg-white border border-[#EDEDEB] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-[#6C726F]">5Y Rev Growth</span>
              <span className="font-bold text-[#18191B]">{inputs.revenueGrowthRate}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="40"
              step="0.5"
              value={inputs.revenueGrowthRate}
              onChange={(e) => setInputs({ ...inputs, revenueGrowthRate: parseFloat(e.target.value) })}
              className="w-full accent-[#87BAA4] cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-[#9AA19E]">
              <span>5%</span>
              <span>40%</span>
            </div>
          </div>

          {/* Operating Margin Slider */}
          <div className="p-3 rounded-md bg-white border border-[#EDEDEB] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-[#6C726F]">Target Op Margin</span>
              <span className="font-bold text-[#18191B]">{inputs.operatingMargin}%</span>
            </div>
            <input
              type="range"
              min="30"
              max="70"
              step="0.5"
              value={inputs.operatingMargin}
              onChange={(e) => setInputs({ ...inputs, operatingMargin: parseFloat(e.target.value) })}
              className="w-full accent-[#87BAA4] cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-[#9AA19E]">
              <span>30%</span>
              <span>70%</span>
            </div>
          </div>

          {/* Tax Rate Slider */}
          <div className="p-3 rounded-md bg-white border border-[#EDEDEB] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-[#6C726F]">Effective Tax Rate</span>
              <span className="font-bold text-[#18191B]">{inputs.taxRate}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="25"
              step="0.5"
              value={inputs.taxRate}
              onChange={(e) => setInputs({ ...inputs, taxRate: parseFloat(e.target.value) })}
              className="w-full accent-[#87BAA4] cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-[#9AA19E]">
              <span>10%</span>
              <span>25%</span>
            </div>
          </div>

          {/* WACC Slider */}
          <div className="p-3 rounded-md bg-white border border-[#EDEDEB] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-[#6C726F]">Discount (WACC)</span>
              <span className="font-bold text-[#18191B]">{inputs.wacc}%</span>
            </div>
            <input
              type="range"
              min="7"
              max="14"
              step="0.25"
              value={inputs.wacc}
              onChange={(e) => setInputs({ ...inputs, wacc: parseFloat(e.target.value) })}
              className="w-full accent-[#87BAA4] cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-[#9AA19E]">
              <span>7.0%</span>
              <span>14.0%</span>
            </div>
          </div>

          {/* Terminal Growth Rate Slider */}
          <div className="p-3 rounded-md bg-white border border-[#EDEDEB] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-[#6C726F]">Terminal Growth</span>
              <span className="font-bold text-[#18191B]">{inputs.terminalGrowthRate}%</span>
            </div>
            <input
              type="range"
              min="2.0"
              max="5.0"
              step="0.25"
              value={inputs.terminalGrowthRate}
              onChange={(e) => setInputs({ ...inputs, terminalGrowthRate: parseFloat(e.target.value) })}
              className="w-full accent-[#87BAA4] cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-[#9AA19E]">
              <span>2.0%</span>
              <span>5.0%</span>
            </div>
          </div>
        </div>

        {/* Live Output Banner */}
        <div className="p-4 rounded-lg bg-white border border-[#EDEDEB] grid grid-cols-2 sm:grid-cols-5 gap-3 items-center">
          <div>
            <span className="text-[10px] text-[#8C9390] uppercase font-semibold block">
              Enterprise Value
            </span>
            <span className="text-sm font-bold text-[#141618] tabular-nums">
              ${(dcfOutput.enterpriseValue / 1000).toFixed(1)}B
            </span>
          </div>

          <div>
            <span className="text-[10px] text-[#8C9390] uppercase font-semibold block">
              Terminal Value
            </span>
            <span className="text-sm font-bold text-[#141618] tabular-nums">
              ${(dcfOutput.terminalValue / 1000).toFixed(1)}B
            </span>
          </div>

          <div>
            <span className="text-[10px] text-[#8C9390] uppercase font-semibold block">
              Equity Value
            </span>
            <span className="text-sm font-bold text-[#141618] tabular-nums">
              ${(dcfOutput.equityValue / 1000).toFixed(1)}B
            </span>
          </div>

          <div className="p-2 rounded-md bg-[#FAFAF9] border border-[#EDEDEB]">
            <span className="text-[10px] text-[#87BAA4] uppercase font-bold block">
              Implied Share Value
            </span>
            <span className="text-lg font-bold text-[#141618] tabular-nums">
              ${dcfOutput.impliedSharePrice.toFixed(2)}
            </span>
          </div>

          <div className="p-2 rounded-md bg-[#FAFAF9] border border-[#EDEDEB]">
            <span className="text-[10px] text-[#8C9390] uppercase font-semibold block">
              Spread vs Market
            </span>
            <span
              className={`text-sm font-bold inline-flex items-center gap-1 tabular-nums ${
                isUpside ? 'text-[#23683C]' : 'text-[#A5342C]'
              }`}
            >
              {isUpside ? (
                <ArrowUpRight className="w-4 h-4 text-[#3E7C66]" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-[#A5342C]" />
              )}
              {isUpside ? '+' : ''}{dcfOutput.upsideDownsidePercent}%
            </span>
          </div>
        </div>
      </div>

      {/* 3. Comparable Companies Table */}
      <div>
        <div className="mb-3">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-[#87BAA4] mb-0.5">
            Peer Multiples
          </div>
          <h4 className="text-sm font-bold text-[#141618]">
            Comparable Companies Universe
          </h4>
        </div>

        <div className="overflow-x-auto border border-[#EDEDEB] rounded-lg">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#EDEDEB] bg-[#FAFAF9] text-[#7A827E] text-[10.5px] uppercase font-semibold">
                <th className="py-2.5 px-3 font-medium">Company</th>
                <th className="py-2.5 px-3 font-medium">Market Cap</th>
                <th className="py-2.5 px-3 text-right font-medium">EV / Revenue</th>
                <th className="py-2.5 px-3 text-right font-medium">EV / EBITDA</th>
                <th className="py-2.5 px-3 text-right font-medium">P / E</th>
                <th className="py-2.5 px-3 text-right font-medium">Revenue Growth</th>
                <th className="py-2.5 px-3 text-right font-medium">Operating Margin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDEDEB]/50">
              {comparables.map((peer) => {
                const isCurrent = peer.ticker.toUpperCase() === company.ticker.toUpperCase();
                return (
                  <tr
                    key={peer.id}
                    className={`transition-colors ${
                      isCurrent ? 'bg-[#EBF5F1]/40 font-semibold' : 'hover:bg-[#F9FAF9]'
                    }`}
                  >
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[#141618]">{peer.company}</span>
                        <span className="text-[10px] text-[#8C9390]">({peer.ticker})</span>
                        {isCurrent && (
                          <span className="text-[9.5px] bg-[#BAD6CC] text-[#1E4D3C] px-1 py-0.2 rounded font-medium">
                            Target
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-[#585F5B] tabular-nums">
                      {peer.marketCap}
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums text-[#141618]">
                      {peer.evToRevenue}x
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums text-[#141618]">
                      {peer.evToEbitda}x
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums text-[#141618]">
                      {peer.peRatio}x
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums text-[#23683C]">
                      +{peer.revenueGrowth}%
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums text-[#141618]">
                      {peer.operatingMargin}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
