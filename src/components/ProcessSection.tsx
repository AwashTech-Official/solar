'use client';

import React from 'react';
import Image from 'next/image';
import { Layers, ArrowRight, CheckCircle2 } from 'lucide-react';
import { siteConfig } from '@/src/config/site';
import { useLanguage } from '@/src/context/LanguageContext';

export const ProcessSection: React.FC = () => {
  const { t } = useLanguage();

  const steps = siteConfig.processSteps;

  return (
    <section id="process" className="py-20 md:py-28 bg-[#FFFFFF] text-[#17241D] border-b border-[rgba(18,55,42,0.14)] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#12372A] text-[#B7D957] text-[11px] font-mono font-bold uppercase tracking-wider mb-4">
            <Layers className="w-3.5 h-3.5 text-[#B7D957]" />
            <span>{t.process.badge}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-[#12372A] tracking-tight leading-tight">
            {t.process.headline}
          </h2>

          <p className="mt-4 text-base sm:text-lg text-[#647368] leading-relaxed">
            {t.process.subtext}
          </p>
        </div>

        {/* 4-Step Process Timeline */}
        <div className="relative mb-16">
          {/* Desktop Connecting Line */}
          <div
            className="hidden lg:block absolute top-[110px] left-[5%] right-[5%] h-0.5 bg-[#2F7D57]/20 z-0 pointer-events-none"
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, idx) => (
              <div
                key={step.number}
                className="flex flex-col bg-[#F5F7F2] rounded-lg border border-[rgba(18,55,42,0.14)] overflow-hidden hover:border-[#2F7D57] transition-all duration-300 group shadow-xs hover:shadow-md"
              >
                {/* Step Image */}
                <div className="relative h-48 w-full overflow-hidden bg-[#12372A]">
                  {step.imageUrl ? (
                    <Image
                      src={step.imageUrl}
                      alt={step.imageAlt || step.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover group-hover:scale-103 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#12372A]/85 via-transparent to-black/20" />

                  {/* Step Number Tag */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#0B241B]/90 backdrop-blur-md border border-[rgba(255,255,255,0.15)] text-[#B7D957] font-mono text-xs font-bold shadow-md">
                    STEP {step.number}
                  </div>
                </div>

                {/* Step Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold font-heading text-[#12372A] leading-snug mb-2 group-hover:text-[#2F7D57] transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#647368] leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-[rgba(18,55,42,0.1)] flex items-center justify-between text-[11px] font-mono font-bold text-[#2F7D57]">
                    <span>PHASE 0{idx + 1}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2F7D57]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Process Footer Notice */}
        <div className="p-5 rounded-lg bg-[#12372A] text-[#F5F7F2] border border-[rgba(18,55,42,0.2)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div className="text-xs text-[#F5F7F2]/90 font-mono leading-relaxed max-w-2xl">
            <span className="text-[#B7D957] font-bold mr-2 uppercase">GOVERNANCE NOTE:</span>
            {t.process.timelineNotice}
          </div>

          <a
            href="#assessment"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#2F7D57] hover:bg-[#1b4e3c] text-[#FFFFFF] text-xs font-bold uppercase tracking-wider shrink-0 transition-colors border border-[#B7D957]/30"
          >
            <span>{t.nav.ctaButton}</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#B7D957]" />
          </a>
        </div>

      </div>
    </section>
  );
};
