/**
 * Central site configuration for SolEth Commercial Solar EPC.
 * Contains brand definitions, video scroll chapters, showcase items, process steps,
 * navigation, and SEO metadata.
 */

export interface VideoHeroItem {
  id: string;
  videoUrl: string;
  eyebrow?: string;
  headline: string;
  microLabel?: string;
  subtext: string;
  buttonLabel?: string;
  buttonHref?: string;
  scrollLength?: string;
  autoplayRate?: number;
  boostedRate?: number;
}

export interface Showcase3DItem {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  spec: string;
  attribution?: string;
}

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
  imageUrl?: string;
  imageAlt?: string;
}

export interface SiteConfig {
  businessName: string;
  tagline: string;
  shortDescription: string;
  schemaType: string;
  logoPath: string;
  logoAlt: string;
  brandColors: {
    primary: string;         // Deep forest #12372A
    surface: string;         // Very deep forest for video overlays #0B241B
    neutralCanvas: string;   // Warm light canvas #F5F7F2
    white: string;           // Pure white #FFFFFF
    ink: string;             // Main ink #17241D
    muted: string;           // Muted green-gray #647368
    solarAmber: string;      // Warm energy accent #EDB54A
    cleanEnergyTeal: string; // Main energy green #2F7D57
    border: string;          // Fine border rgba(18, 55, 42, 0.14)
  };
  videos: VideoHeroItem[];
  defaultContact: {
    phone: string;
    email: string;
    whatsapp: string;
    telegram: string;
    address: string;
  };
  navigation: Array<{
    name: string;
    href: string;
  }>;
  showcase3D: {
    title: string;
    subtitle: string;
    items: Showcase3DItem[];
  };
  processSteps: ProcessStep[];
  technicalStandards: {
    gridCompliance: string;
    hardwareStandards: string[];
    protectionGear: string[];
    documentation: string[];
    responseNotice: string;
  };
  aboutStory: {
    headline: string;
    storyParagraphs: string[];
    pillars: Array<{
      title: string;
      description: string;
    }>;
  };
  faqs: Array<{
    question: string;
    shortAnswer: string;
  }>;
  seo: {
    siteUrl: string;
    keywords: string[];
    geo: {
      region: string;
      placename: string;
      position: string;
    };
  };
}

export const siteConfig: SiteConfig = {
  businessName: 'SolEth Commercial Solar EPC',
  tagline: 'Turnkey Commercial Rooftop Solar, Battery Storage & Generator Hybrids for Ethiopian Industry',
  shortDescription:
    'SolEth EPC engineers, installs, and maintains on-site commercial and industrial solar power systems, battery energy storage (BESS), and diesel generator hybrid microgrids across Ethiopian manufacturing, hospitality, agro-processing, and commercial facilities.',
  schemaType: 'GeneralContractor',
  logoPath: '/logo.svg',
  logoAlt: 'SolEth Commercial Solar EPC - Ethiopian Industrial Solar Engineering',
  brandColors: {
    primary: '#12372A',         // Deep forest #12372A
    surface: '#0B241B',         // Very deep forest for video overlays #0B241B
    neutralCanvas: '#F5F7F2',   // Warm light canvas #F5F7F2
    white: '#FFFFFF',           // Pure white #FFFFFF
    ink: '#17241D',             // Main ink #17241D
    muted: '#647368',           // Muted green-gray #647368
    solarAmber: '#EDB54A',      // Warm energy accent #EDB54A
    cleanEnergyTeal: '#2F7D57', // Main energy green #2F7D57
    border: 'rgba(18, 55, 42, 0.14)', // Fine border
  },
  videos: [
    {
      id: 'section-1',
      videoUrl: 'https://ik.imagekit.io/271230/solar%20video%20111.mp4',
      eyebrow: '01 / SITE ASSESSMENT',
      headline: 'Your Roof Is an Energy Asset.',
      microLabel: 'Roof area · Shading · Load profile',
      subtext: 'A credible proposal starts with the site and the way your business uses power.',
      buttonLabel: 'Explore the Economics',
      buttonHref: '#calculator',
      autoplayRate: 1.5,
      boostedRate: 2.0,
    },
    {
      id: 'section-2',
      videoUrl: 'https://ik.imagekit.io/271230/solar%20video%20v2.mp4',
      eyebrow: '02 / ENGINEERING',
      headline: 'Designed Around Your Load.',
      microLabel: 'PV generation · Optional storage · Generator integration',
      subtext: 'System choices should reflect operating hours, peak demand, grid conditions and site constraints.',
      buttonLabel: 'Compare System Architectures',
      buttonHref: '#solutions',
      autoplayRate: 1.5,
      boostedRate: 2.0,
    },
    {
      id: 'section-3',
      videoUrl: 'https://ik.imagekit.io/271230/solar%20video%20333.mp4',
      eyebrow: '03 / COMMISSIONING',
      headline: 'From Estimate to Operating Plan.',
      microLabel: 'Electrical checks · Monitoring setup · Handover',
      subtext: 'Confirm the site, review the proposal, and define how the system will be tested and monitored.',
      buttonLabel: 'Request a Site Assessment',
      buttonHref: '#assessment',
      autoplayRate: 1.5,
      boostedRate: 2.0,
    },
  ],
  defaultContact: {
    phone: '+251 11 667 9820',
    email: 'commercial@soleth-solar.com',
    whatsapp: '+251 91 144 8820',
    telegram: 'https://t.me/SolEthCommercialSolar',
    address: 'Bole Sub-City, Woreda 04, Century Commercial Center 5th Floor, Addis Ababa, Ethiopia',
  },
  navigation: [
    { name: 'Home', href: '#' },
    { name: 'Solutions', href: '#solutions' },
    { name: 'How It Works', href: '#process' },
    { name: 'Economics', href: '#calculator' },
    { name: 'Projects', href: '#projects' },
    { name: 'About', href: '#about' },
    { name: 'FAQ', href: '#faq' },
    { name: 'Contact', href: '#contact' },
  ],
  showcase3D: {
    title: 'From Sunlight to Site Power',
    subtitle: 'An illustrative 6-stage engineering walkthrough from site assessment to commissioned electrical inspection.',
    items: [
      {
        id: 'stage-1',
        title: 'Stage 1: Site / Rooftop Context',
        subtitle: 'Assessment of facility footprint, azimuth/tilt orientation, and structural dead-load capacity.',
        spec: 'High-Resolution Survey · Structural Assessment',
        imageUrl: 'https://images.pexels.com/photos/17641123/pexels-photo-17641123.jpeg?cs=srgb&dl=pexels-jonathanyue-17641123.jpg&fm=jpg',
        attribution: 'Pexels / Jonathan Yue (Free to use)',
      },
      {
        id: 'stage-2',
        title: 'Stage 2: Engineering Review',
        subtitle: 'String layout validation, shading modeling, and electrical single-line diagram coordination.',
        spec: 'Load Profile Sizing · Engineering Feasibility',
        imageUrl: 'https://images.pexels.com/photos/4254157/pexels-photo-4254157.jpeg?cs=srgb&dl=pexels-gustavo-fring-4254157.jpg&fm=jpg',
        attribution: 'Pexels / Gustavo Fring (Free to use)',
      },
      {
        id: 'stage-3',
        title: 'Stage 3: PV Module Installation',
        subtitle: 'Precision mounting, torque-calibrated standing-seam clamping, and Tier-1 monocrystalline modules.',
        spec: 'Penetration-Free Clamping · Al6005-T5 Racking',
        imageUrl: 'https://images.pexels.com/photos/4254164/pexels-photo-4254164.jpeg?cs=srgb&dl=pexels-gustavo-fring-4254164.jpg&fm=jpg',
        attribution: 'Pexels / Gustavo Fring (Free to use)',
      },
      {
        id: 'stage-4',
        title: 'Stage 4: Installed PV Array / Rooftop Coverage',
        subtitle: 'Completed commercial rooftop layout with certified maintenance corridors and cabling conduits.',
        spec: 'Maximized Solar Area · Wind-Engineered Layout',
        imageUrl: 'https://images.pexels.com/photos/35691079/pexels-photo-35691079.jpeg?cs=srgb&dl=pexels-giantasparagus-35691079.jpg&fm=jpg',
        attribution: 'Pexels / Giant Asparagus (Free to use)',
      },
      {
        id: 'stage-5',
        title: 'Stage 5: Commercial Battery Storage (BESS)',
        subtitle: 'Containerized energy storage cabinets providing backup power and kVA peak demand shaving.',
        spec: 'LiFePO4 Chemistry · Microgrid Energy Control',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/fd/1_MW_4_MWh_Turner_Energy_Storage_Project_in_Pullman%2C_WA.jpg',
        attribution: 'Turner Energy Storage Project, Pullman, WA. Wikimedia Commons (CC BY-SA 4.0)',
      },
      {
        id: 'stage-6',
        title: 'Stage 6: Electrical Inspection / Commissioning',
        subtitle: 'Switchgear protection verification, anti-islanding relays, and telemetry interconnection.',
        spec: 'Safety Verification · Cloud SCADA Telemetry',
        imageUrl: 'https://images.pexels.com/photos/17842832/pexels-photo-17842832.jpeg?cs=srgb&dl=pexels-fatihyurtman-17842832.jpg&fm=jpg',
        attribution: 'Pexels / Fatih Yurtman (Free to use)',
      },
    ],
  },
  processSteps: [
    {
      number: '01',
      title: 'Site & Load Assessment',
      description: 'Understand operating hours, electricity bills, roof/site conditions, shading, load profile and current power sources.',
      imageUrl: 'https://images.pexels.com/photos/4254157/pexels-photo-4254157.jpeg?cs=srgb&dl=pexels-gustavo-fring-4254157.jpg&fm=jpg',
      imageAlt: 'Engineers reviewing a solar site and PV installation.',
    },
    {
      number: '02',
      title: 'System Engineering & Proposal',
      description: 'System sizing, PV/inverter selection, optional storage or generator integration, and a site-specific quotation.',
      imageUrl: 'https://images.pexels.com/photos/4254169/pexels-photo-4254169.jpeg?cs=srgb&dl=pexels-gustavo-fring-4254169.jpg&fm=jpg',
      imageAlt: 'Engineer inspecting a photovoltaic panel as part of system planning.',
    },
    {
      number: '03',
      title: 'Installation & Integration',
      description: 'Mounting, wiring, protection, and integration with the existing facility power system by suitably qualified people.',
      imageUrl: 'https://images.pexels.com/photos/4254164/pexels-photo-4254164.jpeg?cs=srgb&dl=pexels-gustavo-fring-4254164.jpg&fm=jpg',
      imageAlt: 'Technician fastening solar-panel mounting hardware during installation.',
    },
    {
      number: '04',
      title: 'Testing, Monitoring & Handover',
      description: 'Commissioning checks, configured monitoring, documentation, and handover for predictable operations.',
      imageUrl: 'https://images.pexels.com/photos/17842832/pexels-photo-17842832.jpeg?cs=srgb&dl=pexels-fatihyurtman-17842832.jpg&fm=jpg',
      imageAlt: 'Electrician checking an electrical cabinet as part of system verification.',
    },
  ],
  technicalStandards: {
    gridCompliance: 'Fully compliant with Ethiopian Electric Utility (EEU) Grid Interconnection Code and Ministry of Water and Energy directives.',
    hardwareStandards: [
      'Tier-1 BloombergNEF listed monocrystalline PV modules with anti-PID and high-ambient temperature tolerance',
      'Inverters compliant with IEC 62109-1/2 (Safety) and IEC 61727 / IEEE 1547 (Grid Interconnection)',
      'Lithium Iron Phosphate (LiFePO4) energy storage cells tested to UN 38.3 and IEC 62619 safety standards',
      'Al6005-T5 structural aluminum mounting rails engineered for wind load resistance up to 140 km/h',
    ],
    protectionGear: [
      'Type 1+2 DC and AC Surge Protection Devices (SPD) protecting against lightning strikes and grid transients',
      'Integrated DC isolation switches and rapid shutdown mechanisms for firefighting safety',
      'Reverse-power relays preventing reverse power flow into active diesel generators during low-load periods',
      'Automated anti-islanding protection disconnecting inverters within 200 milliseconds of grid failure for grid-tied arrays',
    ],
    documentation: [
      'Certified As-Built Electrical Single Line Diagrams (SLD)',
      'Structural Roof Load Engineering Certificate with PE stamp',
      'Factory Acceptance Test (FAT) & Site Acceptance Test (SAT) reports',
      'Comprehensive Operations & Preventative Maintenance Manuals',
    ],
    responseNotice: 'Guaranteed 24-hour on-site technical response for critical system faults in Addis Ababa and Oromia special zone facilities.',
  },
  aboutStory: {
    headline: 'Engineering Ethiopian Industrial Self-Reliance',
    storyParagraphs: [
      'SolEth Commercial Solar EPC was founded by experienced electrical power engineers and renewable project managers in Addis Ababa. As Ethiopian grid tariffs transition through scheduled multi-year cost-recovery reforms and industrial facilities battle diesel fuel volatility, we provide bankable, engineered energy solutions.',
      'We do not sell boxed equipment or off-the-shelf residential kits. We engineer turnkey commercial rooftop and ground-mount power infrastructure that directly aligns with factory shift patterns, cold chain refrigeration compressors, and hospitality peak loads.',
      'From our headquarters in Addis Ababa, our multidisciplinary engineering team delivers complete EPC services: structural load modeling, EEU utility interconnection approvals, equipment importation, precision installation, and 25-year preventative lifecycle management.',
    ],
    pillars: [
      {
        title: 'Rigorous Electrical Engineering',
        description: 'Every project is engineered around logged 15-minute load intervals, power factor analysis, and harmonic distortion audits rather than rough guesses.',
      },
      {
        title: 'Strict Regulatory Compliance',
        description: 'Direct coordination with the Ethiopian Electric Utility (EEU) to ensure all grid protection, metering, and safety interlocks conform to national standards.',
      },
      {
        title: 'Tier-1 Hardware Exclusively',
        description: 'We procure verified Tier-1 PV modules and tier-1 European/Asian inverters and battery systems with full manufacturer performance warranties.',
      },
      {
        title: 'Lifecycle O&M Stewardship',
        description: 'Long-term preventative maintenance contracts, thermal drone thermography, IV curve tracing, and real-time SCADA telemetry monitoring.',
      },
    ],
  },
  faqs: [
    {
      question: 'How do upcoming Ethiopian Electric Utility (EEU) tariff changes affect commercial solar ROI?',
      shortAnswer:
        'The Ethiopian Electric Utility is executing multi-year tariff adjustments to reach cost-recovery. As daytime commercial and industrial grid tariffs and peak kVA demand charges increase, each kilowatt-hour generated on your roof directly offsets increasingly expensive utility purchases, shortening the expected payback timeframe without requiring any increase in operational energy consumption.',
    },
    {
      question: 'Can solar panels synchronize directly with our existing factory diesel generator?',
      shortAnswer:
        'Yes. With our Solar + Generator Hybrid microgrid controller, the solar array syncs directly with your running diesel generator during utility outages. The controller continuously monitors electrical loads and modulates solar generation in milliseconds to maintain a minimum 25–30% load on the generator. This prevents dangerous "wet-stacking" and engine damage while reducing diesel fuel consumption by 30% to 65% during daytime outages.',
    },
    {
      question: 'Will our facility lose power if the EEU grid fails during the day with a solar-only system?',
      shortAnswer:
        'Standard grid-tied solar systems are legally required to shut down within milliseconds when the utility grid goes down (anti-islanding protection to prevent electrocuting utility workers servicing the lines). If your facility requires uninterrupted continuous power during outages, we integrate Lithium Iron Phosphate (LiFePO4) Battery Energy Storage (BESS) or our generator hybrid controller for sub-20ms seamless transition.',
    },
    {
      question: 'Will installing solar void our commercial building roof warranty or cause leaks?',
      shortAnswer:
        'No. Our structural engineering team conducts comprehensive roof audits before project approval. For standing seam metal roofs, we utilize non-penetrating aluminum clamps that preserve manufacturer watertight warranties. For flat concrete or trapezoidal roofs, we use engineered structural mounting with certified EPDM waterproofing gaskets and ballasted frames calculated to withstand 140 km/h wind gusts.',
    },
    {
      question: 'What warranties and performance guarantees come with a SolEth EPC installation?',
      shortAnswer:
        'Our installations include a 25-year linear performance warranty on Tier-1 PV modules (guaranteeing >=84.8% output at year 25), 5 to 10-year manufacturer warranties on commercial inverters, 10-year / 6,000-cycle warranties on LiFePO4 battery storage, and a 2-year turnkey EPC workmanship guarantee with preventative maintenance inspections.',
    },
    {
      question: 'How does SolEth assist with foreign currency and equipment importation into Ethiopia?',
      shortAnswer:
        'We work through established commercial banking channels and capital goods financing frameworks. Equipment is imported with duty-free exemptions where applicable under Ethiopian renewable energy investment incentives, with clear customs clearance handled through the Modjo Dry Port corridor.',
    },
  ],
  seo: {
    siteUrl: 'https://soleth-solar.com',
    keywords: [
      'Commercial Solar Ethiopia',
      'Industrial Solar EPC Addis Ababa',
      'Solar Generator Hybrid Microgrid',
      'Commercial Rooftop Solar Ethiopia',
      'EEU Electricity Tariff Solar Offset',
      'BESS Battery Storage Addis Ababa',
      'Factory Solar Power Ethiopia',
      'Commercial Solar Financing Ethiopia',
    ],
    geo: {
      region: 'ET-AA',
      placename: 'Addis Ababa',
      position: '9.0192;38.7525',
    },
  },
};
