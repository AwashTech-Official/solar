'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Phone, Mail, MapPin, Send, CheckCircle2, AlertCircle, Clock, MessageSquare, SendHorizontal, Building2 } from 'lucide-react';
import { CompanySettings, fetchCompanySettings, createLead } from '@/src/lib/supabase';
import { siteConfig } from '@/src/config/site';
import { useLanguage } from '@/src/context/LanguageContext';

export const ContactSection: React.FC = () => {
  const { t, language } = useLanguage();
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [siteLocation, setSiteLocation] = useState('');
  const [monthlyBill, setMonthlyBill] = useState('');
  const [message, setMessage] = useState('');

  const [honeypot, setHoneypot] = useState('');
  const renderTimeRef = useRef<number>(0);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    renderTimeRef.current = Date.now();
    let isMounted = true;
    async function loadSettings() {
      try {
        const data = await fetchCompanySettings();
        if (isMounted) {
          setSettings(data);
        }
      } catch (err) {
        console.warn('Failed to load company settings for contact section:', err);
      }
    }
    loadSettings();
    return () => {
      isMounted = false;
    };
  }, []);

  const contactPhone = settings?.contact_phone || siteConfig.defaultContact.phone;
  const contactEmail = settings?.contact_email || siteConfig.defaultContact.email;
  const whatsappNumber = settings?.whatsapp || siteConfig.defaultContact.whatsapp;
  const telegramUrl = settings?.telegram_url || siteConfig.defaultContact.telegram;
  const address = settings?.address || siteConfig.defaultContact.address;
  const companyNameDisplay = settings?.company_name || siteConfig.businessName;

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();

    if (honeypot.trim().length > 0) {
      setIsSubmitted(true);
      return;
    }

    if (Date.now() - renderTimeRef.current < 2000) {
      setSubmitError('Submission processed too quickly. Please try again.');
      return;
    }

    if (!fullName.trim() || !companyName.trim() || !phone.trim()) {
      setSubmitError(t.form.errorRequired);
      return;
    }

    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const parsedBill = Number(monthlyBill) || 0;
      const result = await createLead({
        full_name: fullName.trim(),
        company_name: companyName.trim(),
        phone: phone.trim(),
        email: email.trim() || null,
        site_location: siteLocation.trim() || 'Addis Ababa / Regional Ethiopia',
        monthly_electricity_bill_etb: parsedBill,
        solution_interest: 'not_sure',
        message: message.trim() || 'Direct commercial EPC consultation inquiry.',
        source: 'website',
      });

      if (result.success) {
        setIsSubmitted(true);
        setFullName('');
        setCompanyName('');
        setPhone('');
        setEmail('');
        setSiteLocation('');
        setMonthlyBill('');
        setMessage('');
      } else {
        setSubmitError(result.error || 'Failed to submit inquiry. Please try again.');
      }
    } catch (err: any) {
      setSubmitError(err?.message || 'Network error communicating with server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-[#101820] text-[#F3F4F1] border-b border-[rgba(243,244,241,0.08)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#18232B] border border-[rgba(242,181,68,0.3)] text-[#F2B544] text-[11px] font-mono font-bold uppercase tracking-wider mb-3">
            <Building2 className="w-3.5 h-3.5" />
            <span>{t.contact.badge}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-[#F3F4F1] tracking-tight leading-tight">
            {t.contact.headline}
          </h2>

          <p className="mt-4 text-base sm:text-lg text-[#889AA7] leading-relaxed">
            {t.contact.subtext}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Direct Channels (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Phone Card */}
            {contactPhone && (
              <a
                href={`tel:${contactPhone.replace(/\s+/g, '')}`}
                className="p-5 rounded-lg bg-[#18232B] border border-[rgba(243,244,241,0.12)] hover:border-[#F2B544]/60 flex items-start gap-4 transition-all group cursor-pointer block"
              >
                <div className="w-10 h-10 rounded-md bg-[#F2B544]/15 text-[#F2B544] flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#889AA7]">{t.contact.phoneLabel}</div>
                  <div className="text-base font-bold font-mono text-[#F3F4F1] mt-0.5 group-hover:text-[#F2B544] transition-colors">
                    {contactPhone}
                  </div>
                  <div className="text-xs text-[#889AA7] mt-0.5">Mon – Sat: 8:00 AM – 6:00 PM EAT</div>
                </div>
              </a>
            )}

            {/* WhatsApp Card */}
            {whatsappNumber && (
              <a
                href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 rounded-lg bg-[#18232B] border border-[rgba(243,244,241,0.12)] hover:border-[#1F8A83]/70 flex items-start gap-4 transition-all group cursor-pointer block"
              >
                <div className="w-10 h-10 rounded-md bg-[#1F8A83]/20 text-[#1F8A83] flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#889AA7]">{t.contact.whatsappLabel}</div>
                  <div className="text-base font-bold font-mono text-[#F3F4F1] mt-0.5 group-hover:text-[#1F8A83] transition-colors">
                    {whatsappNumber}
                  </div>
                  <div className="text-xs text-[#889AA7] mt-0.5">Send utility bills or single-line diagrams directly</div>
                </div>
              </a>
            )}

            {/* Telegram Channel */}
            {telegramUrl && (
              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 rounded-lg bg-[#18232B] border border-[rgba(243,244,241,0.12)] hover:border-[#38bdf8]/60 flex items-start gap-4 transition-all group cursor-pointer block"
              >
                <div className="w-10 h-10 rounded-md bg-[#38bdf8]/15 text-[#38bdf8] flex items-center justify-center shrink-0">
                  <SendHorizontal className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#889AA7]">{t.contact.telegramLabel}</div>
                  <div className="text-base font-bold text-[#F3F4F1] mt-0.5 group-hover:text-[#38bdf8] transition-colors font-mono">
                    @SolEthCommercialSolar
                  </div>
                  <div className="text-xs text-[#889AA7] mt-0.5">Official EPC announcements and tariff updates</div>
                </div>
              </a>
            )}

            {/* Email Card */}
            {contactEmail && (
              <a
                href={`mailto:${contactEmail}`}
                className="p-5 rounded-lg bg-[#18232B] border border-[rgba(243,244,241,0.12)] hover:border-[#F2B544]/60 flex items-start gap-4 transition-all group cursor-pointer block"
              >
                <div className="w-10 h-10 rounded-md bg-[#F2B544]/15 text-[#F2B544] flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#889AA7]">{t.contact.emailLabel}</div>
                  <div className="text-base font-bold text-[#F3F4F1] mt-0.5 group-hover:text-[#F2B544] transition-colors font-mono">
                    {contactEmail}
                  </div>
                  <div className="text-xs text-[#889AA7] mt-0.5">Formal RFP dispatches and tender submissions</div>
                </div>
              </a>
            )}

            {/* Address */}
            <div className="p-5 rounded-lg bg-[#18232B] border border-[rgba(243,244,241,0.12)] flex items-start gap-4">
              <div className="w-10 h-10 rounded-md bg-[#101820] border border-[rgba(243,244,241,0.1)] text-[#889AA7] flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#889AA7]">{t.contact.officeLabel}</div>
                <div className="text-xs sm:text-sm font-semibold text-[#F3F4F1] mt-0.5 leading-snug">
                  {address}
                </div>
              </div>
            </div>

          </div>

          {/* Secondary Fast Lead Form (lg:col-span-7) */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-lg bg-[#18232B] border border-[rgba(243,244,241,0.12)] shadow-sm">
              <h3 className="text-lg font-bold font-heading text-[#F3F4F1]">
                {language === 'am' ? 'ለኢንጂነሪንግ ክፍላችን ቀጥታ መልዕክት ይላኩ' : 'Send a Direct Message to Our Project Desk'}
              </h3>
              <p className="mt-1 text-xs text-[#889AA7] leading-relaxed">
                {language === 'am'
                  ? 'ስለ ጄኔሬተር ጥምረት ወይም ስለ ጣሪያ የመሸከም አቅም ተጨማሪ ጥያቄ አለዎት? መረጃዎን እዚህ ያስቀምጡ።'
                  : 'Have specific technical inquiries about diesel generator synchronization or roof load capacity? Leave your coordinates below.'}
              </p>

              {isSubmitted ? (
                <div className="mt-6 p-6 rounded-md bg-[#101820] border border-[#1F8A83]/50 text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-[#1F8A83] mx-auto" />
                  <h4 className="text-base font-bold text-[#F3F4F1]">{t.form.successTitle}</h4>
                  <p className="text-xs text-[#889AA7]">
                    {t.form.successMessage}
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsSubmitted(false)}
                    className="mt-3 text-xs font-bold text-[#F2B544] hover:underline cursor-pointer"
                  >
                    Submit another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitLead} className="mt-6 space-y-3.5">
                  <div className="hidden" aria-hidden="true">
                    <input
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                    />
                  </div>

                  {submitError && (
                    <div className="p-3 rounded-md bg-red-950/70 border border-red-500/50 flex items-start gap-2.5 text-xs text-red-200">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#F3F4F1] mb-1">
                        {t.form.fullName}
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Ato / W/ro Name"
                        className="w-full px-3 py-2 rounded-md bg-[#101820] border border-[rgba(243,244,241,0.15)] text-xs text-[#F3F4F1] focus:outline-none focus:ring-1 focus:ring-[#F2B544]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#F3F4F1] mb-1">
                        {t.form.phone}
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+251 91 123 4567"
                        className="w-full px-3 py-2 rounded-md bg-[#101820] border border-[rgba(243,244,241,0.15)] text-xs text-[#F3F4F1] focus:outline-none focus:ring-1 focus:ring-[#F2B544]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#F3F4F1] mb-1">
                        {t.form.company}
                      </label>
                      <input
                        type="text"
                        required
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Facility or PLC Name"
                        className="w-full px-3 py-2 rounded-md bg-[#101820] border border-[rgba(243,244,241,0.15)] text-xs text-[#F3F4F1] focus:outline-none focus:ring-1 focus:ring-[#F2B544]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#F3F4F1] mb-1">
                        {t.form.location}
                      </label>
                      <input
                        type="text"
                        value={siteLocation}
                        onChange={(e) => setSiteLocation(e.target.value)}
                        placeholder="Addis Ababa / Industrial Park"
                        className="w-full px-3 py-2 rounded-md bg-[#101820] border border-[rgba(243,244,241,0.15)] text-xs text-[#F3F4F1] focus:outline-none focus:ring-1 focus:ring-[#F2B544]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#F3F4F1] mb-1">
                      {t.form.message}
                    </label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Outline your facility roof type, existing transformer capacity, or generator details..."
                      className="w-full px-3 py-2 rounded-md bg-[#101820] border border-[rgba(243,244,241,0.15)] text-xs text-[#F3F4F1] focus:outline-none focus:ring-1 focus:ring-[#F2B544]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 px-4 rounded-md bg-[#F2B544] hover:bg-[#d99f32] text-[#101820] font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-[#101820] border-t-transparent rounded-full animate-spin" />
                        <span>{t.form.submitting}</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>{t.form.submitBtn}</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
