'use client';

import React from 'react';
import { TrendingUp, Fuel, Activity, ShieldAlert, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/src/context/LanguageContext';

export const EnergyProblemSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="why-now" className="relative py-20 md:py-24 bg-[#F5F7F2] text-[#17241D] border-b border-[rgba(18,55,42,0.14)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#12372A] text-[#B7D957] text-[11px] font-mono font-bold uppercase tracking-wider mb-3">
            <Activity className="w-3.5 h-3.5 text-[#B7D957]" />
            <span>{t.energyProblem.badge}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#12372A] tracking-tight font-heading leading-tight">
            {t.energyProblem.headline}
          </h2>

          <p className="mt-4 text-base sm:text-lg text-[#647368] leading-relaxed">
            {t.energyProblem.subtext}
          </p>
        </div>

        {/* 3 Metric & Structural Exposure Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          
          {/* 1. EEU Tariff Trajectory */}
          <div className="p-7 rounded-lg bg-white border border-[rgba(18,55,42,0.14)] shadow-xs hover:border-[#2F7D57] transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#2F7D57]">
                  01 / EEU Grid Tariffs
                </span>
                <div className="w-8 h-8 rounded-md bg-[#2F7D57]/10 text-[#2F7D57] flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>

              <div className="text-2xl sm:text-3xl font-extrabold text-[#12372A] font-heading mb-2">
                {t.energyProblem.tariffCardStat}
              </div>

              <h3 className="text-base font-bold text-[#17241D] mb-2 font-heading">
                {t.energyProblem.tariffCardTitle}
              </h3>

              <p className="text-xs sm:text-sm text-[#647368] leading-relaxed mb-4">
                {t.energyProblem.tariffCardDesc}
              </p>
            </div>

            <div className="pt-4 border-t border-[rgba(18,55,42,0.08)]">
              <span className="text-[11px] font-mono text-[#647368] block">
                {t.energyProblem.tariffCardMeta}
              </span>
            </div>
          </div>

          {/* 2. Diesel Generator Operational Volatility */}
          <div className="p-7 rounded-lg bg-white border border-[rgba(18,55,42,0.14)] shadow-xs hover:border-[#EDB54A] transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#EDB54A]">
                  02 / Diesel Volatility
                </span>
                <div className="w-8 h-8 rounded-md bg-[#EDB54A]/15 text-[#EDB54A] flex items-center justify-center">
                  <Fuel className="w-4 h-4" />
                </div>
              </div>

              <div className="text-2xl sm:text-3xl font-extrabold text-[#12372A] font-heading mb-2">
                {t.energyProblem.dieselCardStat}
              </div>

              <h3 className="text-base font-bold text-[#17241D] mb-2 font-heading">
                {t.energyProblem.dieselCardTitle}
              </h3>

              <p className="text-xs sm:text-sm text-[#647368] leading-relaxed mb-4">
                {t.energyProblem.dieselCardDesc}
              </p>
            </div>

            <div className="pt-4 border-t border-[rgba(18,55,42,0.08)]">
              <span className="text-[11px] font-mono text-[#647368] block">
                {t.energyProblem.dieselCardMeta}
              </span>
            </div>
          </div>

          {/* 3. Reliability & Maximum Demand Surcharges */}
          <div className="p-7 rounded-lg bg-white border border-[rgba(18,55,42,0.14)] shadow-xs hover:border-[#2F7D57] transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#2F7D57]">
                  03 / kVA Demand Shaving
                </span>
                <div className="w-8 h-8 rounded-md bg-[#2F7D57]/10 text-[#2F7D57] flex items-center justify-center">
                  <Activity className="w-4 h-4" />
                </div>
              </div>

              <div className="text-2xl sm:text-3xl font-extrabold text-[#12372A] font-heading mb-2">
                {t.energyProblem.reliabilityCardStat}
              </div>

              <h3 className="text-base font-bold text-[#17241D] mb-2 font-heading">
                {t.energyProblem.reliabilityCardTitle}
              </h3>

              <p className="text-xs sm:text-sm text-[#647368] leading-relaxed mb-4">
                {t.energyProblem.reliabilityCardDesc}
              </p>
            </div>

            <div className="pt-4 border-t border-[rgba(18,55,42,0.08)]">
              <span className="text-[11px] font-mono text-[#647368] block">
                {t.energyProblem.reliabilityCardMeta}
              </span>
            </div>
          </div>

        </div>

        {/* Fact-Checked Sourced Notice & Calculator CTA */}
        <div className="p-6 rounded-lg bg-white border border-[rgba(18,55,42,0.14)] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-start gap-3.5 max-w-3xl">
            <ShieldAlert className="w-5 h-5 text-[#2F7D57] shrink-0 mt-0.5" />
            <p className="text-xs text-[#647368] leading-relaxed">
              <strong className="text-[#12372A] font-mono uppercase mr-1">Regulatory Baseline:</strong>
              {t.energyProblem.disclaimer}
            </p>
          </div>

          <a
            href="#calculator"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#2F7D57] hover:bg-[#12372A] text-white text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap shrink-0 shadow-xs"
          >
            <span>Model Your Site</span>
            <ArrowRight className="w-4 h-4 text-[#B7D957]" />
          </a>
        </div>

      </div>
    </section>
  );
};
