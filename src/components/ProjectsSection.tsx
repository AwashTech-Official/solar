'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Briefcase, AlertTriangle, CheckCircle2, MapPin, Zap, ArrowRight } from 'lucide-react';
import { Project, fetchPublishedProjects } from '@/src/lib/supabase';
import { useLanguage } from '@/src/context/LanguageContext';

export const ProjectsSection: React.FC = () => {
  const { t } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    async function loadProjects() {
      try {
        const data = await fetchPublishedProjects();
        if (isMounted) setProjects(data);
      } catch (err) {
        console.warn('Error fetching published projects:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadProjects();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section id="projects" className="py-20 bg-[#101820] text-[#F3F4F1] border-b border-[rgba(243,244,241,0.08)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#18232B] border border-[rgba(242,181,68,0.3)] text-[#F2B544] text-[11px] font-mono font-bold uppercase tracking-wider mb-3">
            <Briefcase className="w-3.5 h-3.5" />
            <span>{t.projects.badge}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-[#F3F4F1] tracking-tight leading-tight">
            {t.projects.headline}
          </h2>

          <p className="mt-4 text-base sm:text-lg text-[#889AA7] leading-relaxed">
            {t.projects.subtext}
          </p>
        </div>

        {/* Content Guard: If no published projects exist, show honest empty-state */}
        {projects.length === 0 ? (
          <div className="p-8 sm:p-10 rounded-lg bg-[#18232B] border border-[rgba(243,244,241,0.12)] text-center space-y-4 max-w-2xl mx-auto">
            <div className="w-12 h-12 rounded-md bg-[#F2B544]/15 text-[#F2B544] flex items-center justify-center mx-auto border border-[#F2B544]/30">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#F3F4F1]">
              {t.projects.emptyTitle}
            </h3>
            <p className="text-xs sm:text-sm text-[#889AA7] leading-relaxed">
              {t.projects.emptyDesc}
            </p>
            <div className="pt-2">
              <a
                href="#assessment"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-[#F2B544] hover:bg-[#d99f32] text-[#101820] font-black text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                <span>{t.projects.emptyCta}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {projects.map((proj) => (
              <div
                key={proj.id || proj.slug}
                className="rounded-lg bg-[#18232B] border border-[rgba(243,244,241,0.12)] overflow-hidden shadow-sm flex flex-col justify-between hover:border-[#F2B544]/50 transition-colors"
              >
                <div>
                  {/* Cover Image */}
                  <div className="relative h-52 w-full bg-[#101820]">
                    {proj.cover_image_url ? (
                      <Image
                        src={proj.cover_image_url}
                        alt={proj.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#889AA7]">
                        <Zap className="w-10 h-10 text-[#F2B544]/40" />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-[#18232B] via-transparent to-black/30" />

                    {/* Illustrative warning label required by Prompt F */}
                    {proj.is_illustrative && (
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#F2B544] text-[#101820] text-[10px] font-mono font-bold uppercase tracking-wider shadow-sm">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>{t.projects.illustrativeNotice}</span>
                      </div>
                    )}

                    <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded bg-[#101820]/90 border border-[rgba(243,244,241,0.15)] text-xs font-mono font-bold text-[#F2B544]">
                      {proj.capacity_kwp} kWp
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6">
                    <div className="flex items-center gap-1.5 text-xs text-[#889AA7] mb-2 font-mono">
                      <MapPin className="w-3.5 h-3.5 text-[#F2B544]" />
                      <span>{proj.location}</span>
                      <span>•</span>
                      <span>{proj.customer_sector}</span>
                    </div>

                    <h3 className="text-base font-bold font-heading text-[#F3F4F1] line-clamp-2">
                      {proj.title}
                    </h3>

                    <p className="mt-2 text-xs text-[#889AA7] leading-relaxed line-clamp-3">
                      {proj.project_description}
                    </p>

                    {/* Verified Metrics */}
                    <div className="mt-4 pt-3 border-t border-[rgba(243,244,241,0.08)] grid grid-cols-2 gap-2 text-xs font-mono">
                      {proj.monthly_generation_kwh && (
                        <div>
                          <div className="text-[10px] text-[#889AA7]">{t.projects.monthlyGen}</div>
                          <div className="font-bold text-[#F3F4F1]">
                            {Number(proj.monthly_generation_kwh).toLocaleString('en-US')} kWh
                          </div>
                        </div>
                      )}
                      {proj.monthly_savings_etb && (
                        <div>
                          <div className="text-[10px] text-[#889AA7]">{t.projects.monthlySavings}</div>
                          <div className="font-bold text-[#1F8A83]">
                            {Number(proj.monthly_savings_etb).toLocaleString('en-US')} ETB
                          </div>
                        </div>
                      )}
                    </div>

                    {proj.verification_note && (
                      <p className="mt-3 text-[11px] text-[#889AA7] italic border-t border-[rgba(243,244,241,0.06)] pt-2">
                        {proj.verification_note}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
