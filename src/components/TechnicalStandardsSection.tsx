'use client';

import React from 'react';
import { ShieldCheck, FileText, CheckCircle, Zap, Cpu, Wrench } from 'lucide-react';
import { siteConfig } from '@/src/config/site';
import { useLanguage } from '@/src/context/LanguageContext';

export const TechnicalStandardsSection: React.FC = () => {
  const { language } = useLanguage();
  const standards = siteConfig.technicalStandards;

  return (
    <section id="standards" className="py-20 bg-[#101820] text-[#F3F4F1] border-b border-[rgba(243,244,241,0.08)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#18232B] border border-[rgba(242,181,68,0.3)] text-[#F2B544] text-[11px] font-mono font-bold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{language === 'am' ? 'የኢንጂነሪንግና የፍርግርግ ደረጃዎች' : 'Engineering & Grid Standards'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-[#F3F4F1] tracking-tight leading-tight">
            {language === 'am' ? 'ለኢንዱስትሪ ተቋማት የተበጁ ጥብቅ የምህንድስና መመሪያዎች' : 'Strict Engineering Standards for Industrial Reliability'}
          </h2>

          <p className="mt-4 text-base sm:text-lg text-[#889AA7] leading-relaxed">
            {language === 'am'
              ? 'የንግድ ሶላር ስርዓቶች ከዋናው የፍርግርግ ኃይልና ከከባድ ማሽነሪዎች ጋር በደህና መጣመር አለባቸው። ስርዓቶቻችንን በኢትዮጵያ ኤሌክትሪክ አገልግሎት (EEU) እና በአለም አቀፍ IEC/IEEE ደረጃዎች መሰረት እንገነባለን።'
              : 'Commercial solar power plants must operate safely alongside utility grids and heavy machinery. We engineer systems in full accordance with Ethiopian Electric Utility (EEU) interconnection guidelines and international safety codes.'}
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          
          {/* Card 1: Grid Compliance */}
          <div className="p-6 rounded-lg bg-[#18232B] border border-[rgba(243,244,241,0.12)] space-y-3">
            <div className="w-9 h-9 rounded-md bg-[#F2B544]/15 text-[#F2B544] flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-[#F3F4F1]">EEU Grid Interconnection</h3>
            <p className="text-xs text-[#889AA7] leading-relaxed">
              Certified anti-islanding protection (IEEE 1547 / IEC 62116) ensures inverters disconnect immediately during utility outages, protecting grid maintenance crews.
            </p>
          </div>

          {/* Card 2: Tier-1 Hardware */}
          <div className="p-6 rounded-lg bg-[#18232B] border border-[rgba(243,244,241,0.12)] space-y-3">
            <div className="w-9 h-9 rounded-md bg-[#1F8A83]/20 text-[#1F8A83] flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-[#F3F4F1]">Tier-1 Hardware Exclusively</h3>
            <p className="text-xs text-[#889AA7] leading-relaxed">
              We install Tier-1 BloombergNEF monocrystalline modules (IEC 61215/61730) with linear 25-year performance warranties backed by verifiable serial registries.
            </p>
          </div>

          {/* Card 3: Switchgear & Protection */}
          <div className="p-6 rounded-lg bg-[#18232B] border border-[rgba(243,244,241,0.12)] space-y-3">
            <div className="w-9 h-9 rounded-md bg-[#F2B544]/15 text-[#F2B544] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-[#F3F4F1]">Surge & Arc-Fault Protection</h3>
            <p className="text-xs text-[#889AA7] leading-relaxed">
              Industrial Type-II DC and AC surge arresters, rapid shutdown devices, and dedicated copper earthing with ground loop impedance certified under 5 ohms.
            </p>
          </div>

          {/* Card 4: Documentation & Support */}
          <div className="p-6 rounded-lg bg-[#18232B] border border-[rgba(243,244,241,0.12)] space-y-3">
            <div className="w-9 h-9 rounded-md bg-[#1F8A83]/20 text-[#1F8A83] flex items-center justify-center">
              <Wrench className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-[#F3F4F1]">Turnkey As-Built Drawings</h3>
            <p className="text-xs text-[#889AA7] leading-relaxed">
              Every facility receives professional stamped electrical Single Line Diagrams (SLD), structural loading certificates, and flash test calibration reports.
            </p>
          </div>

        </div>

        {/* Technical Standards Summary Table */}
        <div className="p-6 sm:p-8 rounded-lg bg-[#18232B] border border-[rgba(243,244,241,0.12)]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#F2B544] mb-3 flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Component Standards</span>
              </h4>
              <ul className="space-y-2 text-xs text-[#889AA7]">
                {standards.hardwareStandards.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#F2B544] font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#F2B544] mb-3 flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Protection Hardware</span>
              </h4>
              <ul className="space-y-2 text-xs text-[#889AA7]">
                {standards.protectionGear.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#F2B544] font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#F2B544] mb-3 flex items-center gap-2">
                <FileText className="w-3.5 h-3.5" />
                <span>Engineering Documentation</span>
              </h4>
              <ul className="space-y-2 text-xs text-[#889AA7]">
                {standards.documentation.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#F2B544] font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
