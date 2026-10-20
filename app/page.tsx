'use client';

import React, { useState } from 'react';
import { Navbar } from '@/src/components/Navbar';
import { HeroVideoScroll } from '@/src/components/HeroVideoScroll';
import { EnergyProblemSection } from '@/src/components/EnergyProblemSection';
import { SolutionsSection } from '@/src/components/SolutionsSection';
import { RequestAssessmentSection } from '@/src/components/RequestAssessmentSection';
import { Showcase3DSection } from '@/src/components/Showcase3DSection';
import { ProcessSection } from '@/src/components/ProcessSection';
import { TechnicalStandardsSection } from '@/src/components/TechnicalStandardsSection';
import { ProjectsSection } from '@/src/components/ProjectsSection';
import { TrustSection } from '@/src/components/TrustSection';
import { AboutSection } from '@/src/components/AboutSection';
import { FaqSection } from '@/src/components/FaqSection';
import { ContactSection } from '@/src/components/ContactSection';
import { Footer } from '@/src/components/Footer';
import { LanguageProvider } from '@/src/context/LanguageContext';
import { SolutionInterest } from '@/src/lib/supabase';

function HomePageContent() {
  const [selectedSolutionInterest, setSelectedSolutionInterest] = useState<SolutionInterest>('not_sure');

  const handleSelectSolution = (interest: SolutionInterest) => {
    setSelectedSolutionInterest(interest);
  };

  const handleOpenAssessment = () => {
    const assessmentEl = document.querySelector('#assessment');
    if (assessmentEl) {
      assessmentEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#101820] text-[#F3F4F1]">
      {/* Sticky Top Navigation with Bilingual Toggle & Direct Actions */}
      <Navbar onOpenAssessment={handleOpenAssessment} />

      <main className="flex-1 w-full">
        {/* 1. Three Active, Meaningful Video Scroll Chapters */}
        <HeroVideoScroll />

        {/* 2. Concise "Why Now" Energy-Cost Problem Section with Dated EEU Facts */}
        <EnergyProblemSection />

        {/* 3. Solutions: Solar Only, Solar + Battery, Solar + Generator Hybrid */}
        <SolutionsSection onSelectSolutionForAssessment={handleSelectSolution} />

        {/* 4. Interactive ROI & Tariff Calculator + Sourced Forecast & Lead Capture Form */}
        <RequestAssessmentSection key={selectedSolutionInterest} initialSolutionInterest={selectedSolutionInterest} />

        {/* 5. 3D Physical Architecture Walkthrough (From Sunlight to Site Power) */}
        <Showcase3DSection />

        {/* 6. How It Works: 8-Stage Turnkey EPC Roadmap */}
        <ProcessSection />

        {/* 7. Engineering Standards & EEU Grid Interconnection Compliance */}
        <TechnicalStandardsSection />

        {/* 8. Published Project Evidence (Only Real Verified Entries or Honest Empty State) */}
        <ProjectsSection />

        {/* 9. Regulatory Trust & Compliance Credentials */}
        <TrustSection />

        {/* 10. Engineering Stewardship & Local Addis Ababa Team */}
        <AboutSection />

        {/* 11. Frequently Asked Questions */}
        <FaqSection />

        {/* 12. Contact Desk & Direct Consultation Channels */}
        <ContactSection />
      </main>

      {/* 13. Footer */}
      <Footer />
    </div>
  );
}

export default function HomePage() {
  return (
    <LanguageProvider>
      <HomePageContent />
    </LanguageProvider>
  );
}
