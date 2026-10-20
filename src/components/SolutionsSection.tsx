'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Zap, BatteryCharging, Flame, ArrowRight, Factory, CheckCircle2, Sliders } from 'lucide-react';
import { SolarSolution, fetchSolarSolutions, SystemType, SolutionInterest } from '@/src/lib/supabase';
import { useLanguage } from '@/src/context/LanguageContext';

interface SolutionsSectionProps {
  onSelectSolutionForAssessment?: (solutionInterest: SolutionInterest) => void;
}

export const SolutionsSection: React.FC<SolutionsSectionProps> = ({
  onSelectSolutionForAssessment,
}) => {
  const { t } = useLanguage();
  const [solutions, setSolutions] = useState<SolarSolution[]>([]);
  const [selectedSystemType, setSelectedSystemType] = useState<string>('all');
  const [, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    async function loadSolutions() {
      try {
        const data = await fetchSolarSolutions();
        if (isMounted) setSolutions(data);
      } catch (err) {
        console.warn('Error loading solutions:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadSolutions();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredSolutions = selectedSystemType === 'all'
    ? solutions
    : solutions.filter((s) => s.system_type === selectedSystemType);

  const getSystemIcon = (type: SystemType) => {
    switch (type) {
      case 'bess_storage':
        return <BatteryCharging className="w-4 h-4 text-[#B7D957]" />;
      case 'hybrid':
        return <Flame className="w-4 h-4 text-[#EDB54A]" />;
      case 'grid_tied':
      default:
        return <Zap className="w-4 h-4 text-[#B7D957]" />;
    }
  };

  const getSecondaryDescriptor = (type: SystemType) => {
    switch (type) {
      case 'grid_tied':
        return 'Grid-connected daytime generation';
      case 'bess_storage':
        return 'Stored energy for configured loads';
      case 'hybrid':
        return 'Coordinated solar, storage and generator operation';
      default:
        return '';
    }
  };

  const mapToSolutionInterest = (type: SystemType): SolutionInterest => {
    switch (type) {
      case 'bess_storage':
        return 'solar_battery';
      case 'hybrid':
        return 'solar_generator_hybrid';
      case 'grid_tied':
      default:
        return 'grid_tied';
    }
  };

  const handleSelect = (type: SystemType) => {
    const interest = mapToSolutionInterest(type);
    if (onSelectSolutionForAssessment) {
      onSelectSolutionForAssessment(interest);
    }
    const assessmentEl = document.querySelector('#assessment');
    if (assessmentEl) {
      assessmentEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="solutions" className="py-20 md:py-24 bg-[#F5F7F2] text-[#17241D] border-b border-[rgba(18,55,42,0.14)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#12372A] text-[#B7D957] text-[11px] font-mono font-bold uppercase tracking-wider mb-3">
            <Sliders className="w-3.5 h-3.5 text-[#B7D957]" />
            <span>{t.solutions.badge}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-[#12372A] tracking-tight leading-tight">
            {t.solutions.headline}
          </h2>

          <p className="mt-4 text-base sm:text-lg text-[#647368] leading-relaxed">
            {t.solutions.subtext}
          </p>

          {/* Filter Tabs */}
          <div className="mt-8 flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: t.solutions.allFilter },
              { id: 'grid_tied', label: t.solutions.gridTiedFilter },
              { id: 'bess_storage', label: t.solutions.bessFilter },
              { id: 'hybrid', label: t.solutions.hybridFilter },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedSystemType(tab.id)}
                className={`px-4 py-2 rounded-md text-xs font-bold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F7D57] ${
                  selectedSystemType === tab.id
                    ? 'bg-[#2F7D57] text-[#FFFFFF] shadow-sm'
                    : 'bg-[#FFFFFF] text-[#647368] hover:text-[#17241D] border border-[rgba(18,55,42,0.14)]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Solutions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {filteredSolutions.map((sol) => (
            <div
              key={sol.id || sol.slug}
              className="rounded-lg bg-[#FFFFFF] border border-[rgba(18,55,42,0.14)] overflow-hidden flex flex-col justify-between hover:border-[#2F7D57] hover:shadow-md transition-all duration-300 group"
            >
              <div>
                {/* Image & System Type Badge */}
                <div className="relative h-60 w-full overflow-hidden bg-[#12372A]">
                  {sol.image_url ? (
                    <Image
                      src={sol.image_url}
                      alt={
                        sol.system_type === 'grid_tied'
                          ? 'Aerial view of a commercial rooftop covered with photovoltaic panels.'
                          : sol.system_type === 'bess_storage'
                          ? 'Commercial and industrial battery energy storage cabinet.'
                          : 'Illustrative hybrid power setup combining solar PV, battery storage, and a diesel generator.'
                      }
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className={`object-cover group-hover:scale-102 transition-transform duration-500 ${
                        sol.system_type === 'grid_tied' ? 'object-[center_35%]' : 'object-center'
                      }`}
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#12372A] text-[#647368]">
                      <Zap className="w-10 h-10 text-[#2F7D57]" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#12372A]/90 via-transparent to-black/30" />

                  {/* System Badge */}
                  <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0B241B]/90 backdrop-blur-md border border-[rgba(255,255,255,0.15)] text-[11px] font-bold text-[#FFFFFF]">
                    {getSystemIcon(sol.system_type)}
                    <span className="capitalize">{sol.system_type.replace('_', ' ')}</span>
                  </div>

                  {/* License Notice for Prototype Image */}
                  {sol.system_type === 'hybrid' && (
                    <div
                      className="absolute top-3.5 right-3.5 px-2 py-0.5 rounded bg-[#0B241B]/95 border border-[#EDB54A]/40 text-[9px] font-mono font-bold text-[#EDB54A]"
                      title="LICENSE CHECK REQUIRED — DO NOT SHIP UNTIL CLEARED"
                    >
                      LICENSE PENDING
                    </div>
                  )}

                  {sol.minimum_capacity_kwp && (
                    <div className="absolute bottom-3.5 left-3.5 px-2.5 py-1 rounded bg-[#0B241B]/90 border border-[rgba(255,255,255,0.12)] text-[10px] font-mono text-[#F5F7F2]">
                      {t.solutions.capacityRange}: {sol.minimum_capacity_kwp}–{sol.maximum_capacity_kwp || 2000} kWp
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="mb-2">
                    <span className="text-[11px] font-mono font-bold text-[#2F7D57] uppercase tracking-wider block">
                      {getSecondaryDescriptor(sol.system_type)}
                    </span>
                    <h3 className="text-xl font-bold font-heading text-[#17241D] group-hover:text-[#2F7D57] transition-colors mt-0.5">
                      {sol.title}
                    </h3>
                  </div>

                  <p className="mt-2.5 text-xs sm:text-sm text-[#647368] leading-relaxed">
                    {sol.short_description}
                  </p>

                  {/* Suitable For */}
                  {sol.suitable_for && sol.suitable_for.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-[rgba(18,55,42,0.08)]">
                      <div className="text-[10px] font-mono font-bold text-[#2F7D57] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Factory className="w-3 h-3 text-[#2F7D57]" />
                        <span>{t.solutions.suitableFor}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {sol.suitable_for.map((sector, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#F5F7F2] text-[#17241D] border border-[rgba(18,55,42,0.12)]"
                          >
                            {sector}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Key Features */}
                  {sol.features && sol.features.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-[rgba(18,55,42,0.08)] space-y-1.5">
                      <div className="text-[10px] font-mono font-bold text-[#647368] uppercase tracking-wider mb-1">
                        {t.solutions.features}
                      </div>
                      {sol.features.slice(0, 4).map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-xs text-[#17241D]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#2F7D57] shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Action */}
              <div className="p-6 pt-0">
                <button
                  type="button"
                  onClick={() => handleSelect(sol.system_type)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-md bg-[#2F7D57] hover:bg-[#12372A] text-[#FFFFFF] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F7D57] group/btn"
                >
                  <span>{t.solutions.selectForAssessment}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#B7D957] transition-transform group-hover/btn:translate-x-0.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Disclaimer & Asset Note */}
        <div className="p-4 rounded-md bg-[#FFFFFF] border border-[rgba(18,55,42,0.14)] text-[11px] text-[#647368] leading-relaxed flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="font-bold text-[#12372A] font-mono mr-1.5">ENGINEERING NOTE:</span>
            {t.solutions.disclaimer}
          </div>
          <div className="shrink-0 text-[10px] font-mono text-[#647368]/80">
            Storage image via Wikimedia Commons (CC0 1.0)
          </div>
        </div>

      </div>
    </section>
  );
};
