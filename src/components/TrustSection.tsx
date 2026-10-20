'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Award, ExternalLink } from 'lucide-react';
import { TrustItem, fetchTrustItems } from '@/src/lib/supabase';
import { useLanguage } from '@/src/context/LanguageContext';

export const TrustSection: React.FC = () => {
  const { t } = useLanguage();
  const [trustItems, setTrustItems] = useState<TrustItem[]>([]);

  useEffect(() => {
    let isMounted = true;
    async function loadTrust() {
      try {
        const data = await fetchTrustItems();
        if (isMounted) setTrustItems(data);
      } catch (err) {
        console.warn('Error loading trust items:', err);
      }
    }
    loadTrust();
    return () => {
      isMounted = false;
    };
  }, []);

  if (trustItems.length === 0) {
    return null; // Only show publicly when admin has verified and published items
  }

  return (
    <section className="py-20 bg-[#101820] text-[#F3F4F1] border-b border-[rgba(243,244,241,0.08)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#18232B] border border-[rgba(242,181,68,0.3)] text-[#F2B544] text-[11px] font-mono font-bold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{t.trust.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-[#F3F4F1] tracking-tight leading-tight">
            {t.trust.headline}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#889AA7] leading-relaxed">
            {t.trust.subtext}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {trustItems.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-lg bg-[#18232B] border border-[rgba(243,244,241,0.12)] flex flex-col justify-between hover:border-[#F2B544]/50 transition-colors shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-[#1F8A83]/20 text-[#1F8A83] border border-[#1F8A83]/30">
                    {item.item_type.replace('_', ' ')}
                  </span>
                  <Award className="w-4 h-4 text-[#F2B544]" />
                </div>

                <h4 className="text-sm font-bold text-[#F3F4F1] font-heading">
                  {item.title}
                </h4>

                <p className="mt-2 text-xs text-[#889AA7] leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 mt-4 border-t border-[rgba(243,244,241,0.08)] flex items-center justify-between text-[11px] text-[#889AA7] font-mono">
                <span>{item.issuer_or_company || 'Verified Authority'}</span>
                {item.proof_url && (
                  <a
                    href={item.proof_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#F2B544] hover:underline inline-flex items-center gap-1"
                  >
                    <span>{t.trust.viewProof}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
