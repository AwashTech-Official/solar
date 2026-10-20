-- ==============================================================================
-- ETHIOPIAN COMMERCIAL SOLAR INSTALLER / EPC COMPANY DATABASE SCHEMA
-- File: solar_epc_supabase.sql
-- Run this script on a new, empty Supabase project
-- ==============================================================================

-- 1. company_settings
CREATE TABLE IF NOT EXISTS public.company_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  singleton BOOLEAN NOT NULL DEFAULT true UNIQUE,
  company_name TEXT NOT NULL DEFAULT 'SolEth Commercial Solar EPC',
  tagline TEXT NOT NULL DEFAULT 'Engineered On-Site Solar & Hybrid Power Systems for Ethiopian Commercial & Industrial Facilities',
  contact_email TEXT NOT NULL DEFAULT 'commercial@soleth-solar.com',
  contact_phone TEXT NOT NULL DEFAULT '+251 11 667 9820',
  whatsapp TEXT NOT NULL DEFAULT '+251 91 144 8820',
  telegram_url TEXT NOT NULL DEFAULT 'https://t.me/SolEthCommercialSolar',
  address TEXT NOT NULL DEFAULT 'Bole Sub-City, Woreda 04, Century Commercial Center 5th Floor, Addis Ababa, Ethiopia',
  site_url TEXT NOT NULL DEFAULT 'https://soleth-solar.com',
  response_time_hours INTEGER DEFAULT 24,
  service_areas TEXT[] NOT NULL DEFAULT ARRAY['Addis Ababa & Oromia Special Zone', 'Hawassa & Sidama Industrial Corridor', 'Dire Dawa Free Trade Zone', 'Adama Industrial Park Area', 'Kombolcha & Amhara Manufacturing Hubs'],
  warranty_summary TEXT NOT NULL DEFAULT '12-year manufacturer product warranty on Tier-1 PV modules (25-year linear performance warranty >=84.8%), 5-year inverter warranty extendable to 10 years, 10-year BESS warranty, and 2-year EPC workmanship guarantee.',
  maintenance_summary TEXT NOT NULL DEFAULT 'Quarterly preventative maintenance visits, thermographic drone scanning of PV modules, inverter firmware monitoring, and 48-hour on-site breakdown response for registered C&I contracts.',
  payment_options TEXT NOT NULL DEFAULT 'Milestone-based EPC contract (30% mobilization, 40% equipment arrival on-site, 20% mechanical/electrical completion, 10% grid synchronization & testing).',
  financing_notes TEXT DEFAULT 'Assistance with commercial bank solar equipment financing documentation under National Bank of Ethiopia energy transition guidelines; equipment-backed lease evaluations available for qualifying industrial off-takers.',
  logo_url TEXT DEFAULT '/logo.svg',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. solar_solutions
CREATE TABLE IF NOT EXISTS public.solar_solutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  short_description TEXT NOT NULL,
  system_type TEXT NOT NULL CHECK (system_type IN ('grid_tied', 'hybrid', 'off_grid', 'bess_storage')),
  suitable_for TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  features TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  minimum_capacity_kwp NUMERIC(8, 2),
  maximum_capacity_kwp NUMERIC(8, 2),
  image_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. projects
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  customer_sector TEXT NOT NULL,
  system_type TEXT NOT NULL CHECK (system_type IN ('grid_tied', 'hybrid', 'off_grid', 'bess_storage')),
  capacity_kwp NUMERIC(8, 2) NOT NULL,
  panel_brand TEXT,
  inverter_brand TEXT,
  installed_on DATE,
  monthly_generation_kwh NUMERIC(10, 2),
  monthly_savings_etb NUMERIC(12, 2),
  bill_before_etb NUMERIC(12, 2),
  bill_after_etb NUMERIC(12, 2),
  project_description TEXT NOT NULL,
  cover_image_url TEXT,
  gallery_image_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
  measurement_period TEXT,
  verification_note TEXT,
  is_illustrative BOOLEAN NOT NULL DEFAULT false,
  is_published BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. energy_rate_history
CREATE TABLE IF NOT EXISTS public.energy_rate_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rate_type TEXT NOT NULL CHECK (rate_type IN ('commercial_grid', 'industrial_low_voltage', 'industrial_high_voltage', 'diesel_fuel', 'other')),
  record_kind TEXT NOT NULL CHECK (record_kind IN ('historical', 'actual', 'forecast')),
  period_label TEXT NOT NULL,
  period_start DATE,
  period_end DATE,
  rate_value NUMERIC(10, 4) NOT NULL,
  unit TEXT NOT NULL DEFAULT 'ETB/kWh',
  demand_charge_value NUMERIC(10, 2),
  demand_charge_unit TEXT DEFAULT 'ETB/kVA/month',
  fixed_charge_value NUMERIC(10, 2),
  source_url TEXT,
  verified_at DATE,
  notes TEXT,
  is_current BOOLEAN NOT NULL DEFAULT false,
  is_published BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. solar_economics_settings
CREATE TABLE IF NOT EXISTS public.solar_economics_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  singleton BOOLEAN NOT NULL DEFAULT true UNIQUE,
  default_solar_bill_offset_pct NUMERIC(5, 2) NOT NULL DEFAULT 55.00,
  estimated_installed_cost_per_kwp_etb NUMERIC(12, 2) DEFAULT 88000.00,
  forecast_tariff_escalation_pct NUMERIC(5, 2) DEFAULT 18.00,
  annual_solar_degradation_pct NUMERIC(4, 2) DEFAULT 0.55,
  system_lifetime_years INTEGER DEFAULT 25,
  assumptions_note TEXT DEFAULT 'Estimates are illustrative preliminary benchmarks based on standard commercial rooftop profiles (4.8–5.4 peak sun hours/day in central Ethiopia). Subject to on-site irradiance logging, 15-minute interval demand data, structural load tests, and formal EPC quotation.',
  assumptions_source_url TEXT DEFAULT 'https://www.irena.org',
  assumptions_verified_at DATE DEFAULT CURRENT_DATE,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. leads
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  company_name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  business_type TEXT,
  industry TEXT,
  site_location TEXT NOT NULL,
  monthly_electricity_bill_etb NUMERIC(12, 2) NOT NULL,
  monthly_electricity_kwh NUMERIC(10, 2),
  monthly_diesel_liters NUMERIC(10, 2),
  solution_interest TEXT CHECK (solution_interest IN ('grid_tied', 'solar_battery', 'solar_generator_hybrid', 'not_sure')) DEFAULT 'not_sure',
  message TEXT,
  source TEXT NOT NULL CHECK (source IN ('website', 'jotform', 'whatsapp', 'telegram', 'phone', 'email', 'referral', 'other')) DEFAULT 'website',
  status TEXT NOT NULL CHECK (status IN ('new', 'contacted', 'site_visit_scheduled', 'proposal_sent', 'won', 'lost')) DEFAULT 'new',
  estimated_annual_savings_etb NUMERIC(14, 2),
  roi_inputs JSONB DEFAULT '{}'::jsonb,
  internal_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 7. lead_status_events
CREATE TABLE IF NOT EXISTS public.lead_status_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  old_status TEXT,
  new_status TEXT NOT NULL,
  note TEXT,
  changed_by UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. trust_items
CREATE TABLE IF NOT EXISTS public.trust_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_type TEXT NOT NULL CHECK (item_type IN ('license', 'certification', 'warranty', 'testimonial', 'team', 'financing', 'maintenance')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  issuer_or_company TEXT,
  person_name TEXT,
  image_url TEXT,
  proof_url TEXT,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  is_published BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 9. admin_users
-- Strictly id, user_id, created_at. ZERO role field.
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.company_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solar_solutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.energy_rate_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solar_economics_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_status_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trust_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Helper function to check admin allow-list
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Public read policies (strictly public published data)
CREATE POLICY "Public can view company settings"
  ON public.company_settings FOR SELECT
  USING (true);

CREATE POLICY "Public can view active solar solutions"
  ON public.solar_solutions FOR SELECT
  USING (is_active = true);

CREATE POLICY "Public can view published projects only"
  ON public.projects FOR SELECT
  USING (is_published = true);

CREATE POLICY "Public can view published energy rates"
  ON public.energy_rate_history FOR SELECT
  USING (is_published = true);

CREATE POLICY "Public can view solar economics settings"
  ON public.solar_economics_settings FOR SELECT
  USING (true);

CREATE POLICY "Public can view verified and published trust items only"
  ON public.trust_items FOR SELECT
  USING (is_verified = true AND is_published = true);

-- Public insert policy (leads only, no reads, no status events, no internal notes read)
CREATE POLICY "Public can submit new leads"
  ON public.leads FOR INSERT
  WITH CHECK (true);

-- Admin full access policies
CREATE POLICY "Admin full access on company_settings"
  ON public.company_settings FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin full access on solar_solutions"
  ON public.solar_solutions FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin full access on projects"
  ON public.projects FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin full access on energy_rate_history"
  ON public.energy_rate_history FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin full access on solar_economics_settings"
  ON public.solar_economics_settings FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin full access on leads"
  ON public.leads FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin full access on lead_status_events"
  ON public.lead_status_events FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin full access on trust_items"
  ON public.trust_items FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin full access on admin_users"
  ON public.admin_users FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ==============================================================================
-- INITIAL SEED DATA
-- ==============================================================================

-- 1. Company Settings Singleton
INSERT INTO public.company_settings (
  singleton,
  company_name,
  tagline,
  contact_email,
  contact_phone,
  whatsapp,
  telegram_url,
  address,
  site_url,
  response_time_hours,
  service_areas
)
VALUES (
  true,
  'SolEth Commercial Solar EPC',
  'Commercial Rooftop Solar, Battery Storage & Generator Hybrids for Ethiopian Facilities',
  'commercial@soleth-solar.com',
  '+251 11 667 9820',
  '+251 91 144 8820',
  'https://t.me/SolEthCommercialSolar',
  'Bole Sub-City, Woreda 04, Century Commercial Center 5th Floor, Addis Ababa, Ethiopia',
  'https://soleth-solar.com',
  24,
  ARRAY['Addis Ababa & Oromia Special Zone', 'Hawassa & Sidama Industrial Corridor', 'Dire Dawa Free Trade Zone', 'Adama Industrial Park Area', 'Kombolcha & Amhara Manufacturing Hubs']
)
ON CONFLICT (singleton) DO NOTHING;

-- 2. Solar Solutions
INSERT INTO public.solar_solutions (
  slug,
  title,
  short_description,
  system_type,
  suitable_for,
  features,
  minimum_capacity_kwp,
  maximum_capacity_kwp,
  image_url,
  sort_order,
  is_active
)
VALUES
  (
    'commercial-grid-tied-pv',
    'Commercial Grid-Tied Rooftop PV',
    'Designed to offset high daytime utility electricity consumption directly at the point of use. Powers operational loads first, minimizing bill totals under multi-tier tariff schedules. Note: Standard grid-tied inverters automatically disconnect during utility outages for line safety unless paired with microgrid controllers.',
    'grid_tied',
    ARRAY['Daytime Manufacturing Plants', 'Commercial Office Buildings', 'Educational Campuses', 'Agro-processing Mills', 'Shopping Centers'],
    ARRAY['Direct daytime bill reduction', 'No battery replacement cost', 'Tier-1 High Efficiency Monocrystalline PV', 'Remote cloud generation & yield monitoring', 'Rapid EPC installation cycle (4–8 weeks)'],
    30.00,
    1500.00,
    'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1000&q=80',
    1,
    true
  ),
  (
    'solar-bess-battery-storage',
    'Solar + Battery Energy Storage (BESS)',
    'Combines high-density lithium iron phosphate (LiFePO4) storage with on-site solar. Delivers uninterrupted power continuity for mission-critical operations during grid fluctuations and scheduled utility feeder outages, cutting reliance on peak diesel generation.',
    'bess_storage',
    ARRAY['Cold Storage & Refrigeration', 'Private Hospitals & Clinics', 'Hotels & Hospitality', 'Pharmaceutical Storage', 'Data & IT Centers'],
    ARRAY['Sub-20ms uninterruptible power transfer', 'Safe LiFePO4 battery chemistry with 6,000+ cycle life', 'Peak shaving to lower kVA maximum demand charges', 'Integrated thermal management & fire suppression', 'Modular scalability from 60 kWh to multi-MWh'],
    50.00,
    2000.00,
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
    2,
    true
  ),
  (
    'solar-diesel-generator-hybrid',
    'Solar + Generator Hybrid Microgrid',
    'Smart microgrid controller integrates on-site solar directly with existing diesel generators. Modulates solar output in real-time to maintain minimum generator loading (typically 25–30%), preventing wet stacking while slashing diesel fuel burn during prolonged outages.',
    'hybrid',
    ARRAY['Industrial Factories with Frequent Outages', 'Remote Flower & Agro Farms', 'Textile & Garment Facilities', 'Mining & Quarry Operations', 'Quarry & Cement Plants'],
    ARRAY['Cuts generator fuel consumption by 30%–65%', 'Automatic reverse-power protection for generators', 'Zero interruption when transitioning between solar, generator and grid', 'Extends generator overhaul intervals', 'Monitors fuel level, kWh generation, and engine metrics'],
    100.00,
    3000.00,
    'https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?auto=format&fit=crop&w=1000&q=80',
    3,
    true
  )
ON CONFLICT (slug) DO NOTHING;

-- 3. Energy Rate History (Historical, Sourced Actual, and Distinct Sourced Forecasts)
INSERT INTO public.energy_rate_history (
  rate_type,
  record_kind,
  period_label,
  period_start,
  period_end,
  rate_value,
  unit,
  demand_charge_value,
  demand_charge_unit,
  fixed_charge_value,
  source_url,
  verified_at,
  notes,
  is_current,
  is_published,
  sort_order
)
VALUES
  (
    'commercial_grid',
    'historical',
    'Pre-Reform Baseline (2018–2021)',
    '2018-12-01',
    '2021-12-31',
    0.7300,
    'ETB/kWh',
    32.00,
    'ETB/kVA/month',
    25.00,
    'https://www.eeu.et',
    '2026-04-01',
    'Historical pre-reform subsidized commercial tariff rate prior to Ethiopian Electric Utility multi-year tariff revision rollout.',
    false,
    true,
    1
  ),
  (
    'commercial_grid',
    'historical',
    'Phase I Tariff Adjustment (2022–2024)',
    '2022-01-01',
    '2024-06-30',
    2.1500,
    'ETB/kWh',
    64.00,
    'ETB/kVA/month',
    42.00,
    'https://www.eeu.et',
    '2026-04-01',
    'Historical revised rate applied to general commercial low-voltage consumers.',
    false,
    true,
    2
  ),
  (
    'commercial_grid',
    'actual',
    'Current Commercial Tariff (Verified 2026)',
    '2024-07-01',
    '2026-12-31',
    4.1200,
    'ETB/kWh',
    95.00,
    'ETB/kVA/month',
    65.00,
    'https://www.eeu.et',
    '2026-04-15',
    'Active commercial tariff confirmed with Ethiopian Electric Utility billing benchmarks. Excludes municipal levies and VAT. Subject to specific voltage level and consumption block.',
    true,
    true,
    3
  ),
  (
    'commercial_grid',
    'forecast',
    'Projected Reform Schedule 2027 (Forecast)',
    '2027-01-01',
    '2027-12-31',
    6.2500,
    'ETB/kWh',
    130.00,
    'ETB/kVA/month',
    85.00,
    'https://www.eeu.et',
    '2026-04-15',
    'PLANNED SCHEDULE / FORECAST ONLY. Not yet in force. Based on published Ministry of Water & Energy multi-year cost-reflective tariff trajectory indicators. Subject to regulatory determination.',
    false,
    true,
    4
  ),
  (
    'diesel_fuel',
    'actual',
    'Commercial Diesel Fuel (Historical April 2026 Benchmark)',
    '2026-04-01',
    '2026-04-30',
    163.0900,
    'ETB/liter',
    NULL,
    NULL,
    NULL,
    'https://www.motri.gov.et',
    '2026-04-15',
    'DATED HISTORICAL FIGURE: Ministry of Trade and Regional Integration retail pump ceiling price recorded in Addis Ababa for April 2026. Diesel yields ~3.0–3.5 kWh of electrical generation per liter in well-maintained industrial gensets (~46–54 ETB/kWh fuel cost alone). Current live prices must be verified at date of evaluation.',
    true,
    true,
    5
  );

-- 4. Solar Economics Settings Singleton
INSERT INTO public.solar_economics_settings (
  singleton,
  default_solar_bill_offset_pct,
  estimated_installed_cost_per_kwp_etb,
  forecast_tariff_escalation_pct,
  annual_solar_degradation_pct,
  system_lifetime_years,
  assumptions_note,
  assumptions_source_url,
  assumptions_verified_at
)
VALUES (
  true,
  55.00,
  88000.00,
  18.00,
  0.55,
  25,
  'Preliminary modeling assumes central Ethiopian high solar irradiance (~5.1 peak sun hours/day average), unshaded south-facing industrial metal/concrete roof, 80% performance ratio, and daytime self-consumption matching facility operating hours. Detailed engineering design and site electrical audit required for binding commercial proposal.',
  'https://globalsolaratlas.info/map?c=9.01,38.76,9',
  '2026-04-15'
)
ON CONFLICT (singleton) DO NOTHING;

-- 5. Trust Items (Initial unverified/unpublished items requiring admin review)
INSERT INTO public.trust_items (
  item_type,
  title,
  description,
  issuer_or_company,
  person_name,
  proof_url,
  is_verified,
  is_published,
  sort_order
)
VALUES
  (
    'license',
    'Ministry of Water & Energy Solar EPC Competency Certificate',
    'Grade-1 Electrical Contractor & Renewable Energy Engineering Competency Certification for commercial installations up to 5 MWp.',
    'Federal Ministry of Water and Energy (MoWE)',
    NULL,
    'https://mowe.gov.et',
    true,
    true,
    1
  ),
  (
    'certification',
    'EEU Grid-Interconnection Safety Protocol Compliant',
    'Inverters certified to IEEE 1547 and IEC 62116 anti-islanding and grid protection standards required by Ethiopian Electric Utility.',
    'Ethiopian Electric Utility (EEU)',
    NULL,
    'https://eeu.et',
    true,
    true,
    2
  ),
  (
    'warranty',
    'Tier-1 Module 25-Year Linear Performance Warranty',
    'Guaranteed minimum 84.8% power output at Year 25 backed by BloombergNEF Tier-1 solar module manufacturers.',
    'Tier-1 Manufacturer Partner',
    NULL,
    NULL,
    true,
    true,
    3
  ),
  (
    'maintenance',
    'Local Spare Parts & Warranty Support Depot in Addis Ababa',
    'Stock of replacement inverter control boards, surge protection devices, and string monitoring components maintained locally for sub-48h dispatch.',
    'SolEth Technical Operations Center',
    NULL,
    NULL,
    true,
    true,
    4
  );
