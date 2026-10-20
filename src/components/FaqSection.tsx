'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { siteConfig } from '@/src/config/site';
import { useLanguage } from '@/src/context/LanguageContext';

export const FaqSection: React.FC = () => {
  const { t, language } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Localized FAQs
  const localizedFaqs = language === 'am' ? [
    {
      question: 'የኢትዮጵያ ኤሌክትሪክ አገልግሎት (EEU) የታሪፍ ማሻሻያ በንግድ ሶላር ወጪ መመለሻ ላይ ምን ተፅዕኖ አለው?',
      shortAnswer: 'የኢትዮጵያ ኤሌክትሪክ አገልግሎት የወጪ ማካካሻ የታሪፍ ማሻሻያ እያደረገ ይገኛል። የቀን የንግድና የኢንዱስትሪ ታሪፎች እና የከፍተኛ ፍላጎት (kVA) ተመኖች ሲጨምሩ፣ በጣሪያዎ ላይ የሚመነጨው እያንዳንዱ ኪሎዋት ሰዓት ውድ የሆነውን የፍርግርግ ግዢ በቀጥታ ስለሚተካ፣ የሶላር ወጪ መመለሻ ጊዜን ያሳጥረዋል።'
    },
    {
      question: 'ሶላር ከነባር የፋብሪካ ናፍጣ ጄኔሬተር ጋር በቀጥታ ሊጣመር ይችላል?',
      shortAnswer: 'አዎ። በሶላር + ጄኔሬተር ጥምር (Hybrid) መቆጣጠሪያችን አማካኝነት በመብራት መቆራረጥ ወቅት ሶላር ከሚሰራው ጄኔሬተር ጋር በቀጥታ ይጣመራል። መቆጣጠሪያው የሞተሩን ጤንነት ለመጠበቅ ቢያንስ 25–30% ጭነት በጄኔሬተሩ ላይ እንዲቆይ በማድረግ፣ በቀን መቆራረጥ ወቅት የናፍጣ ፍጆታን ከ30% እስከ 65% ይቀንሳል።'
    },
    {
      question: 'ከፍርግርግ ጋር የተገናኘ (Grid-Tied) ሶላር ብቻ ካለን መብራት ሲጠፋ ኃይል እናገኛለን?',
      shortAnswer: 'መደበኛ ከፍርግርግ ጋር የተገናኘ (Grid-Tied) ኢንቨርተር ለፍርግርግ ሰራተኞች ደህንነት ሲባል መብራት ሲጠፋ በቅጽበት ይቋረጣል። ተቋምዎ ያለማቋረጥ ኃይል እንዲያገኝ ከተፈለገ፣ የሊቲየም ባትሪ (BESS) ወይም የጄኔሬተር ጥምር መቆጣጠሪያ እንገጥማለን።'
    },
    {
      question: 'ሶላር በጣሪያ ላይ መትከል የጣሪያውን የውሃ መከላከያ ወይም ዋስትና ያበላሻል?',
      shortAnswer: 'አይ። የህንፃና ጣሪያ መሀንዲሶቻችን ጥልቅ የጣሪያ ፍተሻ ያካሂዳሉ። ለቆርቆሮና ስታንዲንግ ሲም ጣሪያዎች ጣሪያውን ሳይበሱ የሚገጠሙ የአሉሚኒየም ክላምፖችን እንጠቀማለን። ለኮንክሪት ጠፍጣፋ ጣሪያዎች በ140 ኪ.ሜ/ሰዓት ንፋስ የማይነቃነቅ ባላስትድ ድጋፍ እንጠቀማለን።'
    },
    {
      question: 'የሶልኤዝ (SolEth EPC) የዋስትናና የጥራት ማረጋገጫዎች ምን ይመስላሉ?',
      shortAnswer: 'የ25-ዓመት የፓነል የኃይል ማመንጨት ዋስትና (በ25ኛ ዓመት >=84.8% ምርት)፣ ከ5 እስከ 10 ዓመት የኢንቨርተር ዋስትና፣ የ10-ዓመት / 6,000-ሳይክል የሊቲየም ባትሪ ዋስትና እና የ2-ዓመት የሙሉ ተከላና የምህንድስና ስራ ዋስትና እንሰጣለን።'
    },
    {
      question: 'የውጭ ምንዛሪና የሶላር እቃዎች ወደ አገር ውስጥ አገባብ እንዴት ይከናወናል?',
      shortAnswer: 'በህጋዊ የባንክ መስመሮች እና በካፒታል እቃዎች ፋይናንሲንግ ማዕቀፍ እንሰራለን። እቃዎች በታዳሽ ኃይል ኢንቨስትመንት ማበረታቻ መሰረት ከቀረጥ ነፃ ሆነው በሞጆ ደረቅ ወደብ በኩል በፍጥነት ክሊራንስ ተሰርቶላቸው ይገባሉ።'
    }
  ] : siteConfig.faqs;

  return (
    <section id="faq" className="py-20 bg-[#101820] text-[#F3F4F1] border-b border-[rgba(243,244,241,0.08)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#18232B] border border-[rgba(242,181,68,0.3)] text-[#F2B544] text-[11px] font-mono font-bold uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{t.faq.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-[#F3F4F1] tracking-tight leading-tight">
            {t.faq.headline}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#889AA7] leading-relaxed">
            {t.faq.subtext}
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3.5">
          {localizedFaqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className={`rounded-lg border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'border-[#F2B544]/60 bg-[#18232B] shadow-md'
                    : 'border-[rgba(243,244,241,0.08)] bg-[#18232B] hover:border-[#F2B544]/30'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleItem(index)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F2B544]"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg font-bold text-[#F3F4F1] font-heading">
                    {faq.question}
                  </span>
                  <div
                    className={`shrink-0 w-7 h-7 rounded-md flex items-center justify-center transition-transform duration-200 ${
                      isOpen ? 'rotate-180 bg-[#F2B544]/20 text-[#F2B544]' : 'bg-[#101820] text-[#889AA7]'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-[#889AA7] leading-relaxed border-t border-[rgba(243,244,241,0.06)] pt-4">
                    <p>{faq.shortAnswer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
