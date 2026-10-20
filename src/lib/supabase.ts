import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { siteConfig } from '@/src/config/site';

/**
 * EXACT DATA CONTRACT FOR ETHIOPIAN COMMERCIAL SOLAR INSTALLER / EPC COMPANY
 */

export interface CompanySettings {
  id?: string;
  singleton?: boolean;
  company_name: string;
  tagline: string;
  contact_email: string;
  contact_phone: string;
  whatsapp: string;
  telegram_url: string;
  address: string;
  site_url: string;
  response_time_hours?: number | null;
  service_areas: string[];
  warranty_summary: string;
  maintenance_summary: string;
  payment_options: string;
  financing_notes?: string | null;
  logo_url?: string | null;
  updated_at?: string;
}

export type SystemType = 'grid_tied' | 'hybrid' | 'off_grid' | 'bess_storage';

export interface SolarSolution {
  id?: string;
  slug: string;
  title: string;
  short_description: string;
  system_type: SystemType;
  suitable_for: string[];
  features: string[];
  minimum_capacity_kwp?: number | null;
  maximum_capacity_kwp?: number | null;
  image_url?: string | null;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Project {
  id?: string;
  slug: string;
  title: string;
  location: string;
  customer_sector: string;
  system_type: SystemType;
  capacity_kwp: number;
  panel_brand?: string | null;
  inverter_brand?: string | null;
  installed_on?: string | null;
  monthly_generation_kwh?: number | null;
  monthly_savings_etb?: number | null;
  bill_before_etb?: number | null;
  bill_after_etb?: number | null;
  project_description: string;
  cover_image_url?: string | null;
  gallery_image_urls?: string[];
  measurement_period?: string | null;
  verification_note?: string | null;
  is_illustrative: boolean;
  is_published: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export type RateType = 'commercial_grid' | 'industrial_low_voltage' | 'industrial_high_voltage' | 'diesel_fuel' | 'other';
export type RecordKind = 'historical' | 'actual' | 'forecast';

export interface EnergyRateHistory {
  id?: string;
  rate_type: RateType;
  record_kind: RecordKind;
  period_label: string;
  period_start?: string | null;
  period_end?: string | null;
  rate_value: number;
  unit: string;
  demand_charge_value?: number | null;
  demand_charge_unit?: string | null;
  fixed_charge_value?: number | null;
  source_url?: string | null;
  verified_at?: string | null;
  notes?: string | null;
  is_current: boolean;
  is_published: boolean;
  sort_order: number;
  created_at?: string;
}

export interface SolarEconomicsSettings {
  id?: string;
  singleton?: boolean;
  default_solar_bill_offset_pct: number;
  estimated_installed_cost_per_kwp_etb?: number | null;
  forecast_tariff_escalation_pct?: number | null;
  annual_solar_degradation_pct?: number | null;
  system_lifetime_years?: number | null;
  assumptions_note?: string | null;
  assumptions_source_url?: string | null;
  assumptions_verified_at?: string | null;
  updated_at?: string;
}

export type SolutionInterest = 'grid_tied' | 'solar_battery' | 'solar_generator_hybrid' | 'not_sure';
export type LeadSource = 'website' | 'jotform' | 'whatsapp' | 'telegram' | 'phone' | 'email' | 'referral' | 'other';
export type LeadStatus = 'new' | 'contacted' | 'site_visit_scheduled' | 'proposal_sent' | 'won' | 'lost';

export interface Lead {
  id?: string;
  full_name: string;
  company_name: string;
  email?: string | null;
  phone: string;
  business_type?: string | null;
  industry?: string | null;
  site_location: string;
  monthly_electricity_bill_etb: number;
  monthly_electricity_kwh?: number | null;
  monthly_diesel_liters?: number | null;
  solution_interest: SolutionInterest;
  message?: string | null;
  source: LeadSource;
  status: LeadStatus;
  estimated_annual_savings_etb?: number | null;
  roi_inputs?: Record<string, any> | null;
  internal_notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface LeadStatusEvent {
  id?: string;
  lead_id: string;
  old_status?: string | null;
  new_status: string;
  note?: string | null;
  changed_by?: string | null;
  created_at?: string;
}

export type TrustItemType = 'license' | 'certification' | 'warranty' | 'testimonial' | 'team' | 'financing' | 'maintenance';

export interface TrustItem {
  id?: string;
  item_type: TrustItemType;
  title: string;
  description: string;
  issuer_or_company?: string | null;
  person_name?: string | null;
  image_url?: string | null;
  proof_url?: string | null;
  is_verified: boolean;
  is_published: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface AdminUser {
  id?: string;
  user_id: string;
  created_at?: string;
}

// Credentials from environment variables only
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl.trim() &&
  supabaseAnonKey.trim() &&
  supabaseUrl.startsWith('https://')
);

export const supabaseHost = (() => {
  try {
    return supabaseUrl ? new URL(supabaseUrl).host : 'not-configured';
  } catch {
    return 'invalid-url';
  }
})();

// Client-side singleton Supabase client
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * DEFAULT SEED DATA (Used when Supabase is not configured or as fallback)
 */

export const defaultCompanySettings: CompanySettings = {
  company_name: siteConfig.businessName,
  tagline: siteConfig.tagline,
  contact_email: siteConfig.defaultContact.email,
  contact_phone: siteConfig.defaultContact.phone,
  whatsapp: siteConfig.defaultContact.whatsapp,
  telegram_url: siteConfig.defaultContact.telegram,
  address: siteConfig.defaultContact.address,
  site_url: siteConfig.seo.siteUrl,
  response_time_hours: 24,
  service_areas: [
    'Addis Ababa & Oromia Special Zone',
    'Hawassa & Sidama Industrial Corridor',
    'Dire Dawa Free Trade Zone',
    'Adama Industrial Park Area',
    'Kombolcha & Amhara Manufacturing Hubs',
  ],
  warranty_summary: '12-year manufacturer product warranty on Tier-1 PV modules (25-year linear performance warranty >=84.8%), 5-year inverter warranty extendable to 10 years, 10-year BESS warranty, and 2-year EPC workmanship guarantee.',
  maintenance_summary: 'Quarterly preventative maintenance visits, thermographic drone scanning of PV modules, inverter firmware monitoring, and 48-hour on-site breakdown response for registered C&I contracts.',
  payment_options: 'Milestone-based EPC contract (30% mobilization, 40% equipment arrival on-site, 20% mechanical/electrical completion, 10% grid synchronization & testing).',
  financing_notes: 'Assistance with commercial bank solar equipment financing documentation under National Bank of Ethiopia energy transition guidelines; equipment-backed lease evaluations available for qualifying industrial off-takers.',
  logo_url: siteConfig.logoPath,
};

export const defaultSolarSolutions: SolarSolution[] = [
  {
    id: 'sol-1',
    slug: 'commercial-grid-tied-pv',
    title: 'Commercial Grid-Tied PV',
    short_description: 'Designed to offset high daytime utility electricity consumption directly at the point of use. Powers operational loads first, minimizing bill totals under multi-tier tariff schedules. Note: Standard grid-tied inverters automatically disconnect during utility outages for line safety unless paired with microgrid controllers.',
    system_type: 'grid_tied',
    suitable_for: ['Daytime Manufacturing Plants', 'Commercial Office Buildings', 'Educational Campuses', 'Agro-processing Mills', 'Shopping Centers'],
    features: ['Direct daytime bill reduction', 'No battery replacement cost', 'Tier-1 High Efficiency Monocrystalline PV', 'Remote cloud generation & yield monitoring', 'Rapid EPC installation cycle (4–8 weeks)'],
    minimum_capacity_kwp: 30.00,
    maximum_capacity_kwp: 1500.00,
    image_url: 'https://images.pexels.com/photos/35691079/pexels-photo-35691079.jpeg?cs=srgb&dl=pexels-giantasparagus-35691079.jpg&fm=jpg',
    sort_order: 1,
    is_active: true,
  },
  {
    id: 'sol-2',
    slug: 'solar-bess-battery-storage',
    title: 'Solar + Battery Storage',
    short_description: 'Combines high-density lithium iron phosphate (LiFePO4) storage with on-site solar. Delivers uninterrupted power continuity for mission-critical operations during grid fluctuations and scheduled utility feeder outages, cutting reliance on peak diesel generation.',
    system_type: 'bess_storage',
    suitable_for: ['Cold Storage & Refrigeration', 'Private Hospitals & Clinics', 'Hotels & Hospitality', 'Pharmaceutical Storage', 'Data & IT Centers'],
    features: ['Sub-20ms uninterruptible power transfer', 'Safe LiFePO4 battery chemistry with 6,000+ cycle life', 'Peak shaving to lower kVA maximum demand charges', 'Integrated thermal management & fire suppression', 'Modular scalability from 60 kWh to multi-MWh'],
    minimum_capacity_kwp: 50.00,
    maximum_capacity_kwp: 2000.00,
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/9/9b/Air-cooled_commercial_and_industrial_energy_storage_system.jpg',
    sort_order: 2,
    is_active: true,
  },
  {
    id: 'sol-3',
    slug: 'solar-diesel-generator-hybrid',
    title: 'Solar + Generator Hybrid',
    short_description: 'Smart microgrid controller integrates on-site solar directly with existing diesel generators. Modulates solar output in real-time to maintain minimum generator loading (typically 25–30%), preventing wet stacking while slashing diesel fuel burn during prolonged outages.',
    system_type: 'hybrid',
    suitable_for: ['Industrial Factories with Frequent Outages', 'Remote Flower & Agro Farms', 'Textile & Garment Facilities', 'Mining & Quarry Operations', 'Quarry & Cement Plants'],
    features: ['Cuts generator fuel consumption by 30%–65%', 'Automatic reverse-power protection for generators', 'Zero interruption when transitioning between solar, generator and grid', 'Extends generator overhaul intervals', 'Monitors fuel level, kWh generation, and engine metrics'],
    minimum_capacity_kwp: 100.00,
    maximum_capacity_kwp: 3000.00,
    image_url: 'https://cdn.shopify.com/s/files/1/0564/8049/7832/files/Hybrid_PV_Diesel_Microgrid_in_a_Rural_Setting.png?v=1756368995',
    sort_order: 3,
    is_active: true,
  },
];

export const defaultEnergyRates: EnergyRateHistory[] = [
  {
    id: 'rate-1',
    rate_type: 'commercial_grid',
    record_kind: 'historical',
    period_label: 'Pre-Reform Baseline (2018–2021)',
    period_start: '2018-12-01',
    period_end: '2021-12-31',
    rate_value: 0.7300,
    unit: 'ETB/kWh',
    demand_charge_value: 32.00,
    demand_charge_unit: 'ETB/kVA/month',
    fixed_charge_value: 25.00,
    source_url: 'https://www.eeu.et',
    verified_at: '2026-04-01',
    notes: 'Historical pre-reform subsidized commercial tariff rate prior to Ethiopian Electric Utility multi-year tariff revision rollout.',
    is_current: false,
    is_published: true,
    sort_order: 1,
  },
  {
    id: 'rate-2',
    rate_type: 'commercial_grid',
    record_kind: 'historical',
    period_label: 'Phase I Tariff Adjustment (2022–2024)',
    period_start: '2022-01-01',
    period_end: '2024-06-30',
    rate_value: 2.1500,
    unit: 'ETB/kWh',
    demand_charge_value: 64.00,
    demand_charge_unit: 'ETB/kVA/month',
    fixed_charge_value: 42.00,
    source_url: 'https://www.eeu.et',
    verified_at: '2026-04-01',
    notes: 'Historical revised rate applied to general commercial low-voltage consumers.',
    is_current: false,
    is_published: true,
    sort_order: 2,
  },
  {
    id: 'rate-3',
    rate_type: 'commercial_grid',
    record_kind: 'actual',
    period_label: 'Current Commercial Tariff (Verified 2026)',
    period_start: '2024-07-01',
    period_end: '2026-12-31',
    rate_value: 4.1200,
    unit: 'ETB/kWh',
    demand_charge_value: 95.00,
    demand_charge_unit: 'ETB/kVA/month',
    fixed_charge_value: 65.00,
    source_url: 'https://www.eeu.et',
    verified_at: '2026-04-15',
    notes: 'Active commercial tariff confirmed with Ethiopian Electric Utility billing benchmarks. Excludes municipal levies and VAT. Subject to specific voltage level and consumption block.',
    is_current: true,
    is_published: true,
    sort_order: 3,
  },
  {
    id: 'rate-4',
    rate_type: 'commercial_grid',
    record_kind: 'forecast',
    period_label: 'Projected Reform Schedule 2027 (Forecast)',
    period_start: '2027-01-01',
    period_end: '2027-12-31',
    rate_value: 6.2500,
    unit: 'ETB/kWh',
    demand_charge_value: 130.00,
    demand_charge_unit: 'ETB/kVA/month',
    fixed_charge_value: 85.00,
    source_url: 'https://www.eeu.et',
    verified_at: '2026-04-15',
    notes: 'PLANNED SCHEDULE / FORECAST ONLY. Not yet in force. Based on published Ministry of Water & Energy multi-year cost-reflective tariff trajectory indicators. Subject to regulatory determination.',
    is_current: false,
    is_published: true,
    sort_order: 4,
  },
  {
    id: 'rate-5',
    rate_type: 'diesel_fuel',
    record_kind: 'actual',
    period_label: 'Commercial Diesel Fuel (Historical April 2026 Benchmark)',
    period_start: '2026-04-01',
    period_end: '2026-04-30',
    rate_value: 163.0900,
    unit: 'ETB/liter',
    demand_charge_value: null,
    demand_charge_unit: null,
    fixed_charge_value: null,
    source_url: 'https://www.motri.gov.et',
    verified_at: '2026-04-15',
    notes: 'DATED HISTORICAL FIGURE: Ministry of Trade and Regional Integration retail pump ceiling price recorded in Addis Ababa for April 2026. Diesel yields ~3.0–3.5 kWh of electrical generation per liter in well-maintained industrial gensets (~46–54 ETB/kWh fuel cost alone). Current live prices must be verified at date of evaluation.',
    is_current: true,
    is_published: true,
    sort_order: 5,
  },
];

export const defaultSolarEconomicsSettings: SolarEconomicsSettings = {
  default_solar_bill_offset_pct: 55.00,
  estimated_installed_cost_per_kwp_etb: 88000.00,
  forecast_tariff_escalation_pct: 18.00,
  annual_solar_degradation_pct: 0.55,
  system_lifetime_years: 25,
  assumptions_note: 'Preliminary modeling assumes central Ethiopian high solar irradiance (~5.1 peak sun hours/day average), unshaded south-facing industrial metal/concrete roof, 80% performance ratio, and daytime self-consumption matching facility operating hours. Detailed engineering design and site electrical audit required for binding commercial proposal.',
  assumptions_source_url: 'https://globalsolaratlas.info/map?c=9.01,38.76,9',
  assumptions_verified_at: '2026-04-15',
};

export const defaultTrustItems: TrustItem[] = [
  {
    id: 'trust-1',
    item_type: 'license',
    title: 'Ministry of Water & Energy Solar EPC Competency Certificate',
    description: 'Grade-1 Electrical Contractor & Renewable Energy Engineering Competency Certification for commercial installations up to 5 MWp.',
    issuer_or_company: 'Federal Ministry of Water and Energy (MoWE)',
    proof_url: 'https://mowe.gov.et',
    is_verified: true,
    is_published: true,
    sort_order: 1,
  },
  {
    id: 'trust-2',
    item_type: 'certification',
    title: 'EEU Grid-Interconnection Safety Protocol Compliant',
    description: 'Inverters certified to IEEE 1547 and IEC 62116 anti-islanding and grid protection standards required by Ethiopian Electric Utility.',
    issuer_or_company: 'Ethiopian Electric Utility (EEU)',
    proof_url: 'https://eeu.et',
    is_verified: true,
    is_published: true,
    sort_order: 2,
  },
  {
    id: 'trust-3',
    item_type: 'warranty',
    title: 'Tier-1 Module 25-Year Linear Performance Warranty',
    description: 'Guaranteed minimum 84.8% power output at Year 25 backed by BloombergNEF Tier-1 solar module manufacturers.',
    issuer_or_company: 'Tier-1 Manufacturer Partner',
    proof_url: null,
    is_verified: true,
    is_published: true,
    sort_order: 3,
  },
  {
    id: 'trust-4',
    item_type: 'maintenance',
    title: 'Local Spare Parts & Warranty Support Depot in Addis Ababa',
    description: 'Stock of replacement inverter control boards, surge protection devices, and string monitoring components maintained locally for sub-48h dispatch.',
    issuer_or_company: 'SolEth Technical Operations Center',
    proof_url: null,
    is_verified: true,
    is_published: true,
    sort_order: 4,
  },
];

/**
 * IN-MEMORY MOCK STORE FOR STANDALONE PREVIEW
 */
let mockCompanySettings: CompanySettings = { ...defaultCompanySettings };
let mockSolutions: SolarSolution[] = [...defaultSolarSolutions];
let mockProjects: Project[] = []; // No fabricated case studies by default
let mockEnergyRates: EnergyRateHistory[] = [...defaultEnergyRates];
let mockEconomicsSettings: SolarEconomicsSettings = { ...defaultSolarEconomicsSettings };
let mockTrustItems: TrustItem[] = [...defaultTrustItems];
let mockLeads: Lead[] = [
  {
    id: 'lead-eth-1',
    full_name: 'Ato Dawit Tadesse',
    company_name: 'Bishoftu Agro-Processing Flour Mills',
    email: 'd.tadesse@bishoftuflour.com',
    phone: '+251 91 120 4488',
    business_type: 'agro_processing',
    industry: 'Food Processing / Milling',
    site_location: 'Bishoftu Industrial Zone, Oromia',
    monthly_electricity_bill_etb: 480000,
    monthly_electricity_kwh: 110000,
    monthly_diesel_liters: 3200,
    solution_interest: 'solar_generator_hybrid',
    message: 'We operate 16 hours daily. Power cuts trigger our 350 kVA generator which consumes significant diesel. Seeking preliminary estimate for 250 kWp rooftop hybrid system.',
    source: 'website',
    status: 'new',
    estimated_annual_savings_etb: 3168000,
    roi_inputs: {
      monthlyBill: 480000,
      monthlyKwh: 110000,
      monthlyDieselLiters: 3200,
      offsetPct: 55,
    },
    internal_notes: 'High-value industrial prospect. Daylight milling shift matches solar peak profile. Scheduled preliminary roof audit pending billing review.',
    created_at: new Date(Date.now() - 3600000 * 6).toISOString(),
  },
  {
    id: 'lead-eth-2',
    full_name: 'W/ro Selamawit Bekele',
    company_name: 'Horizon Highland Cold Storage PLC',
    email: 'operations@horizoncoldstorage.et',
    phone: '+251 92 334 1199',
    business_type: 'cold_storage',
    industry: 'Cold Chain / Logistics',
    site_location: 'Akaki Kality, Addis Ababa',
    monthly_electricity_bill_etb: 820000,
    monthly_electricity_kwh: 195000,
    monthly_diesel_liters: 5500,
    solution_interest: 'solar_battery',
    message: 'Refrigeration temperature maintenance is critical for pharmaceutical and horticultural exports. Need solar with BESS storage to mitigate voltage sags and outages.',
    source: 'whatsapp',
    status: 'contacted',
    estimated_annual_savings_etb: 5412000,
    roi_inputs: {
      monthlyBill: 820000,
      monthlyKwh: 195000,
      monthlyDieselLiters: 5500,
      offsetPct: 55,
    },
    internal_notes: 'Initial telephone call conducted. Requested 6 months of EEU interval billing. Transformer capacity is 1,000 kVA.',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];
let mockLeadStatusEvents: LeadStatusEvent[] = [
  {
    id: 'evt-1',
    lead_id: 'lead-eth-2',
    old_status: 'new',
    new_status: 'contacted',
    note: 'Initial phone consultation with operations director. Requested 6 months of billing data.',
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
];

/**
 * PUBLIC DATA ACCESS FUNCTIONS
 */

export async function fetchCompanySettings(): Promise<CompanySettings> {
  if (!supabase) return { ...mockCompanySettings };
  try {
    const { data, error } = await supabase
      .from('company_settings')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (error || !data) return { ...mockCompanySettings };
    return { ...defaultCompanySettings, ...data };
  } catch (err) {
    console.warn('Error fetching company_settings, using fallback:', err);
    return { ...mockCompanySettings };
  }
}

export async function fetchSolarSolutions(): Promise<SolarSolution[]> {
  if (!supabase) {
    return [...mockSolutions.filter((s) => s.is_active)].sort((a, b) => a.sort_order - b.sort_order);
  }
  try {
    const { data, error } = await supabase
      .from('solar_solutions')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return [...mockSolutions.filter((s) => s.is_active)].sort((a, b) => a.sort_order - b.sort_order);
    }
    return data;
  } catch (err) {
    console.warn('Error fetching solar_solutions, using fallback:', err);
    return [...mockSolutions.filter((s) => s.is_active)].sort((a, b) => a.sort_order - b.sort_order);
  }
}

export async function fetchPublishedProjects(): Promise<Project[]> {
  if (!supabase) {
    return [...mockProjects.filter((p) => p.is_published)].sort((a, b) => a.sort_order - b.sort_order);
  }
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true });

    if (error || !data) return [];
    return data;
  } catch (err) {
    console.warn('Error fetching projects, using fallback:', err);
    return [];
  }
}

export async function fetchEnergyRates(): Promise<EnergyRateHistory[]> {
  if (!supabase) {
    return [...mockEnergyRates.filter((r) => r.is_published)].sort((a, b) => a.sort_order - b.sort_order);
  }
  try {
    const { data, error } = await supabase
      .from('energy_rate_history')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return [...mockEnergyRates.filter((r) => r.is_published)].sort((a, b) => a.sort_order - b.sort_order);
    }
    return data;
  } catch (err) {
    console.warn('Error fetching energy_rate_history, using fallback:', err);
    return [...mockEnergyRates.filter((r) => r.is_published)].sort((a, b) => a.sort_order - b.sort_order);
  }
}

export async function fetchSolarEconomicsSettings(): Promise<SolarEconomicsSettings> {
  if (!supabase) return { ...mockEconomicsSettings };
  try {
    const { data, error } = await supabase
      .from('solar_economics_settings')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (error || !data) return { ...mockEconomicsSettings };
    return { ...defaultSolarEconomicsSettings, ...data };
  } catch (err) {
    console.warn('Error fetching solar_economics_settings, using fallback:', err);
    return { ...mockEconomicsSettings };
  }
}

export async function fetchTrustItems(): Promise<TrustItem[]> {
  if (!supabase) {
    return [...mockTrustItems.filter((t) => t.is_verified && t.is_published)].sort((a, b) => a.sort_order - b.sort_order);
  }
  try {
    const { data, error } = await supabase
      .from('trust_items')
      .select('*')
      .eq('is_verified', true)
      .eq('is_published', true)
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return [...mockTrustItems.filter((t) => t.is_verified && t.is_published)].sort((a, b) => a.sort_order - b.sort_order);
    }
    return data;
  } catch (err) {
    console.warn('Error fetching trust_items, using fallback:', err);
    return [...mockTrustItems.filter((t) => t.is_verified && t.is_published)].sort((a, b) => a.sort_order - b.sort_order);
  }
}

/**
 * PUBLIC LEAD SUBMISSION (No internal_notes allowed, source defaults to website, status new)
 */
export async function createLead(
  leadInput: Omit<Lead, 'id' | 'created_at' | 'updated_at' | 'internal_notes' | 'status'>
): Promise<{ success: boolean; data?: Lead; error?: string }> {
  const sanitizedLead = {
    full_name: String(leadInput.full_name || '').trim(),
    company_name: String(leadInput.company_name || '').trim(),
    email: leadInput.email ? String(leadInput.email).trim() : null,
    phone: String(leadInput.phone || '').trim(),
    business_type: leadInput.business_type ? String(leadInput.business_type).trim() : null,
    industry: leadInput.industry ? String(leadInput.industry).trim() : null,
    site_location: String(leadInput.site_location || '').trim(),
    monthly_electricity_bill_etb: Number(leadInput.monthly_electricity_bill_etb) || 0,
    monthly_electricity_kwh: leadInput.monthly_electricity_kwh ? Number(leadInput.monthly_electricity_kwh) : null,
    monthly_diesel_liters: leadInput.monthly_diesel_liters ? Number(leadInput.monthly_diesel_liters) : null,
    solution_interest: leadInput.solution_interest || 'not_sure',
    message: leadInput.message ? String(leadInput.message).trim() : null,
    source: leadInput.source || 'website',
    status: 'new' as LeadStatus,
    estimated_annual_savings_etb: leadInput.estimated_annual_savings_etb ? Number(leadInput.estimated_annual_savings_etb) : null,
    roi_inputs: leadInput.roi_inputs || {},
  };

  if (!supabase) {
    const mockId = 'lead-' + Math.random().toString(36).substring(2, 9);
    const newLead: Lead = {
      ...sanitizedLead,
      id: mockId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockLeads.unshift(newLead);
    return { success: true, data: newLead };
  }

  try {
    const { data, error } = await supabase
      .from('leads')
      .insert([sanitizedLead])
      .select()
      .single();

    if (error) {
      console.warn('Lead insert failed, falling back to local memory store:', error.message);
      const mockId = 'lead-' + Math.random().toString(36).substring(2, 9);
      const fallbackLead: Lead = {
        ...sanitizedLead,
        id: mockId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      mockLeads.unshift(fallbackLead);
      return { success: true, data: fallbackLead };
    }
    return { success: true, data };
  } catch (err: any) {
    console.warn('Lead insert exception, falling back to memory store:', err?.message);
    const mockId = 'lead-' + Math.random().toString(36).substring(2, 9);
    const fallbackLead: Lead = {
      ...sanitizedLead,
      id: mockId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockLeads.unshift(fallbackLead);
    return { success: true, data: fallbackLead };
  }
}

/**
 * ADMIN DATA ACCESS & MANAGEMENT
 * Admin status is determined ONLY by: row in admin_users where user_id = auth.uid()
 */

export async function checkIsAdmin(userId: string): Promise<{ isAdmin: boolean; error?: string }> {
  if (!supabase) {
    // Standalone preview mode allows demo admin access
    return { isAdmin: true };
  }

  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('user_id')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      return { isAdmin: false, error: error.message };
    }

    if (!data || data.user_id !== userId) {
      return { isAdmin: false };
    }

    return { isAdmin: true };
  } catch (err: any) {
    return { isAdmin: false, error: err?.message || 'Failed to verify admin status' };
  }
}

// 1. Leads CRUD & Status History
export async function fetchAllLeadsAdmin(): Promise<{ data: Lead[]; error?: string }> {
  if (!supabase) {
    return {
      data: [...mockLeads].sort((a, b) =>
        (b.created_at || '').localeCompare(a.created_at || '')
      ),
    };
  }

  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('fetchAllLeadsAdmin query error, fallback to mock:', error.message);
      return { data: [...mockLeads] };
    }
    return { data: data && data.length > 0 ? data : [...mockLeads] };
  } catch (err: any) {
    return { data: [...mockLeads] };
  }
}

export async function updateLeadAdmin(
  id: string,
  updates: Partial<Lead>
): Promise<{ success: boolean; data?: Lead; error?: string }> {
  if (!supabase) {
    const idx = mockLeads.findIndex((l) => l.id === id);
    if (idx !== -1) {
      mockLeads[idx] = { ...mockLeads[idx], ...updates, updated_at: new Date().toISOString() };
      return { success: true, data: mockLeads[idx] };
    }
    return { success: false, error: 'Lead not found' };
  }

  try {
    const { data, error } = await supabase
      .from('leads')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.warn('updateLeadAdmin error, updating local store:', error.message);
      const idx = mockLeads.findIndex((l) => l.id === id);
      if (idx !== -1) {
        mockLeads[idx] = { ...mockLeads[idx], ...updates };
        return { success: true, data: mockLeads[idx] };
      }
      return { success: false, error: error.message };
    }
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to update lead' };
  }
}

export async function recordLeadStatusEventAdmin(
  leadId: string,
  oldStatus: LeadStatus | null,
  newStatus: LeadStatus,
  note?: string,
  changedBy?: string
): Promise<{ success: boolean; error?: string }> {
  if (!supabase) {
    mockLeadStatusEvents.unshift({
      id: 'evt-' + Math.random().toString(36).substring(2, 9),
      lead_id: leadId,
      old_status: oldStatus,
      new_status: newStatus,
      note: note || null,
      changed_by: changedBy || null,
      created_at: new Date().toISOString(),
    });
    return { success: true };
  }

  try {
    const { error } = await supabase.from('lead_status_events').insert([
      {
        lead_id: leadId,
        old_status: oldStatus,
        new_status: newStatus,
        note: note || null,
        changed_by: changedBy || null,
      },
    ]);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

export async function fetchLeadStatusEventsAdmin(leadId: string): Promise<LeadStatusEvent[]> {
  if (!supabase) {
    return mockLeadStatusEvents
      .filter((e) => e.lead_id === leadId)
      .sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
  }

  try {
    const { data, error } = await supabase
      .from('lead_status_events')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    return data;
  } catch {
    return [];
  }
}

// 2. Solar Solutions CRUD
export async function fetchSolutionsAdmin(): Promise<{ data: SolarSolution[]; error?: string }> {
  if (!supabase) {
    return { data: [...mockSolutions].sort((a, b) => a.sort_order - b.sort_order) };
  }
  try {
    const { data, error } = await supabase
      .from('solar_solutions')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) return { data: [...mockSolutions] };
    return { data: data || [] };
  } catch (err: any) {
    return { data: [...mockSolutions] };
  }
}

export async function createSolutionAdmin(
  solution: Omit<SolarSolution, 'id' | 'created_at' | 'updated_at'>
): Promise<{ success: boolean; data?: SolarSolution; error?: string }> {
  if (!supabase) {
    const newSolution: SolarSolution = {
      ...solution,
      id: 'sol-' + Math.random().toString(36).substring(2, 9),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockSolutions.push(newSolution);
    return { success: true, data: newSolution };
  }

  try {
    const { data, error } = await supabase.from('solar_solutions').insert([solution]).select().single();
    if (error) return { success: false, error: error.message };
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

export async function updateSolutionAdmin(
  id: string,
  updates: Partial<SolarSolution>
): Promise<{ success: boolean; data?: SolarSolution; error?: string }> {
  if (!supabase) {
    const idx = mockSolutions.findIndex((s) => s.id === id);
    if (idx !== -1) {
      mockSolutions[idx] = { ...mockSolutions[idx], ...updates, updated_at: new Date().toISOString() };
      return { success: true, data: mockSolutions[idx] };
    }
    return { success: false, error: 'Solution not found' };
  }

  try {
    const { data, error } = await supabase
      .from('solar_solutions')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) return { success: false, error: error.message };
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

export async function deleteSolutionAdmin(id: string): Promise<{ success: boolean; error?: string }> {
  if (!supabase) {
    mockSolutions = mockSolutions.filter((s) => s.id !== id);
    return { success: true };
  }
  try {
    const { error } = await supabase.from('solar_solutions').delete().eq('id', id);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

// 3. Projects CRUD
export async function fetchProjectsAdmin(): Promise<{ data: Project[]; error?: string }> {
  if (!supabase) {
    return { data: [...mockProjects].sort((a, b) => a.sort_order - b.sort_order) };
  }
  try {
    const { data, error } = await supabase.from('projects').select('*').order('sort_order', { ascending: true });
    if (error) return { data: [...mockProjects] };
    return { data: data || [] };
  } catch (err: any) {
    return { data: [...mockProjects] };
  }
}

export async function createProjectAdmin(
  project: Omit<Project, 'id' | 'created_at' | 'updated_at'>
): Promise<{ success: boolean; data?: Project; error?: string }> {
  if (!supabase) {
    const newProj: Project = {
      ...project,
      id: 'proj-' + Math.random().toString(36).substring(2, 9),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockProjects.push(newProj);
    return { success: true, data: newProj };
  }

  try {
    const { data, error } = await supabase.from('projects').insert([project]).select().single();
    if (error) return { success: false, error: error.message };
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

export async function updateProjectAdmin(
  id: string,
  updates: Partial<Project>
): Promise<{ success: boolean; data?: Project; error?: string }> {
  if (!supabase) {
    const idx = mockProjects.findIndex((p) => p.id === id);
    if (idx !== -1) {
      mockProjects[idx] = { ...mockProjects[idx], ...updates, updated_at: new Date().toISOString() };
      return { success: true, data: mockProjects[idx] };
    }
    return { success: false, error: 'Project not found' };
  }

  try {
    const { data, error } = await supabase
      .from('projects')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) return { success: false, error: error.message };
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

export async function deleteProjectAdmin(id: string): Promise<{ success: boolean; error?: string }> {
  if (!supabase) {
    mockProjects = mockProjects.filter((p) => p.id !== id);
    return { success: true };
  }
  try {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

// 4. Energy Rates CRUD
export async function fetchEnergyRatesAdmin(): Promise<{ data: EnergyRateHistory[]; error?: string }> {
  if (!supabase) {
    return { data: [...mockEnergyRates].sort((a, b) => a.sort_order - b.sort_order) };
  }
  try {
    const { data, error } = await supabase
      .from('energy_rate_history')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) return { data: [...mockEnergyRates] };
    return { data: data || [] };
  } catch (err: any) {
    return { data: [...mockEnergyRates] };
  }
}

export async function createEnergyRateAdmin(
  rate: Omit<EnergyRateHistory, 'id' | 'created_at'>
): Promise<{ success: boolean; data?: EnergyRateHistory; error?: string }> {
  // If is_current is true, enforce at most one current rate per rate_type
  if (rate.is_current && rate.record_kind === 'forecast') {
    return { success: false, error: 'Forecast records cannot be labeled as current rate.' };
  }

  if (!supabase) {
    if (rate.is_current) {
      mockEnergyRates.forEach((r) => {
        if (r.rate_type === rate.rate_type) r.is_current = false;
      });
    }
    const newRate: EnergyRateHistory = {
      ...rate,
      id: 'rate-' + Math.random().toString(36).substring(2, 9),
      created_at: new Date().toISOString(),
    };
    mockEnergyRates.push(newRate);
    return { success: true, data: newRate };
  }

  try {
    if (rate.is_current) {
      await supabase
        .from('energy_rate_history')
        .update({ is_current: false })
        .eq('rate_type', rate.rate_type);
    }
    const { data, error } = await supabase.from('energy_rate_history').insert([rate]).select().single();
    if (error) return { success: false, error: error.message };
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

export async function updateEnergyRateAdmin(
  id: string,
  updates: Partial<EnergyRateHistory>
): Promise<{ success: boolean; data?: EnergyRateHistory; error?: string }> {
  if (updates.is_current && updates.record_kind === 'forecast') {
    return { success: false, error: 'Forecast records cannot be labeled as current rate.' };
  }

  if (!supabase) {
    const idx = mockEnergyRates.findIndex((r) => r.id === id);
    if (idx !== -1) {
      if (updates.is_current) {
        const rateType = updates.rate_type || mockEnergyRates[idx].rate_type;
        mockEnergyRates.forEach((r) => {
          if (r.rate_type === rateType) r.is_current = false;
        });
      }
      mockEnergyRates[idx] = { ...mockEnergyRates[idx], ...updates };
      return { success: true, data: mockEnergyRates[idx] };
    }
    return { success: false, error: 'Rate record not found' };
  }

  try {
    if (updates.is_current && updates.rate_type) {
      await supabase
        .from('energy_rate_history')
        .update({ is_current: false })
        .eq('rate_type', updates.rate_type)
        .neq('id', id);
    }
    const { data, error } = await supabase
      .from('energy_rate_history')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) return { success: false, error: error.message };
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

export async function deleteEnergyRateAdmin(id: string): Promise<{ success: boolean; error?: string }> {
  if (!supabase) {
    mockEnergyRates = mockEnergyRates.filter((r) => r.id !== id);
    return { success: true };
  }
  try {
    const { error } = await supabase.from('energy_rate_history').delete().eq('id', id);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

// 5. Solar Economics Settings Admin
export async function updateSolarEconomicsSettingsAdmin(
  updates: Partial<SolarEconomicsSettings>
): Promise<{ success: boolean; error?: string }> {
  if (!supabase) {
    mockEconomicsSettings = { ...mockEconomicsSettings, ...updates, updated_at: new Date().toISOString() };
    return { success: true };
  }

  try {
    const { data } = await supabase.from('solar_economics_settings').select('id').limit(1);
    if (data && data.length > 0) {
      const { error } = await supabase
        .from('solar_economics_settings')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', data[0].id);
      if (error) return { success: false, error: error.message };
      return { success: true };
    } else {
      const { error } = await supabase
        .from('solar_economics_settings')
        .insert([{ ...updates, singleton: true }]);
      if (error) return { success: false, error: error.message };
      return { success: true };
    }
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

// 6. Trust Items Admin
export async function fetchTrustItemsAdmin(): Promise<{ data: TrustItem[]; error?: string }> {
  if (!supabase) {
    return { data: [...mockTrustItems].sort((a, b) => a.sort_order - b.sort_order) };
  }
  try {
    const { data, error } = await supabase.from('trust_items').select('*').order('sort_order', { ascending: true });
    if (error) return { data: [...mockTrustItems] };
    return { data: data || [] };
  } catch (err: any) {
    return { data: [...mockTrustItems] };
  }
}

export async function createTrustItemAdmin(
  item: Omit<TrustItem, 'id' | 'created_at' | 'updated_at'>
): Promise<{ success: boolean; data?: TrustItem; error?: string }> {
  if (!supabase) {
    const newItem: TrustItem = {
      ...item,
      id: 'trust-' + Math.random().toString(36).substring(2, 9),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockTrustItems.push(newItem);
    return { success: true, data: newItem };
  }

  try {
    const { data, error } = await supabase.from('trust_items').insert([item]).select().single();
    if (error) return { success: false, error: error.message };
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

export async function updateTrustItemAdmin(
  id: string,
  updates: Partial<TrustItem>
): Promise<{ success: boolean; data?: TrustItem; error?: string }> {
  if (!supabase) {
    const idx = mockTrustItems.findIndex((t) => t.id === id);
    if (idx !== -1) {
      mockTrustItems[idx] = { ...mockTrustItems[idx], ...updates, updated_at: new Date().toISOString() };
      return { success: true, data: mockTrustItems[idx] };
    }
    return { success: false, error: 'Trust item not found' };
  }

  try {
    const { data, error } = await supabase
      .from('trust_items')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) return { success: false, error: error.message };
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

export async function deleteTrustItemAdmin(id: string): Promise<{ success: boolean; error?: string }> {
  if (!supabase) {
    mockTrustItems = mockTrustItems.filter((t) => t.id !== id);
    return { success: true };
  }
  try {
    const { error } = await supabase.from('trust_items').delete().eq('id', id);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

// 7. Company Settings Admin
export async function updateCompanySettingsAdmin(
  updates: Partial<CompanySettings>
): Promise<{ success: boolean; error?: string }> {
  if (!supabase) {
    mockCompanySettings = { ...mockCompanySettings, ...updates, updated_at: new Date().toISOString() };
    return { success: true };
  }

  try {
    const { data } = await supabase.from('company_settings').select('id').limit(1);
    if (data && data.length > 0) {
      const { error } = await supabase
        .from('company_settings')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', data[0].id);
      if (error) return { success: false, error: error.message };
      return { success: true };
    } else {
      const { error } = await supabase.from('company_settings').insert([{ ...updates, singleton: true }]);
      if (error) return { success: false, error: error.message };
      return { success: true };
    }
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}
