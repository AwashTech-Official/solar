'use client';

import React from 'react';
import Image from 'next/image';
import { CheckCircle2, ShieldCheck, Compass, Sliders, CheckSquare2 } from 'lucide-react';
import { useLanguage } from '@/src/context/LanguageContext';

export const AboutSection: React.FC = () => {
  const { t } = useLanguage();

  const principles = [
    {
      title: 'Assess the Site',
      description: 'Audit roof structural load capacity, ambient thermal exposure, and utility point of common coupling before proposing system capacity.',
      icon: Compass,
    },
    {
      title: 'Design for the Load',
      description: 'Match daytime photovoltaic generation and optional energy storage directly to operational factory and facility load curves.',
      icon: Sliders,
    },
    {
      title: 'Test Before Handover',
      description: 'Perform rigorous protection relay checks, anti-islanding trip calibration, and revenue-grade telemetry verification prior to energization.',
      icon: CheckSquare2,
    },
  ];

  return (
    <section id="about" className="py-20 md:py-28 bg-[#F5F7F2] text-[#17241D] border-b border-[rgba(18,55,42,0.14)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Asymmetric Two-Column Editorial Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Editorial Copy & Principles (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#12372A] text-[#B7D957] text-[11px] font-mono font-bold uppercase tracking-wider mb-4">
                <span>ENGINEERING-LED DELIVERY</span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-[#12372A] tracking-tight leading-tight">
                {t.about.headline}
              </h2>

              <div className="w-16 h-0.5 bg-[#2F7D57] mt-5 mb-6" />

              <p className="text-base sm:text-lg text-[#647368] leading-relaxed">
                Commercial solar in Ethiopia requires engineering discipline tailored to local grid realities, high-altitude solar irradiance, and diesel generator integration. SolEth designs turnkey on-site systems built around verified facility electrical loads.
              </p>
            </div>

            <div className="space-y-4 text-sm sm:text-base text-[#647368] leading-relaxed">
              <p>
                Rather than selling generic equipment packages, our engineering team evaluates facility operating hours, seasonal utility billing schedules, and existing switchgear protection. Every kWp installed is designed to maximize self-consumption and lower peak kVA demand charges without risking uncoordinated generator backfeed.
              </p>
            </div>

            {/* Evidence-Based Principles */}
            <div className="space-y-4 pt-4 border-t border-[rgba(18,55,42,0.14)]">
              <h3 className="text-xs font-mono font-bold text-[#2F7D57] uppercase tracking-wider">
                Engineering Governance Principles
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {principles.map((principle, idx) => {
                  const Icon = principle.icon;
                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-lg bg-[#FFFFFF] border border-[rgba(18,55,42,0.14)] shadow-xs hover:border-[#2F7D57] transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="w-4 h-4 text-[#2F7D57] shrink-0" />
                        <h4 className="text-xs sm:text-sm font-bold text-[#12372A] font-heading">
                          {principle.title}
                        </h4>
                      </div>
                      <p className="text-xs text-[#647368] leading-relaxed">
                        {principle.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column: Purposeful Photo Crop (5 cols) */}
          <div className="lg:col-span-5">
            <div className="relative rounded-lg overflow-hidden shadow-md border border-[rgba(18,55,42,0.14)] aspect-[4/5] bg-[#12372A] group">
              <Image
                src="https://images.pexels.com/photos/4254161/pexels-photo-4254161.jpeg?cs=srgb&dl=pexels-gustavo-fring-4254161.jpg&fm=jpg"
                alt="Solar technicians reviewing a photovoltaic installation on a rooftop."
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover group-hover:scale-102 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#12372A]/90 via-transparent to-black/25" />

              {/* Bottom Honest Label Card */}
              <div className="absolute bottom-5 inset-x-5 p-4 rounded-md bg-[#0B241B]/95 backdrop-blur-md border border-[rgba(255,255,255,0.15)] flex items-center gap-3 text-[#F5F7F2]">
                <div className="w-10 h-10 rounded-md bg-[#2F7D57]/20 text-[#B7D957] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-[#B7D957]" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#FFFFFF]">
                    On-Site Electrical Quality Control
                  </div>
                  <div className="text-[11px] text-[#F5F7F2]/80 leading-snug mt-0.5 font-mono">
                    Illustrative engineering imagery · Pexels / Gustavo Fring
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
