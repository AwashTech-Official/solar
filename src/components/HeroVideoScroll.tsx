'use client';

import React, { useState } from 'react';
import { siteConfig } from '@/src/config/site';
import { VideoSection } from './VideoSection';
import { useLanguage } from '@/src/context/LanguageContext';

export const HeroVideoScroll: React.FC = () => {
  // Shared audio state persisted across all 3 video sections
  // Initial state is true (muted) to guarantee reliable browser autoplay
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const { t } = useLanguage();

  const handleToggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  // Localized chapter eyebrows, headlines, micro-labels, subtexts, and CTAs
  const getChapterData = (index: number) => {
    if (index === 0) {
      return {
        eyebrow: t.hero.ch1Eyebrow,
        headline: t.hero.ch1Headline,
        microLabel: t.hero.ch1MicroLabel,
        subtext: t.hero.ch1Subtext,
        buttonLabel: t.hero.ch1Cta,
        buttonHref: '#calculator',
      };
    }
    if (index === 1) {
      return {
        eyebrow: t.hero.ch2Eyebrow,
        headline: t.hero.ch2Headline,
        microLabel: t.hero.ch2MicroLabel,
        subtext: t.hero.ch2Subtext,
        buttonLabel: t.hero.ch2Cta,
        buttonHref: '#solutions',
      };
    }
    return {
      eyebrow: t.hero.ch3Eyebrow,
      headline: t.hero.ch3Headline,
      microLabel: t.hero.ch3MicroLabel,
      subtext: t.hero.ch3Subtext,
      buttonLabel: t.hero.ch3Cta,
      buttonHref: '#assessment',
    };
  };

  return (
    <div id="videos" className="relative w-full">
      {siteConfig.videos.map((item, index) => {
        const localized = getChapterData(index);
        return (
          <VideoSection
            key={item.id}
            id={`hero-${index}`}
            index={index}
            total={siteConfig.videos.length}
            videoUrl={item.videoUrl}
            eyebrow={localized.eyebrow}
            headline={localized.headline}
            microLabel={localized.microLabel}
            subtext={localized.subtext}
            buttonLabel={localized.buttonLabel}
            buttonHref={localized.buttonHref}
            scrollLength={item.scrollLength}
            autoplayRate={item.autoplayRate}
            boostedRate={item.boostedRate}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
          />
        );
      })}
    </div>
  );
};
