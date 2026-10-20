'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'am';

export interface Translations {
  nav: {
    home: string;
    solutions: string;
    howItWorks: string;
    economics: string;
    projects: string;
    about: string;
    faq: string;
    contact: string;
    ctaButton: string;
    callNow: string;
    whatsapp: string;
    telegram: string;
  };
  hero: {
    ch1Eyebrow: string;
    ch1Headline: string;
    ch1MicroLabel: string;
    ch1Subtext: string;
    ch1Cta: string;
    ch2Eyebrow: string;
    ch2Headline: string;
    ch2MicroLabel: string;
    ch2Subtext: string;
    ch2Cta: string;
    ch3Eyebrow: string;
    ch3Headline: string;
    ch3MicroLabel: string;
    ch3Subtext: string;
    ch3Cta: string;
    skip: string;
    chapter: string;
    scrollPrompt: string;
    muteTooltip: string;
    unmuteTooltip: string;
  };
  energyProblem: {
    badge: string;
    headline: string;
    subtext: string;
    tariffCardTitle: string;
    tariffCardDesc: string;
    tariffCardStat: string;
    tariffCardMeta: string;
    dieselCardTitle: string;
    dieselCardDesc: string;
    dieselCardStat: string;
    dieselCardMeta: string;
    reliabilityCardTitle: string;
    reliabilityCardDesc: string;
    reliabilityCardStat: string;
    reliabilityCardMeta: string;
    disclaimer: string;
  };
  solutions: {
    badge: string;
    headline: string;
    subtext: string;
    allFilter: string;
    gridTiedFilter: string;
    bessFilter: string;
    hybridFilter: string;
    suitableFor: string;
    features: string;
    capacityRange: string;
    selectForAssessment: string;
    disclaimer: string;
  };
  calculator: {
    badge: string;
    headline: string;
    subtext: string;
    billLabel: string;
    billPlaceholder: string;
    advancedToggle: string;
    kwhLabel: string;
    dieselLitersLabel: string;
    dieselPriceLabel: string;
    offsetSliderLabel: string;
    summaryHeadline: string;
    estimatedAnnualOffset: string;
    estimatedMonthlyOffset: string;
    estimatedDieselOffset: string;
    estimatedPayback: string;
    unconfiguredNotice: string;
    useInputsInFormBtn: string;
    inputsCopiedSuccess: string;
    methodologyNoteTitle: string;
    methodologyNote: string;
    disclaimer: string;
  };
  tariff: {
    badge: string;
    headline: string;
    subtext: string;
    commercialTab: string;
    industrialTab: string;
    legendHistorical: string;
    legendCurrent: string;
    legendForecast: string;
    forecastWarning: string;
    sourcePrefix: string;
    verifiedOnPrefix: string;
  };
  showcase3D: {
    badge: string;
    title: string;
    subtitle: string;
    illustrativeBadge: string;
    illustrativeNote: string;
    dragPrompt: string;
  };
  process: {
    badge: string;
    headline: string;
    subtext: string;
    timelineNotice: string;
  };
  projects: {
    badge: string;
    headline: string;
    subtext: string;
    emptyTitle: string;
    emptyDesc: string;
    emptyCta: string;
    illustrativeNotice: string;
    capacity: string;
    monthlyGen: string;
    monthlySavings: string;
  };
  trust: {
    badge: string;
    headline: string;
    subtext: string;
    verifiedBadge: string;
    viewProof: string;
  };
  about: {
    badge: string;
    headline: string;
    subtext: string;
    localTeamGuarantee: string;
    localTeamSub: string;
  };
  faq: {
    badge: string;
    headline: string;
    subtext: string;
  };
  form: {
    badge: string;
    headline: string;
    subtext: string;
    fullName: string;
    phone: string;
    company: string;
    location: string;
    industry: string;
    selectIndustry: string;
    monthlyBill: string;
    monthlyKwh: string;
    monthlyDiesel: string;
    interest: string;
    selectInterest: string;
    solarOnly: string;
    solarBess: string;
    solarHybrid: string;
    notSure: string;
    message: string;
    submitBtn: string;
    submitting: string;
    successTitle: string;
    successMessage: string;
    errorRequired: string;
    responseTimeNotice: string;
    privacyNote: string;
  };
  contact: {
    badge: string;
    headline: string;
    subtext: string;
    officeAddress: string;
    officeLabel: string;
    phoneLabel: string;
    emailLabel: string;
    whatsappLabel: string;
    telegramLabel: string;
  };
  footer: {
    description: string;
    solutionsNav: string;
    engineeringNav: string;
    legalNotice: string;
    regulatoryNotice: string;
    adminLink: string;
    rights: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    nav: {
      home: 'Home',
      solutions: 'Solutions',
      howItWorks: 'How It Works',
      economics: 'Economics',
      projects: 'Projects',
      about: 'About',
      faq: 'FAQ',
      contact: 'Contact',
      ctaButton: 'Request a Site Assessment',
      callNow: 'Direct Line',
      whatsapp: 'WhatsApp',
      telegram: 'Telegram',
    },
    hero: {
      ch1Eyebrow: '01 / SITE ASSESSMENT',
      ch1Headline: 'Your Roof Is an Energy Asset.',
      ch1MicroLabel: 'Roof area · Shading · Load profile',
      ch1Subtext: 'A credible proposal starts with the site and the way your business uses power.',
      ch1Cta: 'Explore the Economics',
      ch2Eyebrow: '02 / ENGINEERING',
      ch2Headline: 'Designed Around Your Load.',
      ch2MicroLabel: 'PV generation · Optional storage · Generator integration',
      ch2Subtext: 'System choices should reflect operating hours, peak demand, grid conditions and site constraints.',
      ch2Cta: 'Compare System Architectures',
      ch3Eyebrow: '03 / COMMISSIONING',
      ch3Headline: 'From Estimate to Operating Plan.',
      ch3MicroLabel: 'Electrical checks · Monitoring setup · Handover',
      ch3Subtext: 'Confirm the site, review the proposal, and define how the system will be tested and monitored.',
      ch3Cta: 'Request a Site Assessment',
      skip: 'Skip Video',
      chapter: 'Chapter',
      scrollPrompt: 'Scroll down to explore system chapters',
      muteTooltip: 'Click to unmute sound',
      unmuteTooltip: 'Click to mute sound',
    },
    energyProblem: {
      badge: 'Operating Energy Reality',
      headline: 'Commercial Energy in Ethiopia: Structural Shifts & Exposure',
      subtext: 'Electricity tariffs are advancing through scheduled regulatory reforms, and diesel generator operating costs remain volatile. On-site solar EPC transforms idle commercial roof space into predictable daytime generation.',
      tariffCardTitle: 'EEU Tariff Trajectory',
      tariffCardDesc: 'The Ethiopian Electric Utility multi-year tariff framework has systematically adjusted commercial and industrial rates to reflect cost-recovery. Daytime manufacturing rates have increased steadily across regulatory revision phases.',
      tariffCardStat: 'Cost-Recovery Reform',
      tariffCardMeta: 'Documented in EEU Gazetted Tariff Schedules (2018–2025/26)',
      dieselCardTitle: 'Diesel Generator Reliance',
      dieselCardDesc: 'Backup diesel generators incur steep per-kWh expenses including fuel, delivery logistics, filter wear, and scheduled engine overhauls. Solar-generator synchronization curtails fuel burn by 30% to 65% during daytime outages.',
      dieselCardStat: 'ETB 163.09 / Liter',
      dieselCardMeta: 'Dated historical benchmark (Addis Ababa retail diesel, April 2026)',
      reliabilityCardTitle: 'Productivity & Demand Charges',
      reliabilityCardDesc: 'Grid voltage sags and feeder load shedding force unexpected equipment pauses. Furthermore, kVA maximum demand charges penalize operations during utility peak hours. On-site solar buffers facility demand curves.',
      reliabilityCardStat: 'Load Curve Shaving',
      reliabilityCardMeta: 'Reduces kVA demand spikes and unmanaged grid exposure',
      disclaimer: 'Dated regulatory figures. Energy rate changes are decided by regulatory authorities. On-site solar reduces exposure to purchased electricity for the portion of load it generates; it does not eliminate utility charges or guarantee zero bills.',
    },
    solutions: {
      badge: 'Turnkey EPC Engineering',
      headline: 'Engineered Solar Systems Built Around Your Operating Load',
      subtext: 'We design, procure, construct, and commission three core commercial power configurations tailored to Ethiopian commercial and industrial operating facilities.',
      allFilter: 'All Solutions',
      gridTiedFilter: 'Grid-Tied Solar',
      bessFilter: 'Solar + Battery (BESS)',
      hybridFilter: 'Solar + Generator Hybrid',
      suitableFor: 'Ideal For',
      features: 'Engineering Features',
      capacityRange: 'Capacity Band',
      selectForAssessment: 'Select for Site Assessment',
      disclaimer: 'System generation and offset depend on roof orientation, structural integrity, local irradiance, operational load curves, and final electrical interconnection agreements.',
    },
    calculator: {
      badge: 'Transparent Scenario Model',
      headline: 'Interactive Energy Economics & Scenario Estimator',
      subtext: 'Input your facility’s actual electricity spend to evaluate what an on-site commercial solar installation could offset. No inflated projections—only verifiable, configurable parameters.',
      billLabel: 'Average Monthly Electricity Bill (ETB)',
      billPlaceholder: 'e.g. 250,000',
      advancedToggle: 'Advanced Inputs (Consumption & Generator Diesel)',
      kwhLabel: 'Monthly Energy Consumption (kWh, optional)',
      dieselLitersLabel: 'Monthly Diesel Fuel Used for Backup (Liters, optional)',
      dieselPriceLabel: 'Diesel Price Assumption (ETB / Liter)',
      offsetSliderLabel: 'Target Solar Load Offset Scenario',
      summaryHeadline: 'Preliminary Scenario Outlook',
      estimatedAnnualOffset: 'Estimated Annual Utility Bill Offset',
      estimatedMonthlyOffset: 'Estimated Monthly Utility Bill Offset',
      estimatedDieselOffset: 'Estimated Annual Diesel Fuel Savings',
      estimatedPayback: 'Simple Estimated Payback Period',
      unconfiguredNotice: 'Configured by authorized administrator based on published economics.',
      useInputsInFormBtn: 'Use These Inputs in My Site Assessment Request',
      inputsCopiedSuccess: 'Inputs saved to form below! Continue to complete your request.',
      methodologyNoteTitle: 'Engineering & Tariff Methodology Note',
      methodologyNote: 'Calculations utilize verified active utility rates and configured solar yields for central Ethiopian irradiance (avg. 5.2–5.6 PSH/day). Diesel savings are calculated from generator displacement with minimum 25% safety loading to prevent engine wet-stacking.',
      disclaimer: 'Estimate only. Preliminary calculations do not constitute a binding quotation or guaranteed savings. Detailed 15-minute interval logging, structural roof engineering review, and EEU utility interconnection analysis are required during your complimentary site survey.',
    },
    tariff: {
      badge: 'Documented Regulatory Baseline',
      headline: 'Ethiopian Electric Utility (EEU) Commercial Tariff Timeline',
      subtext: 'Review dated historical and current commercial/industrial tariff determinations, clearly distinguished from planned regulatory schedules.',
      commercialTab: 'Commercial & Services',
      industrialTab: 'Industrial & Manufacturing',
      legendHistorical: 'Historical Record (Actual)',
      legendCurrent: 'Current Verified Rate (Actual)',
      legendForecast: 'Planned / Regulatory Forecast',
      forecastWarning: 'Planned schedule rates are published regulatory roadmap targets and must not be treated as active rates until verified by administrative gazette.',
      sourcePrefix: 'Source:',
      verifiedOnPrefix: 'Verified:',
    },
    showcase3D: {
      badge: 'System Architecture',
      title: 'Explore a Commercial Solar System',
      subtitle: 'An illustrative 6-stage engineering walkthrough from site assessment to commissioned electrical inspection.',
      illustrativeBadge: 'Illustrative Engineering Visual — Conceptual Workflow',
      illustrativeNote: 'Illustrative equipment and installation imagery',
      dragPrompt: '← Click & Drag to Rotate the System Workflow →',
    },
    process: {
      badge: '4-STEP PROCESS TIMELINE',
      headline: 'How It Works: Turnkey Solar Engineering',
      subtext: 'A structured 4-step engineering journey designed for commercial reliability and safe utility interconnection.',
      timelineNotice: 'Execution timeline is tailored to site conditions and hardware scope; each phase is verified prior to gate progression.',
    },
    projects: {
      badge: 'Verified Track Record',
      headline: 'Documented Commercial Solar Installations',
      subtext: 'We only present verified client installations with validated meter telemetry and client consent. Illustrative engineering models are prominently labeled.',
      emptyTitle: 'Verified Case Studies Coming Online',
      emptyDesc: 'New commercial and industrial solar installations in our regional pipeline are currently undergoing 90-day post-commissioning telemetry verification prior to public publication. Contact our engineering desk to review sector-specific system blueprints.',
      emptyCta: 'Request Sector References & Technical Brief',
      illustrativeNotice: 'Illustrative example — not a client project',
      capacity: 'Installed Capacity',
      monthlyGen: 'Avg. Monthly Generation',
      monthlySavings: 'Estimated Savings',
    },
    trust: {
      badge: 'Credentials & Verification',
      headline: 'Compliance, Engineering Licenses & Institutional Trust',
      subtext: 'Our engineering operations strictly comply with Ethiopian Ministry of Water and Energy guidelines, EEU grid interconnection rules, and international IEC/IEEE standards.',
      verifiedBadge: 'Verified Regulatory Credential',
      viewProof: 'View Verification Document',
    },
    about: {
      badge: 'Local Stewardship & Expertise',
      headline: 'Commercial Energy Engineers Committed to Ethiopian Industry',
      subtext: 'Headquartered in Addis Ababa, SolEth EPC combines international renewable engineering best practices with grounded domestic logistical, regulatory, and technical execution.',
      localTeamGuarantee: 'Addis Ababa In-House Engineering Team',
      localTeamSub: 'Certified local electrical engineers, structural installers, and rapid-response operations and maintenance technicians.',
    },
    faq: {
      badge: 'Technical Answers',
      headline: 'Frequently Asked Questions by Commercial Facility Managers',
      subtext: 'Clear, engineering-grounded responses to common operational questions regarding commercial solar adoption in Ethiopia.',
    },
    form: {
      badge: 'Direct Engineering Consultation',
      headline: 'Request a Free Site Assessment & Preliminary System Design',
      subtext: 'Our engineering team will review your utility bills, analyze satellite rooftop imagery, and provide a preliminary feasibility brief detailing potential solar generation and financial scenarios.',
      fullName: 'Full Name *',
      phone: 'Phone Number (Required for Site Scheduling) *',
      company: 'Company / Organization Name *',
      location: 'Site Location (City / Sub-City / Industrial Zone) *',
      industry: 'Industry / Sector *',
      selectIndustry: 'Select your sector...',
      monthlyBill: 'Approx. Monthly Electricity Bill (ETB) *',
      monthlyKwh: 'Approx. Monthly Consumption (kWh, optional)',
      monthlyDiesel: 'Monthly Diesel Generator Fuel (Liters, optional)',
      interest: 'Primary System Interest *',
      selectInterest: 'Select system architecture...',
      solarOnly: 'Grid-Tied Solar (Daytime Bill Reduction)',
      solarBess: 'Solar + Battery Storage (BESS Uninterrupted Power)',
      solarHybrid: 'Solar + Generator Hybrid Microgrid (Diesel Reduction)',
      notSure: 'Not Sure — Need Engineering Assessment',
      message: 'Specific Facility Details or Outage Challenges (optional)',
      submitBtn: 'Submit Assessment Request',
      submitting: 'Submitting Engineering Brief...',
      successTitle: 'Site Assessment Request Received',
      successMessage: 'Thank you. Our commercial engineering team has received your facility details and will review your site parameters.',
      errorRequired: 'Please complete all required fields (Name, Phone, Company, Location, Monthly Bill).',
      responseTimeNotice: 'Typical response time: within 24–48 business hours.',
      privacyNote: 'Your utility bill and operational data remain strictly confidential. Used solely to prepare your technical assessment.',
    },
    contact: {
      badge: 'Direct Engagement',
      headline: 'Connect With Our Commercial Engineering Desk',
      subtext: 'Speak directly with a senior solar EPC engineer or schedule an on-site visit to inspect your facility’s electrical switchgear and roof capacity.',
      officeAddress: 'Bole Sub-City, Woreda 04, Century Commercial Center 5th Floor, Addis Ababa, Ethiopia',
      officeLabel: 'Engineering Office',
      phoneLabel: 'Direct Phone',
      emailLabel: 'Commercial Inquiries',
      whatsappLabel: 'WhatsApp Chat',
      telegramLabel: 'Telegram Channel',
    },
    footer: {
      description: 'SolEth EPC engineers turnkey commercial rooftop solar, industrial battery storage (BESS), and generator hybrid microgrids across Ethiopian manufacturing, commercial, and agro-processing facilities.',
      solutionsNav: 'Commercial Solar Solutions',
      engineeringNav: 'Engineering Standards',
      legalNotice: 'All preliminary savings and payback figures generated on this website are illustrative scenario models based on user inputs and configurable assumptions. Final system design, equipment quotation, and performance modeling are established following physical site surveys, 15-minute load analysis, and grid interconnection review.',
      regulatoryNotice: 'Compliant with Ethiopian Electric Utility (EEU) regulations and Ministry of Water & Energy licensing requirements.',
      adminLink: 'Engineering Portal',
      rights: 'SolEth Commercial Solar EPC. All rights reserved.',
    },
  },
  am: {
    nav: {
      home: 'መነሻ',
      solutions: 'የሶላር መፍትሄዎች',
      howItWorks: 'የአሠራር ሂደት',
      economics: 'የወጪ ትንተና',
      projects: 'ፕሮጀክቶች',
      about: 'ስለ እኛ',
      faq: 'ተደጋጋሚ ጥያቄዎች',
      contact: 'ያግኙን',
      ctaButton: 'የሳይት ግምገማ ይጠይቁ',
      callNow: 'ስልክ ይደውሉ',
      whatsapp: 'ዋትስአፕ',
      telegram: 'ቴሌግራም',
    },
    hero: {
      ch1Eyebrow: '01 / የሳይት ዳሰሳ',
      ch1Headline: 'ጣሪያዎ አስተማማኝ የኃይል ሀብት ነው',
      ch1MicroLabel: 'የጣሪያ ስፋት · ጥላ · የፍጆታ ሁኔታ',
      ch1Subtext: 'ተጨባጭ የሶላር ፕሮፖዛል የሚጀምረው ከጣሪያዎ እና ተቋምዎ ኃይል ከሚጠቀምበት መንገድ ነው።',
      ch1Cta: 'የኢኮኖሚ ጥቅሞችን ይመልከቱ',
      ch2Eyebrow: '02 / ኢንጂነሪንግ',
      ch2Headline: 'በተቋምዎ የፍጆታ ፍላጎት ልክ የተነደፈ',
      ch2MicroLabel: 'የሶላር ምርት · የባትሪ ክምችት · የጄኔሬተር ውህደት',
      ch2Subtext: 'የቴክኖሎጂ ምርጫ የስራ ሰዓትን፣ ከፍተኛ የፍላጎት ጫናን እና የፍርግርግ ሁኔታን ማገናዘብ አለበት።',
      ch2Cta: 'የሲስተም አማራጮችን ያወዳድሩ',
      ch3Eyebrow: '03 / ማስረከብ',
      ch3Headline: 'ከተጨባጭ ግምት እስከ የስራ እቅድ',
      ch3MicroLabel: 'የኤሌክትሪክ ፍተሻ · የክትትል ቅንብር · ርክክብ',
      ch3Subtext: 'ጣቢያውን ማረጋገጥ፣ ፕሮፖዛሉን መገምገም እና ስርዓቱ እንዴት እንደሚፈተሽና እንደሚዘረጋ መወሰን።',
      ch3Cta: 'የሳይት ግምገማ ይጠይቁ',
      skip: 'ቪዲዮ ይለፉ',
      chapter: 'ክፍል',
      scrollPrompt: 'የስርዓቱን ሂደቶች ለመመልከት ወደ ታች ይሸብልሉ',
      muteTooltip: 'ድምፅ ለማብራት ይጫኑ',
      unmuteTooltip: 'ድምፅ ለማጥፋት ይጫኑ',
    },
    energyProblem: {
      badge: 'የተቋማት የኃይል እውነታ',
      headline: 'የኢትዮጵያ ንግድና ኢንዱስትሪ የኃይል ወጪ አዝማሚያ',
      subtext: 'የኢትዮጵያ ኤሌክትሪክ አገልግሎት የታሪፍ ማሻሻያ እያደረገ ሲሆን፣ የናፍጣ ጄኔሬተር ማስኬጃ ወጪም ተለዋዋጭ ነው። የጣሪያ ላይ የንግድ ሶላር ስራ ፈት የጣሪያ ስፋትን ወደ አስተማማኝ የቀን የኃይል ምንጭ ይቀይራል።',
      tariffCardTitle: 'የታሪፍ ማሻሻያ አቅጣጫ',
      tariffCardDesc: 'የኢትዮጵያ ኤሌክትሪክ አገልግሎት የወጪ ማካካሻ መርሃ ግብር ንግድና ኢንዱስትሪ ተቋማት የሚከፍሉትን የኪሎዋት ሰዓት እና የከፍተኛ ፍላጎት (kVA) ተመን በደረጃ እያስተካከለ ይገኛል።',
      tariffCardStat: 'የታሪፍ ማሻሻያ መርሃ-ግብር',
      tariffCardMeta: 'በይፋዊ የኢ.ኤ.አ. የታሪፍ ሰነዶች ላይ የተመሰረተ (2018–2025/26)',
      dieselCardTitle: 'የናፍጣ ጄኔሬተር ጥገኝነት',
      dieselCardDesc: 'የመጠባበቂያ ናፍጣ ጄኔሬተሮችን ማስኬድ ከፍተኛ የነዳጅ፣ የጥገና እና የዘይት ወጪ ያስከትላል። ሶላርን ከጄኔሬተር ጋር ማስተሳሰር በመብራት መቆራረጥ ወቅት የነዳጅ ፍጆታን ከ30% እስከ 65% ይቀንሳል።',
      dieselCardStat: '163.09 ብር / ሊትር',
      dieselCardMeta: 'የተመዘገበ ታሪካዊ ዋጋ (አዲስ አበባ የችርቻሮ ናፍጣ፣ ሚያዝያ 2026)',
      reliabilityCardTitle: 'የምርት ቀጣይነትና የፍላጎት ክፍያ',
      reliabilityCardDesc: 'የቮልቴጅ መውረድና መቆራረጥ የማሽነሪዎችን ስራ ያስተጓጉላል፤ በተጨማሪም ከፍተኛ የፍላጎት ክፍያ (kVA Peak Demand) ወርሃዊ ወጪን ይጨምራል። ሶላር ከፍተኛ የኃይል ጫናን ያቃልላል።',
      reliabilityCardStat: 'የከፍተኛ ጫና ቅነሳ',
      reliabilityCardMeta: 'የማሽነሪዎችን ድንገተኛ ጫና በፀሐይ ኃይል ማቃለል',
      disclaimer: 'የተመዘገቡ ህጋዊ መረጃዎች። የታሪፍ ማሻሻያ በመንግስት የቁጥጥር አካላት የሚወሰን ነው። የጣሪያ ሶላር የሚያመነጨውን የኃይል ድርሻ ወጪ ብቻ ይቀንሳል እንጂ ወርሃዊ ሂሳብን ሙሉ በሙሉ ዜሮ አያደርግም።',
    },
    solutions: {
      badge: 'የኢንጂነሪንግ አገልግሎቶች',
      headline: 'ለእርስዎ የስራ ባህሪ የተቀረፁ የንግድ ሶላር ስርዓቶች',
      subtext: 'ለኢትዮጵያ ፋብሪካዎች፣ ሆቴሎች፣ ቀዝቃዛ መጋዘኖች፣ የግብርና ማቀነባበሪያዎችና የንግድ ህንፃዎች የተበጁ ሶስት ዋና የሶላር ቴክኖሎጂዎች እናቀርባለን።',
      allFilter: 'ሁሉም አማራጮች',
      gridTiedFilter: 'ከፍርግርግ ጋር የተገናኘ (Grid-Tied)',
      bessFilter: 'ሶላር ከባትሪ ክምችት ጋር (BESS)',
      hybridFilter: 'ሶላር ከጄኔሬተር ጋር የተቀናጀ (Hybrid)',
      suitableFor: 'ለየትኞቹ ተቋማት ይመረጣል',
      features: 'የቴክኒክ ባህሪያት',
      capacityRange: 'የኃይል መጠን (kWp)',
      selectForAssessment: 'ለሳይት ግምገማ ይምረጡ',
      disclaimer: 'ትክክለኛው የኃይል ምርት በጣሪያው አቅጣጫ፣ ጥንካሬ፣ የፀሐይ ብርሃን መጠን፣ የተቋሙ ፍጆታ እና ከኢ.ኤ.አ. ጋር በሚደረግ ስምምነት ይወሰናል።',
    },
    calculator: {
      badge: 'የወጪና ቁጠባ ስሌት',
      headline: 'ተጨባጭ የወጪና የቁጠባ ሁኔታ መገምገሚያ',
      subtext: 'የተቋምዎን ወርሃዊ የኤሌክትሪክ ክፍያ በማስገባት በጣሪያ ላይ የሚተከል ሶላር ምን ያህል ወጪ ሊያቃልል እንደሚችል ይመልከቱ። ምንም የተጋነነ ግምት የለም።',
      billLabel: 'አማካይ ወርሃዊ የኤሌክትሪክ ክፍያ (በኢትዮጵያ ብር)',
      billPlaceholder: 'ለምሳሌ፡ 250,000',
      advancedToggle: 'ተጨማሪ መረጃዎች (የፍጆታ መጠን እና የጄኔሬተር ናፍጣ)',
      kwhLabel: 'ወርሃዊ የኃይል ፍጆታ (በኪሎዋት ሰዓት - አማራጭ)',
      dieselLitersLabel: 'በወር ለመጠባበቂያ ጄኔሬተር የሚወጣ ናፍጣ (በሊትር - አማራጭ)',
      dieselPriceLabel: 'የናፍጣ ዋጋ ግምት (ብር በሊትር)',
      offsetSliderLabel: 'በሶላር የሚሸፈን የፍጆታ ድርሻ (%)',
      summaryHeadline: 'የቅድመ-ግምገማ ውጤት',
      estimatedAnnualOffset: 'ዓመታዊ የሚቀነስ የኤሌክትሪክ ክፍያ',
      estimatedMonthlyOffset: 'ወርሃዊ የሚቀነስ የኤሌክትሪክ ክፍያ',
      estimatedDieselOffset: 'ዓመታዊ የሚድን የናፍጣ ነዳጅ ወጪ',
      estimatedPayback: 'የወጪ መመለሻ ጊዜ ግምት',
      unconfiguredNotice: 'በአስተዳዳሪው በይፋዊ መረጃ ላይ ተመስርቶ የተዋቀረ።',
      useInputsInFormBtn: 'ይህን መረጃ ለሳይት ግምገማ ማመልከቻዬ ተጠቀም',
      inputsCopiedSuccess: 'መረጃው ከታች ወዳለው ፎርም ተላልፏል! እባክዎ ማመልከቻዎን ያጠናቁ።',
      methodologyNoteTitle: 'የስሌት ዘዴና ማብራሪያ',
      methodologyNote: 'ስሌቱ በኢትዮጵያ ማዕከላዊ የፀሐይ ብርሃን አማካይ (በቀን ከ5.2–5.6 ሰዓት) እና በፀደቀው የኤሌክትሪክ ታሪፍ ላይ የተመሰረተ ነው። የጄኔሬተር ነዳጅ ቅነሳ የሞተርን ጤንነት ለመጠበቅ ቢያንስ 25% ጭነትን ባገናዘበ መልኩ ይሰላል።',
      disclaimer: 'ግምት ብቻ ነው። ይህ ስሌት ትክክለኛ የውል ዋጋ አቅርቦት አይደለም። የተሟላ የ15 ደቂቃ የፍጆታ ምዝገባ፣ የጣሪያ ጥናት እና የፍርግርግ ትስስር ፍተሻ በባለሙያዎች ይከናወናል።',
    },
    tariff: {
      badge: 'የተመዘገበ የታሪፍ መረጃ',
      headline: 'የኢትዮጵያ ኤሌክትሪክ አገልግሎት (EEU) የንግድ ታሪፍ ሂደት',
      subtext: 'ያለፉትን እና አሁን የሚሰሩባቸውን ትክክለኛ ታሪፎች ለወደፊት ከታቀደው የቁጥጥር ሰንጠረዥ ተለይተው የቀረቡበትን ይመልከቱ።',
      commercialTab: 'ለንግድና አገልግሎት ተቋማት',
      industrialTab: 'ለኢንዱስትሪና ማምረቻ ተቋማት',
      legendHistorical: 'ያለፈ የተመዘገበ ታሪፍ',
      legendCurrent: 'አሁን የሚሰራበት የተረጋገጠ ታሪፍ',
      legendForecast: 'የወደፊት የታቀደ የታሪፍ ሰንጠረዥ',
      forecastWarning: 'የወደፊት የታቀዱ ታሪፎች የቁጥጥር እቅዶች ናቸው፤ በይፋዊ አዋጅ እስካልጸደቁ ድረስ እንደ ነባር ታሪፍ አይቆጠሩም።',
      sourcePrefix: 'ምንጭ፡',
      verifiedOnPrefix: 'የተረጋገጠበት ቀን፡',
    },
    showcase3D: {
      badge: 'የቴክኒክ ግንባታ ሂደት',
      title: 'የንግድ ሶላር ስርዓት ምህንድስና ቅኝት',
      subtitle: 'ከጣሪያ ቅኝት ጀምሮ እስከ ኢንቨርተር፣ ባትሪ እና ክትትል ስርዓት ድረስ ያለውን የምህንድስና ሂደት በ3D ይመልከቱ።',
      illustrativeBadge: 'የምህንድስና ማሳያ ምስል — ፅንሰ-ሃሳባዊ ሂደት',
      illustrativeNote: 'ለማሳያነት የቀረበ የምህንድስና ሂደት ምስል',
      dragPrompt: '← የምህንድስና ሂደቱን ለማዞር ጠቅ አድርገው ይጎትቱ →',
    },
    process: {
      badge: 'ባለ 4-ደረጃ የትግበራ ሂደት',
      headline: 'አሠራራችን፡ ባለ 4-ደረጃ የሶላር ኢንጂነሪንግ',
      subtext: 'ለተቋማት አስተማማኝነት እና ለፍርግርግ ደህንነት የተዘረጋ ባለ 4-ደረጃ የምህንድስና ሂደት።',
      timelineNotice: 'የማጠናቀቂያ ጊዜ እንደ ሳይቱ ሁኔታ እና እንደ እቃዎች መጠን ይወሰናል።',
    },
    projects: {
      badge: 'የተረጋገጡ ስራዎች',
      headline: 'የተጠናቀቁና የተረጋገጡ የንግድ ሶላር ፕሮጀክቶች',
      subtext: 'በተቋማቱ የተረጋገጡ እና በቴሌሜትሪ የተፈተሹ ፕሮጀክቶችን ብቻ እናቀርባለን። የማሳያ ምሳሌዎች በግልጽ ተለይተዋል።',
      emptyTitle: 'የተረጋገጡ የፕሮጀክት መረጃዎች በቅርቡ ይቀርባሉ',
      emptyDesc: 'በአሁኑ ወቅት አዳዲስ የኢንዱስትሪና ንግድ ሶላር ፕሮጀክቶቻችን የ90 ቀናት የሙከራና የቴሌሜትሪ ማረጋገጫ ሂደት ላይ ይገኛሉ። ለተቋምዎ የሚስማማ የምህንድስና ናሙና ለመመልከት ያነጋግሩን።',
      emptyCta: 'የዘርፉን ቴክኒካል ሰነድ ይጠይቁ',
      illustrativeNotice: 'የማሳያ ምሳሌ — የደንበኛ ፕሮጀክት አይደለም',
      capacity: 'የተተከለ የኃይል መጠን',
      monthlyGen: 'ወርሃዊ ኃይል ምርት',
      monthlySavings: 'የወጪ ቅነሳ ግምት',
    },
    trust: {
      badge: 'ህጋዊ ፍቃዶችና ማረጋገጫዎች',
      headline: 'የሙያ ፍቃዶች፣ የጥራት ማረጋገጫዎችና አስተማማኝነት',
      subtext: 'የኢንጂነሪንግ ስራዎቻችን በኢትዮጵያ ውሃና ኢነርጂ ሚኒስቴር፣ በኢ.ኤ.አ. ፍርግርግ መመሪያ እና በአለም አቀፍ IEC/IEEE ደረጃዎች የተመሰረቱ ናቸው።',
      verifiedBadge: 'የተረጋገጠ ህጋዊ ሰነድ',
      viewProof: 'ማረጋገጫ ሰነድ ይመልከቱ',
    },
    about: {
      badge: 'የአገር ውስጥ ልምድና ቁርጠኝነት',
      headline: 'ለኢትዮጵያ ኢንዱስትሪ እድገት የሚተጉ የኃይል መሀንዲሶች',
      subtext: 'ዋና መስሪያ ቤቱን አዲስ አበባ ያደረገው ሶልኤዝ (SolEth EPC) አለም አቀፍ የፀሐይ ኃይል ቴክኖሎጂን ከአካባቢያዊ የምህንድስና እና የሎጂስቲክስ እውቀት ጋር አቀናጅቶ ይሰራል።',
      localTeamGuarantee: 'የአዲስ አበባ ቋሚ የኢንጂነሪንግ ቡድን',
      localTeamSub: 'ብቁ የኤሌክትሪክ መሀንዲሶች፣ የጣሪያ ተከላ ባለሙያዎች እና ፈጣን ምላሽ ሰጪ የጥገና ሰራተኞች።',
    },
    faq: {
      badge: 'ቴክኒካዊ ምላሾች',
      headline: 'ከተቋማት ስራ አስኪያጆች በተደጋጋሚ የሚነሱ ጥያቄዎች',
      subtext: 'በኢትዮጵያ የንግድና ኢንዱስትሪ ተቋማት ላይ ሶላር ለመትከል ለሚፈልጉ የተሰጡ ግልጽና ሳይንሳዊ ምላሾች።',
    },
    form: {
      badge: 'የባለሙያ ምክክር',
      headline: 'ነፃ የሳይት ግምገማ እና የቅድመ-ዲዛይን ጥናት ይጠይቁ',
      subtext: 'የኢንጂነሪንግ ቡድናችን የኤሌክትሪክ ሂሳብዎን በመመርመር እና የሳተላይት የጣሪያ ምስልን በማየት የመጀመሪያ ደረጃ ቴክኒካል እና የቁጠባ ሪፖርት ያቀርብልዎታል።',
      fullName: 'ሙሉ ስም *',
      phone: 'ስልክ ቁጥር (ለቀጠሮ የግድ ያስፈልጋል) *',
      company: 'የድርጅቱ / ተቋሙ ስም *',
      location: 'የሳይቱ አድራሻ (ከተማ / ክ/ከተማ / የኢንዱስትሪ ፓርክ) *',
      industry: 'የስራ መስክ / ዘርፍ *',
      selectIndustry: 'የስራ ዘርፉን ይምረጡ...',
      monthlyBill: 'አማካይ ወርሃዊ የኤሌክትሪክ ክፍያ (ብር) *',
      monthlyKwh: 'ወርሃዊ የኃይል ፍጆታ (በኪሎዋት ሰዓት - አማራጭ)',
      monthlyDiesel: 'ለመጠባበቂያ ጄኔሬተር የሚወጣ ናፍጣ (በሊትር - አማራጭ)',
      interest: 'የሚፈልጉት የቴክኖሎጂ አይነት *',
      selectInterest: 'የስርዓት አይነት ይምረጡ...',
      solarOnly: 'ከፍርግርግ ጋር የተገናኘ ሶላር (የቀን ሂሳብ ለመቀነስ)',
      solarBess: 'ሶላር ከባትሪ ክምችት ጋር (ያለ መቆራረጥ ለሚሰሩ)',
      solarHybrid: 'ሶላር ከጄኔሬተር ጋር የተቀናጀ (የነዳጅ ወጪን ለመቀነስ)',
      notSure: 'እርግጠኛ አይደለሁም — የባለሙያ ምክር እፈልጋለሁ',
      message: 'ተጨማሪ ዝርዝር ወይም የኃይል መቆራረጥ ተግዳሮቶች (ካለ)',
      submitBtn: 'የግምገማ ጥያቄውን ላክ',
      submitting: 'በመላክ ላይ...',
      successTitle: 'የሳይት ግምገማ ጥያቄዎ ደርሶናል',
      successMessage: 'እናመሰግናለን። የኢንጂነሪንግ ቡድናችን የተቋምዎን መረጃ ተመልክቶ በተቻለ ፍጥነት ያነጋግርዎታል።',
      errorRequired: 'እባክዎ አስፈላጊ የሆኑትን መረጃዎች (ስም፣ ስልክ፣ ድርጅት፣ አድራሻ፣ ወርሃዊ ክፍያ) ይሙሉ!',
      responseTimeNotice: 'የምላሽ ጊዜ፡ በ24–48 የስራ ሰዓታት ውስጥ።',
      privacyNote: 'የእርስዎ የኤሌክትሪክ ሂሳብና የስራ መረጃዎች በሚስጥር ይጠበቃሉ። ጥቅም ላይ የሚውሉት ለቴክኒክ ግምገማ ብቻ ነው።',
    },
    contact: {
      badge: 'ቀጥታ ግንኙነት',
      headline: 'ከንግድ ሶላር ኢንጂነሪንግ ክፍላችን ጋር ይገናኙ',
      subtext: 'ከዋና መሀንዲስ ጋር በቀጥታ ይወያዩ ወይም የተቋምዎን የኤሌክትሪክ ቋት እና ጣሪያ ለመገምገም የሳይት ጉብኝት ቀጠሮ ይያዙ።',
      officeAddress: 'ቦሌ ክ/ከተማ፣ ወረዳ 04፣ ሴንቸሪ የንግድ ማዕከል 5ኛ ፎቅ፣ አዲስ አበባ፣ ኢትዮጵያ',
      officeLabel: 'የምህንድስና ቢሮ',
      phoneLabel: 'ቀጥታ ስልክ',
      emailLabel: 'ኢሜይል',
      whatsappLabel: 'የዋትስአፕ መልዕክት',
      telegramLabel: 'የቴሌግራም ቻናል',
    },
    footer: {
      description: 'ሶልኤዝ (SolEth EPC) ለኢትዮጵያ ማምረቻዎች፣ የንግድ ህንፃዎች፣ ሆቴሎች እና የግብርና ተቋማት አስተማማኝ የጣሪያ ሶላር፣ የኢንዱስትሪ ባትሪ እና የጄኔሬተር ጥምር ኃይል ያቀርባል።',
      solutionsNav: 'የሶላር መፍትሄዎች',
      engineeringNav: 'የምህንድስና ደረጃዎች',
      legalNotice: 'በዚህ ድረ-ገጽ ላይ የቀረቡት የቁጠባ እና የወጪ መመለሻ ስሌቶች በተጠቃሚው ግብአት እና በተዘጋጁ መላምቶች ላይ የተመሰረቱ የማሳያ ሞዴሎች ናቸው። ትክክለኛው የቴክኒክ ዲዛይን፣ የመሳሪያዎች ዋጋ እና የኃይል ምርት የሚወሰነው በቦታው ላይ በሚደረግ የሳይት ቅኝት እና ከኢ.ኤ.አ. ጋር በሚደረግ የፍርግርግ ትስስር ፍተሻ ነው።',
      regulatoryNotice: 'ከኢትዮጵያ ኤሌክትሪክ አገልግሎት (EEU) እና ከውሃና ኢነርጂ ሚኒስቴር መመሪያዎች ጋር የተጣጣመ።',
      adminLink: 'የኢንጂነሪንግ ፖርታል',
      rights: 'ሶልኤዝ (SolEth) የንግድ ሶላር ኢ.ፒ.ሲ. መብቱ በህግ የተጠበቀ ነው።',
    },
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('soleth_lang') as Language;
      if (saved && (saved === 'en' || saved === 'am') && saved !== 'en') {
        const timer = setTimeout(() => {
          setLanguageState(saved);
        }, 0);
        return () => clearTimeout(timer);
      }
    } catch {
      // localStorage may be unavailable
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('soleth_lang', lang);
      } catch {
        // Ignore
      }
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
