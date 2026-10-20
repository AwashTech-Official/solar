'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, ShieldCheck, ArrowRight, SendHorizontal, MessageSquare } from 'lucide-react';
import { siteConfig } from '@/src/config/site';
import { CompanySettings, fetchCompanySettings } from '@/src/lib/supabase';
import { useLanguage } from '@/src/context/LanguageContext';

export const Footer: React.FC = () => {
  const { t, language } = useLanguage();
  const [settings, setSettings] = useState<CompanySettings | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadFooterData() {
      try {
        const data = await fetchCompanySettings();
        if (isMounted) setSettings(data);
      } catch (err) {
        console.warn('Error loading footer company settings:', err);
      }
    }
    loadFooterData();
    return () => {
      isMounted = false;
    };
  }, []);

  const companyName = settings?.company_name || siteConfig.businessName;
  const phone = settings?.contact_phone || siteConfig.defaultContact.phone;
  const email = settings?.contact_email || siteConfig.defaultContact.email;
  const whatsapp = settings?.whatsapp || siteConfig.defaultContact.whatsapp;
  const telegram = settings?.telegram_url || siteConfig.defaultContact.telegram;
  const address = settings?.address || siteConfig.defaultContact.address;
  const serviceAreas = settings?.service_areas || [
    'Addis Ababa & Oromia Special Zone',
    'Hawassa & Sidama Industrial Corridor',
    'Dire Dawa Free Trade Zone',
    'Adama Industrial Park Area',
    'Kombolcha Manufacturing Hub',
  ];

  return (
    <footer className="bg-[#101820] text-[#889AA7] border-t border-[rgba(243,244,241,0.08)] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-[rgba(243,244,241,0.08)]">
          
          {/* Brand & Identity Column (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-md bg-[#18232B] border border-[#F2B544]/50 flex items-center justify-center shadow-sm">
                <span className="text-[#F2B544] font-mono font-bold text-sm">SE</span>
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-extrabold text-base text-[#F3F4F1] tracking-tight">
                  {companyName}
                </span>
                <span className="text-[9px] tracking-widest uppercase text-[#F2B544] font-mono font-bold">
                  Commercial Solar EPC Contractor
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#889AA7] leading-relaxed max-w-sm">
              {t.footer.description}
            </p>

            <div className="flex items-center gap-2 text-xs text-[#F2B544] font-mono">
              <ShieldCheck className="w-4 h-4 text-[#1F8A83] shrink-0" />
              <span>{t.footer.regulatoryNotice}</span>
            </div>

            {/* Quick Contact Links */}
            <div className="flex flex-wrap gap-2 pt-1">
              {whatsapp && (
                <a
                  href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#18232B] text-xs font-semibold text-[#F3F4F1] hover:bg-[#1F8A83]/20 hover:text-[#1F8A83] transition-colors border border-[rgba(243,244,241,0.08)]"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#1F8A83]" />
                  <span>WhatsApp</span>
                </a>
              )}

              {telegram && (
                <a
                  href={telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#18232B] text-xs font-semibold text-[#F3F4F1] hover:bg-[#38bdf8]/20 hover:text-[#38bdf8] transition-colors border border-[rgba(243,244,241,0.08)]"
                >
                  <SendHorizontal className="w-3.5 h-3.5 text-[#38bdf8]" />
                  <span>Telegram</span>
                </a>
              )}
            </div>
          </div>

          {/* Quick Links Column (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#F3F4F1]">
              {t.footer.solutionsNav}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#solutions" className="hover:text-[#F2B544] transition-colors">
                  Commercial Grid-Tied Solar
                </a>
              </li>
              <li>
                <a href="#solutions" className="hover:text-[#F2B544] transition-colors">
                  Solar + Battery Storage (BESS)
                </a>
              </li>
              <li>
                <a href="#solutions" className="hover:text-[#F2B544] transition-colors">
                  Solar + Diesel Generator Hybrids
                </a>
              </li>
              <li>
                <a href="#calculator" className="hover:text-[#F2B544] transition-colors">
                  Interactive Tariff & ROI Calculator
                </a>
              </li>
              <li>
                <a href="#process" className="hover:text-[#F2B544] transition-colors">
                  8-Stage Turnkey EPC Roadmap
                </a>
              </li>
              <li>
                <a href="#standards" className="hover:text-[#F2B544] transition-colors">
                  EEU Interconnection Standards
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-[#F2B544] transition-colors">
                  Technical FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* Operations & Location Column (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#F3F4F1]">
              Addis Ababa Operations Hub
            </h4>
            
            <div className="text-xs space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#F2B544] shrink-0 mt-0.5" />
                <span>{address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#F2B544] shrink-0" />
                <span className="font-mono">{phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#F2B544] shrink-0" />
                <span className="font-mono">{email}</span>
              </div>
            </div>

            <div className="pt-2">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#889AA7] mb-1.5">
                Service Corridors
              </div>
              <div className="flex flex-wrap gap-1">
                {serviceAreas.slice(0, 4).map((area, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#18232B] text-[#cbd5e1] border border-[rgba(243,244,241,0.06)]"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Legal Disclaimer & Regulatory Note */}
        <div className="py-6 border-b border-[rgba(243,244,241,0.06)] text-[10px] text-[#889AA7] leading-relaxed">
          <strong className="text-[#F3F4F1] font-mono">REGULATORY DISCLAIMER: </strong>
          {t.footer.legalNotice}
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
          <div suppressHydrationWarning>
            © {new Date().getFullYear()} {companyName}. {t.footer.rights}
          </div>
          <div className="flex items-center gap-6">
            <Link href="/admin" className="text-[#889AA7] hover:text-[#F2B544] transition-colors">
              {t.footer.adminLink}
            </Link>
            <a href="#assessment" className="text-[#F2B544] hover:underline font-bold">
              {t.nav.ctaButton}
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
