'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Phone, MessageSquare, Send, Globe, Zap } from 'lucide-react';
import { siteConfig } from '@/src/config/site';
import { useLanguage } from '@/src/context/LanguageContext';
import { fetchCompanySettings, CompanySettings } from '@/src/lib/supabase';

interface NavbarProps {
  onOpenAssessment?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAssessment }) => {
  const { language, setLanguage, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [companySettings, setCompanySettings] = useState<CompanySettings | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let mounted = true;
    fetchCompanySettings().then((res) => {
      if (mounted && res) {
        setCompanySettings(res);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setMobileMenuOpen(false);
    if (href.startsWith('#')) {
      e.preventDefault();
      if (href === '#') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const targetElement = document.querySelector(href);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleAssessmentClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (onOpenAssessment) {
      onOpenAssessment();
    }
    const assessmentEl = document.querySelector('#assessment');
    if (assessmentEl) {
      assessmentEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const phone = companySettings?.contact_phone || siteConfig.defaultContact.phone;
  const whatsapp = companySettings?.whatsapp || siteConfig.defaultContact.whatsapp;
  const telegram = companySettings?.telegram_url || siteConfig.defaultContact.telegram;

  const navItems = [
    { name: t.nav.home, href: '#' },
    { name: t.nav.solutions, href: '#solutions' },
    { name: t.nav.howItWorks, href: '#process' },
    { name: t.nav.economics, href: '#calculator' },
    { name: t.nav.projects, href: '#projects' },
    { name: t.nav.about, href: '#about' },
    { name: t.nav.faq, href: '#faq' },
    { name: t.nav.contact, href: '#contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          isScrolled
            ? 'bg-[#101820]/95 backdrop-blur-md shadow-lg border-b border-[rgba(243,244,241,0.08)] py-2'
            : 'bg-gradient-to-b from-[#101820]/95 via-[#101820]/75 to-transparent py-3'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            {/* Brand Logo Zone */}
            <a
              href="#"
              onClick={(e) => handleNavClick(e, '#')}
              className="flex items-center gap-2.5 group"
            >
              <div className="w-9 h-9 rounded-md bg-[#18232B] border border-[#F2B544]/50 flex items-center justify-center shadow-sm group-hover:border-[#F2B544] transition-colors">
                <span className="text-[#F2B544] font-mono font-bold text-sm">SE</span>
              </div>
              <div className="flex flex-col">
                <span className="font-heading text-base font-extrabold text-[#F3F4F1] tracking-tight group-hover:text-[#F2B544] transition-colors leading-none">
                  SolEth<span className="text-[#F2B544]">.epc</span>
                </span>
                <span className="text-[9px] text-[#889AA7] font-mono tracking-widest uppercase mt-0.5 leading-none">
                  Commercial Solar Ethiopia
                </span>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1.5">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="px-2.5 py-1.5 rounded-md text-xs font-semibold text-[#889AA7] hover:text-[#F3F4F1] hover:bg-[#18232B] transition-colors"
                >
                  {item.name}
                </a>
              ))}
            </nav>

            {/* Right Tools: Direct Contacts, Language Toggle, and Main CTA */}
            <div className="hidden sm:flex items-center gap-2 xl:gap-3">
              {/* Quick direct contact links */}
              {phone && (
                <a
                  href={`tel:${phone.replace(/\s+/g, '')}`}
                  className="p-1.5 rounded-md text-[#889AA7] hover:text-[#F2B544] hover:bg-[#18232B] transition-colors"
                  title={`${t.nav.callNow}: ${phone}`}
                  aria-label="Call phone"
                >
                  <Phone className="w-3.5 h-3.5" />
                </a>
              )}
              {whatsapp && (
                <a
                  href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-md text-[#889AA7] hover:text-[#1F8A83] hover:bg-[#18232B] transition-colors"
                  title="WhatsApp"
                  aria-label="WhatsApp"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                </a>
              )}
              {telegram && (
                <a
                  href={telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-md text-[#889AA7] hover:text-[#38bdf8] hover:bg-[#18232B] transition-colors"
                  title="Telegram"
                  aria-label="Telegram"
                >
                  <Send className="w-3.5 h-3.5" />
                </a>
              )}

              {/* Language Switcher */}
              <div className="flex items-center rounded-md bg-[#18232B] border border-[rgba(243,244,241,0.12)] p-0.5 text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                    language === 'en'
                      ? 'bg-[#F2B544] text-[#101820] shadow-sm font-black'
                      : 'text-[#889AA7] hover:text-[#F3F4F1]'
                  }`}
                  aria-label="Switch to English"
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('am')}
                  className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                    language === 'am'
                      ? 'bg-[#F2B544] text-[#101820] shadow-sm font-black'
                      : 'text-[#889AA7] hover:text-[#F3F4F1]'
                  }`}
                  aria-label="Switch to Amharic"
                >
                  አማ
                </button>
              </div>

              {/* Admin shortcut */}
              <Link
                href="/admin"
                className="text-[11px] font-mono text-[#889AA7] hover:text-[#F3F4F1] transition-colors px-1.5 py-1"
              >
                Admin
              </Link>

              {/* Main Primary CTA */}
              <button
                type="button"
                onClick={handleAssessmentClick}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-[#F2B544] hover:bg-[#d99f32] text-[#101820] font-extrabold text-xs uppercase tracking-wider transition-all shadow-sm cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 fill-[#101820]" />
                <span>{t.nav.ctaButton}</span>
              </button>
            </div>

            {/* Mobile Hamburger Button + Mobile Lang Switcher */}
            <div className="lg:hidden flex items-center gap-2">
              <div className="flex items-center rounded-md bg-[#18232B] border border-[rgba(243,244,241,0.12)] p-0.5 text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => setLanguage(language === 'en' ? 'am' : 'en')}
                  className="px-2 py-0.5 rounded text-[#F2B544] flex items-center gap-1 font-extrabold"
                  aria-label="Toggle language"
                >
                  <Globe className="w-3 h-3" />
                  <span>{language === 'en' ? 'አማ' : 'EN'}</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md bg-[#18232B] text-[#F3F4F1] hover:bg-[#202f3a] transition-colors border border-[rgba(243,244,241,0.1)]"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#101820]/95 backdrop-blur-md lg:hidden pt-20 px-6 pb-8 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-2">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="block p-3 rounded-md bg-[#18232B] text-sm font-bold text-[#F3F4F1] hover:text-[#F2B544] border border-[rgba(243,244,241,0.06)]"
              >
                {item.name}
              </a>
            ))}

            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-3 rounded-md bg-[#18232B] text-sm font-mono text-[#889AA7] border border-[rgba(243,244,241,0.06)]"
            >
              Admin Portal
            </Link>

            {/* Direct mobile contact options */}
            <div className="pt-2 flex items-center gap-3">
              {phone && (
                <a
                  href={`tel:${phone.replace(/\s+/g, '')}`}
                  className="flex-1 py-2.5 px-3 rounded-md bg-[#18232B] border border-[rgba(243,244,241,0.1)] text-xs font-bold text-[#F3F4F1] flex items-center justify-center gap-2"
                >
                  <Phone className="w-3.5 h-3.5 text-[#F2B544]" />
                  <span>Call</span>
                </a>
              )}
              {whatsapp && (
                <a
                  href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-3 rounded-md bg-[#18232B] border border-[rgba(243,244,241,0.1)] text-xs font-bold text-[#F3F4F1] flex items-center justify-center gap-2"
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
                  className="flex-1 py-2.5 px-3 rounded-md bg-[#18232B] border border-[rgba(243,244,241,0.1)] text-xs font-bold text-[#F3F4F1] flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5 text-[#38bdf8]" />
                  <span>Telegram</span>
                </a>
              )}
            </div>
          </div>

          <div className="pt-6">
            <button
              type="button"
              onClick={handleAssessmentClick}
              className="w-full py-3.5 rounded-md bg-[#F2B544] text-[#101820] font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-[#101820]" />
              <span>{t.nav.ctaButton}</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};
