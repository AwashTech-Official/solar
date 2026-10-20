'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Calculator,
  Calendar,
  ExternalLink,
  ShieldAlert,
  Zap,
  BatteryCharging,
  Flame,
  CheckCircle2,
  Clock,
  Send,
  AlertCircle,
  TrendingUp,
  FileSpreadsheet,
  ChevronDown,
  ChevronUp,
  ArrowDown
} from 'lucide-react';
import {
  createLead,
  fetchEnergyRates,
  fetchSolarEconomicsSettings,
  fetchCompanySettings,
  EnergyRateHistory,
  SolarEconomicsSettings,
  CompanySettings,
  SolutionInterest
} from '@/src/lib/supabase';
import { useLanguage } from '@/src/context/LanguageContext';

interface RequestAssessmentSectionProps {
  initialSolutionInterest?: SolutionInterest;
}

export const RequestAssessmentSection: React.FC<RequestAssessmentSectionProps> = ({
  initialSolutionInterest = 'not_sure',
}) => {
  const { t, language } = useLanguage();

  // Economics & Tariff settings from database
  const [rates, setRates] = useState<EnergyRateHistory[]>([]);
  const [economics, setEconomics] = useState<SolarEconomicsSettings | null>(null);
  const [companySettings, setCompanySettings] = useState<CompanySettings | null>(null);

  // Form State
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [siteLocation, setSiteLocation] = useState('');
  const [industry, setIndustry] = useState('Manufacturing / Factory');
  const [solutionInterest, setSolutionInterest] = useState<SolutionInterest>(initialSolutionInterest);
  const [message, setMessage] = useState('');

  // Interactive Calculator Inputs (ETB & Usage)
  const [monthlyBillInput, setMonthlyBillInput] = useState<number>(350000);
  const [monthlyKwhInput, setMonthlyKwhInput] = useState<string>('');
  const [monthlyDieselLitersInput, setMonthlyDieselLitersInput] = useState<string>('');
  const [dieselPriceInput, setDieselPriceInput] = useState<number>(163.09);
  const [solarOffsetPct, setSolarOffsetPct] = useState<number>(55);
  const [showAdvancedInputs, setShowAdvancedInputs] = useState<boolean>(false);
  const [copiedInputsFeedback, setCopiedInputsFeedback] = useState<boolean>(false);

  // Tariff display filter (commercial vs industrial)
  const [tariffTab, setTariffTab] = useState<'commercial' | 'industrial'>('commercial');

  // Honeypot & Anti-Bot Safeguards
  const [honeypot, setHoneypot] = useState('');
  const renderTimeRef = useRef<number>(0);
  const formRef = useRef<HTMLDivElement>(null);

  // Form Submission Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Load energy rates and economics settings
  useEffect(() => {
    renderTimeRef.current = Date.now();
    let isMounted = true;
    async function loadData() {
      try {
        const [ratesData, econData, settingsData] = await Promise.all([
          fetchEnergyRates(),
          fetchSolarEconomicsSettings(),
          fetchCompanySettings(),
        ]);
        if (isMounted) {
          setRates(ratesData);
          setEconomics(econData);
          setCompanySettings(settingsData);
          if (econData?.default_solar_bill_offset_pct) {
            setSolarOffsetPct(Number(econData.default_solar_bill_offset_pct));
          }
        }
      } catch (err) {
        console.warn('Error loading assessment settings:', err);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filtered tariff rates
  const filteredRates = useMemo(() => {
    return rates.filter((r) => {
      if (tariffTab === 'commercial') {
        return r.rate_type === 'commercial_grid' || r.rate_type === 'diesel_fuel';
      }
      return r.rate_type === 'industrial_low_voltage' || r.rate_type === 'industrial_high_voltage' || r.rate_type === 'diesel_fuel';
    });
  }, [rates, tariffTab]);

  // Current verified rate records
  const currentGridRate = useMemo(() => {
    if (tariffTab === 'commercial') {
      return rates.find((r) => r.rate_type === 'commercial_grid' && r.is_current && r.record_kind === 'actual')
        || rates.find((r) => r.rate_type === 'commercial_grid' && r.is_current);
    }
    return rates.find((r) => (r.rate_type === 'industrial_low_voltage' || r.rate_type === 'industrial_high_voltage') && r.is_current && r.record_kind === 'actual')
      || rates.find((r) => r.rate_type === 'commercial_grid' && r.is_current);
  }, [rates, tariffTab]);

  const currentDieselRate = useMemo(() => {
    return rates.find((r) => r.rate_type === 'diesel_fuel' && r.is_current);
  }, [rates]);

  // Live Calculations (Defensible, strictly ethical)
  const calculations = useMemo(() => {
    const monthlyBill = Math.max(0, Number(monthlyBillInput) || 0);
    const offsetFraction = (Number(solarOffsetPct) || 55) / 100;

    // Monthly & Annual Utility bill offset
    const estimatedMonthlyBillOffset = monthlyBill * offsetFraction;
    const estimatedAnnualBillOffset = estimatedMonthlyBillOffset * 12;

    // Diesel generator fuel savings (e.g. 35% fuel displacement)
    const dieselLiters = Number(monthlyDieselLitersInput) || 0;
    const dieselFuelPrice = dieselPriceInput || currentDieselRate?.rate_value || 163.09;
    const estimatedMonthlyDieselSavings = dieselLiters > 0
      ? dieselLiters * dieselFuelPrice * 0.35
      : 0;
    const estimatedAnnualDieselSavings = estimatedMonthlyDieselSavings * 12;

    const totalEstimatedAnnualSavings = estimatedAnnualBillOffset + estimatedAnnualDieselSavings;

    // Payback calculation: Only if verified installed cost exists in settings and valid bill
    let paybackYearsText: string = language === 'am'
      ? 'የወጪ መመለሻ ጊዜ ትክክለኛ የጣሪያ ዲዛይንና የዋጋ ዝርዝር ይፈልጋል።'
      : 'Payback estimate needs a verified project price and site-specific design.';
    let estimatedSystemKwp: number | null = null;

    if (
      economics?.estimated_installed_cost_per_kwp_etb &&
      economics.estimated_installed_cost_per_kwp_etb > 0 &&
      monthlyBill > 0 &&
      currentGridRate?.rate_value
    ) {
      const tariff = currentGridRate.rate_value;
      const targetMonthlyKwhOffset = (monthlyBill / tariff) * offsetFraction;
      const dailyKwh = targetMonthlyKwhOffset / 30;
      const approxKwp = dailyKwh / 5.2; // 5.2 peak sun hours/day central Ethiopia

      if (approxKwp > 5) {
        estimatedSystemKwp = Math.round(approxKwp);
        const estimatedCapexEtb = approxKwp * economics.estimated_installed_cost_per_kwp_etb;
        const payback = estimatedCapexEtb / totalEstimatedAnnualSavings;
        if (payback > 1 && payback < 15) {
          paybackYearsText = language === 'am'
            ? `ቅድመ-ግምት፡ ~${payback.toFixed(1)} ዓመታት (በጣሪያው ጥናትና በውል አቅርቦት ላይ ተመስርቶ)`
            : `Preliminary Benchmark: ~${payback.toFixed(1)} years (subject to binding EPC quotation & roof survey)`;
        }
      }
    }

    return {
      monthlyBill,
      offsetFraction,
      estimatedMonthlyBillOffset,
      estimatedAnnualBillOffset,
      estimatedMonthlyDieselSavings,
      estimatedAnnualDieselSavings,
      totalEstimatedAnnualSavings,
      paybackYearsText,
      estimatedSystemKwp,
    };
  }, [monthlyBillInput, monthlyDieselLitersInput, dieselPriceInput, solarOffsetPct, economics, currentGridRate, currentDieselRate, language]);

  // Copy calculator inputs into form and scroll to form
  const handleUseInputsInForm = () => {
    setCopiedInputsFeedback(true);
    setTimeout(() => setCopiedInputsFeedback(false), 4000);
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Form Submission Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // 1. Honeypot check
    if (honeypot.trim().length > 0) {
      console.warn('Bot submission suppressed via honeypot');
      setSubmitSuccess(true);
      return;
    }

    // 2. Minimum submission duration (2000 ms)
    const elapsedMs = Date.now() - renderTimeRef.current;
    if (elapsedMs < 2000) {
      setSubmitError(t.form.errorRequired);
      return;
    }

    // 3. Validation
    if (!fullName.trim() || !phone.trim() || !companyName.trim() || !siteLocation.trim()) {
      setSubmitError(t.form.errorRequired);
      return;
    }
    if (!monthlyBillInput || monthlyBillInput <= 0) {
      setSubmitError(t.form.errorRequired);
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await createLead({
        full_name: fullName.trim(),
        company_name: companyName.trim(),
        email: email.trim() || null,
        phone: phone.trim(),
        business_type: industry,
        industry: industry,
        site_location: siteLocation.trim(),
        monthly_electricity_bill_etb: Number(monthlyBillInput),
        monthly_electricity_kwh: monthlyKwhInput ? Number(monthlyKwhInput) : null,
        monthly_diesel_liters: monthlyDieselLitersInput ? Number(monthlyDieselLitersInput) : null,
        solution_interest: solutionInterest,
        message: message.trim() || null,
        source: 'website',
        estimated_annual_savings_etb: Math.round(calculations.totalEstimatedAnnualSavings),
        roi_inputs: {
          monthlyBillEtb: Number(monthlyBillInput),
          monthlyKwh: monthlyKwhInput ? Number(monthlyKwhInput) : null,
          monthlyDieselLiters: monthlyDieselLitersInput ? Number(monthlyDieselLitersInput) : null,
          offsetPct: solarOffsetPct,
          estimatedMonthlyOffsetEtb: Math.round(calculations.estimatedMonthlyBillOffset),
          estimatedAnnualOffsetEtb: Math.round(calculations.estimatedAnnualBillOffset),
          calculatedAt: new Date().toISOString(),
        },
      });

      if (!res.success) {
        setSubmitError(res.error || 'Failed to submit assessment request. Please check connection.');
      } else {
        setSubmitSuccess(true);
      }
    } catch (err: any) {
      setSubmitError(err?.message || 'Unexpected network error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="assessment" className="py-20 bg-[#101820] text-[#F3F4F1] border-b border-[rgba(243,244,241,0.08)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div id="calculator" className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#18232B] border border-[rgba(242,181,68,0.3)] text-[#F2B544] text-[11px] font-mono font-bold uppercase tracking-wider mb-3">
            <Calculator className="w-3.5 h-3.5" />
            <span>{t.calculator.badge}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-[#F3F4F1] tracking-tight leading-tight">
            {t.calculator.headline}
          </h2>

          <p className="mt-4 text-base sm:text-lg text-[#889AA7] leading-relaxed">
            {t.calculator.subtext}
          </p>
        </div>

        {/* 2-Column Split: Calculator & Tariff on Left (7 cols), Lead Form on Right (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* LEFT: Live Interactive Calculator + Tariff Trajectory (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Interactive Calculator Card */}
            <div className="p-6 sm:p-8 rounded-lg bg-[#18232B] border border-[rgba(243,244,241,0.12)] shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-[rgba(243,244,241,0.08)] mb-6">
                <div>
                  <h3 className="text-lg font-bold font-heading text-[#F3F4F1] flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#F2B544]" />
                    <span>{t.calculator.summaryHeadline}</span>
                  </h3>
                  <p className="text-xs text-[#889AA7] mt-0.5">
                    {t.calculator.subtext}
                  </p>
                </div>
              </div>

              {/* Input Fields */}
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold text-[#F3F4F1] uppercase tracking-wider font-mono">
                      {t.calculator.billLabel}
                    </label>
                    <span className="text-xs font-mono font-bold text-[#F2B544]">
                      {monthlyBillInput > 0 ? `${Number(monthlyBillInput).toLocaleString('en-US')} ETB / mo` : '0 ETB'}
                    </span>
                  </div>
                  <input
                    type="number"
                    min="10000"
                    step="10000"
                    value={monthlyBillInput || ''}
                    onChange={(e) => setMonthlyBillInput(Number(e.target.value) || 0)}
                    placeholder={t.calculator.billPlaceholder}
                    className="w-full px-4 py-3 rounded-md bg-[#101820] border border-[rgba(243,244,241,0.15)] text-[#F3F4F1] text-sm font-mono focus:outline-none focus:ring-1 focus:ring-[#F2B544]"
                  />
                  
                  {/* Preset quick buttons */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {[100000, 250000, 500000, 1000000].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setMonthlyBillInput(preset)}
                        className="px-2.5 py-1 rounded bg-[#101820] border border-[rgba(243,244,241,0.08)] text-[11px] font-mono text-[#889AA7] hover:text-[#F3F4F1] hover:border-[#F2B544]/50 cursor-pointer transition-colors"
                      >
                        {(preset / 1000).toLocaleString('en-US')}k ETB
                      </button>
                    ))}
                  </div>
                </div>

                {/* Target Solar Offset Slider */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold text-[#F3F4F1] uppercase tracking-wider font-mono">
                      {t.calculator.offsetSliderLabel}
                    </label>
                    <span className="text-xs font-mono font-bold text-[#F2B544]">
                      {solarOffsetPct}% (Assumed Scenario)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="80"
                    step="5"
                    value={solarOffsetPct}
                    onChange={(e) => setSolarOffsetPct(Number(e.target.value))}
                    className="w-full accent-[#F2B544] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#889AA7] mt-1 font-mono">
                    <span>20% (Conservative)</span>
                    <span>55% (Standard Daytime Factory)</span>
                    <span>80% (High Hybrid BESS)</span>
                  </div>
                </div>

                {/* Advanced Inputs Disclosure Toggle */}
                <div>
                  <button
                    type="button"
                    onClick={() => setShowAdvancedInputs(!showAdvancedInputs)}
                    className="inline-flex items-center gap-2 text-xs font-bold text-[#F2B544] hover:underline cursor-pointer"
                  >
                    <span>{t.calculator.advancedToggle}</span>
                    {showAdvancedInputs ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {showAdvancedInputs && (
                    <div className="mt-3 p-4 rounded-md bg-[#101820] border border-[rgba(243,244,241,0.08)] space-y-3.5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-mono font-semibold text-[#889AA7] mb-1">
                            {t.calculator.kwhLabel}
                          </label>
                          <input
                            type="number"
                            value={monthlyKwhInput}
                            onChange={(e) => setMonthlyKwhInput(e.target.value)}
                            placeholder="e.g. 75000"
                            className="w-full px-3 py-2 rounded bg-[#18232B] border border-[rgba(243,244,241,0.12)] text-[#F3F4F1] text-xs font-mono focus:outline-none focus:ring-1 focus:ring-[#F2B544]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono font-semibold text-[#889AA7] mb-1">
                            {t.calculator.dieselLitersLabel}
                          </label>
                          <input
                            type="number"
                            value={monthlyDieselLitersInput}
                            onChange={(e) => setMonthlyDieselLitersInput(e.target.value)}
                            placeholder="e.g. 2000"
                            className="w-full px-3 py-2 rounded bg-[#18232B] border border-[rgba(243,244,241,0.12)] text-[#F3F4F1] text-xs font-mono focus:outline-none focus:ring-1 focus:ring-[#F2B544]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono font-semibold text-[#889AA7] mb-1">
                          {t.calculator.dieselPriceLabel}
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={dieselPriceInput}
                          onChange={(e) => setDieselPriceInput(Number(e.target.value) || 163.09)}
                          className="w-full px-3 py-2 rounded bg-[#18232B] border border-[rgba(243,244,241,0.12)] text-[#F3F4F1] text-xs font-mono focus:outline-none focus:ring-1 focus:ring-[#F2B544]"
                        />
                        <span className="text-[10px] text-[#889AA7] mt-0.5 block">
                          Dated historical benchmark: 163.09 ETB/L (April 2026, Addis Ababa).
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Calculator Output Display */}
              <div className="mt-8 p-5 rounded-md bg-[#101820] border border-[#F2B544]/35 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="text-[10px] font-mono font-bold text-[#889AA7] uppercase tracking-wider">
                      {t.calculator.estimatedMonthlyOffset}
                    </div>
                    <div className="text-2xl font-extrabold font-mono text-[#F2B544] mt-1">
                      {Math.round(calculations.estimatedMonthlyBillOffset).toLocaleString('en-US')} ETB
                    </div>
                    <div className="text-[10px] text-[#889AA7] mt-0.5">
                      {solarOffsetPct}% daytime load displacement
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-mono font-bold text-[#889AA7] uppercase tracking-wider">
                      {t.calculator.estimatedAnnualOffset}
                    </div>
                    <div className="text-2xl font-extrabold font-mono text-[#1F8A83] mt-1">
                      {Math.round(calculations.estimatedAnnualBillOffset).toLocaleString('en-US')} ETB
                    </div>
                    <div className="text-[10px] text-[#889AA7] mt-0.5">
                      Direct utility expense hedge
                    </div>
                  </div>
                </div>

                {calculations.estimatedAnnualDieselSavings > 0 && (
                  <div className="pt-3 border-t border-[rgba(243,244,241,0.08)] flex justify-between items-center text-xs">
                    <span className="text-[#889AA7]">
                      {t.calculator.estimatedDieselOffset} (~35% genset displacement):
                    </span>
                    <span className="font-mono font-bold text-[#F2B544]">
                      +{Math.round(calculations.estimatedAnnualDieselSavings).toLocaleString('en-US')} ETB / yr
                    </span>
                  </div>
                )}

                {/* Sizing & Payback note */}
                <div className="pt-3 border-t border-[rgba(243,244,241,0.08)] flex items-start gap-2 text-xs">
                  <FileSpreadsheet className="w-4 h-4 text-[#F2B544] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#F3F4F1]">{t.calculator.estimatedPayback}: </span>
                    <span className="text-[#889AA7]">{calculations.paybackYearsText}</span>
                  </div>
                </div>

                {/* Carry-over Action Button */}
                <div className="pt-3 border-t border-[rgba(243,244,241,0.08)]">
                  <button
                    type="button"
                    onClick={handleUseInputsInForm}
                    className="w-full py-2.5 px-3 rounded-md bg-[#18232B] hover:bg-[#202f3a] border border-[#F2B544]/50 text-[#F2B544] hover:text-[#F3F4F1] font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{t.calculator.useInputsInFormBtn}</span>
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>

                  {copiedInputsFeedback && (
                    <div className="mt-2 p-2 rounded bg-[#1F8A83]/20 border border-[#1F8A83]/50 text-center text-xs text-[#1F8A83] font-bold">
                      {t.calculator.inputsCopiedSuccess}
                    </div>
                  )}
                </div>

                {/* Transparent Methodology & Disclaimer */}
                <div className="pt-3 border-t border-[rgba(243,244,241,0.08)] text-[10px] text-[#889AA7] leading-relaxed space-y-1">
                  <div>
                    <strong className="text-[#F3F4F1] font-mono">{t.calculator.methodologyNoteTitle}: </strong>
                    {t.calculator.methodologyNote}
                  </div>
                  <div>
                    <strong className="text-[#F2B544] font-mono">DISCLAIMER: </strong>
                    {t.calculator.disclaimer}
                  </div>
                </div>
              </div>
            </div>

            {/* Sourced Tariff History & Trajectory Card */}
            <div className="p-6 sm:p-8 rounded-lg bg-[#18232B] border border-[rgba(243,244,241,0.12)] shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[rgba(243,244,241,0.08)] mb-6 gap-3">
                <div>
                  <h3 className="text-base font-bold font-heading text-[#F3F4F1] flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#F2B544]" />
                    <span>{t.tariff.headline}</span>
                  </h3>
                  <p className="text-xs text-[#889AA7] mt-0.5">
                    {t.tariff.subtext}
                  </p>
                </div>

                {/* Commercial vs Industrial Tab Selector */}
                <div className="flex items-center rounded-md bg-[#101820] border border-[rgba(243,244,241,0.12)] p-0.5 text-xs font-bold shrink-0">
                  <button
                    type="button"
                    onClick={() => setTariffTab('commercial')}
                    className={`px-3 py-1 rounded transition-all cursor-pointer ${
                      tariffTab === 'commercial'
                        ? 'bg-[#F2B544] text-[#101820] font-black shadow-sm'
                        : 'text-[#889AA7] hover:text-[#F3F4F1]'
                    }`}
                  >
                    {t.tariff.commercialTab}
                  </button>
                  <button
                    type="button"
                    onClick={() => setTariffTab('industrial')}
                    className={`px-3 py-1 rounded transition-all cursor-pointer ${
                      tariffTab === 'industrial'
                        ? 'bg-[#F2B544] text-[#101820] font-black shadow-sm'
                        : 'text-[#889AA7] hover:text-[#F3F4F1]'
                    }`}
                  >
                    {t.tariff.industrialTab}
                  </button>
                </div>
              </div>

              {/* Legend with Color & Border Distinction */}
              <div className="flex flex-wrap items-center gap-4 text-[10px] font-mono uppercase mb-4 text-[#889AA7]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-[#889AA7]/40 border border-[#889AA7]" />
                  <span>{t.tariff.legendHistorical}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-[#1F8A83]/30 border border-[#1F8A83]" />
                  <span>{t.tariff.legendCurrent}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-[#F2B544]/20 border border-dashed border-[#F2B544]" />
                  <span>{t.tariff.legendForecast}</span>
                </div>
              </div>

              {/* Timeline Items */}
              <div className="space-y-3.5">
                {filteredRates.map((rate) => {
                  const isHistorical = rate.record_kind === 'historical';
                  const isActual = rate.record_kind === 'actual';
                  const isForecast = rate.record_kind === 'forecast';

                  return (
                    <div
                      key={rate.id}
                      className={`p-4 rounded-md transition-all ${
                        isForecast
                          ? 'border-2 border-dashed border-[#F2B544]/50 bg-[#101820]/70'
                          : isActual
                          ? 'border border-[#1F8A83]/70 bg-[#101820]'
                          : 'border border-[rgba(243,244,241,0.08)] bg-[#101820]/50 opacity-85'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider ${
                              isForecast
                                ? 'bg-[#F2B544]/20 text-[#F2B544]'
                                : isActual
                                ? 'bg-[#1F8A83]/20 text-[#1F8A83]'
                                : 'bg-[#889AA7]/20 text-[#cbd5e1]'
                            }`}
                          >
                            {isForecast ? 'Forecast Schedule' : isActual ? 'Verified Active Rate' : 'Historical Record'}
                          </span>
                          <span className="text-xs font-bold text-[#F3F4F1]">
                            {rate.period_label}
                          </span>
                        </div>

                        <div className="text-sm font-mono font-bold text-[#F3F4F1]">
                          {Number(rate.rate_value).toFixed(2)} {rate.unit}
                        </div>
                      </div>

                      <p className="text-xs text-[#889AA7] mt-2 leading-relaxed">
                        {rate.notes}
                      </p>

                      <div className="mt-3 pt-2 border-t border-[rgba(243,244,241,0.06)] flex flex-wrap items-center justify-between gap-2 text-[10px] text-[#889AA7] font-mono">
                        <div className="flex items-center gap-2">
                          {rate.verified_at && (
                            <span>{t.tariff.verifiedOnPrefix} {rate.verified_at}</span>
                          )}
                          {rate.demand_charge_value && (
                            <span>• kVA Demand: {rate.demand_charge_value} {rate.demand_charge_unit}</span>
                          )}
                        </div>

                        {rate.source_url && (
                          <a
                            href={rate.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[#F2B544] hover:underline"
                          >
                            <span>{t.tariff.sourcePrefix} Gazette</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Forecast Warning */}
                <div className="p-3 rounded bg-[#101820]/60 border border-[rgba(243,244,241,0.08)] text-[11px] text-[#889AA7] leading-relaxed">
                  <span className="font-bold text-[#F2B544] font-mono mr-1">WARNING:</span>
                  {t.tariff.forecastWarning}
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT: B2B Lead Capture Form (5 cols) */}
          <div ref={formRef} className="lg:col-span-5">
            <div className="p-6 sm:p-8 rounded-lg bg-[#18232B] border border-[rgba(243,244,241,0.15)] shadow-md sticky top-20">
              
              <div className="mb-6">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#F2B544]/15 border border-[#F2B544]/30 text-[#F2B544] text-[10px] font-mono font-bold uppercase tracking-wider mb-2">
                  <Clock className="w-3.5 h-3.5" />
                  <span>
                    {companySettings?.response_time_hours
                      ? `${t.form.responseTimeNotice} (${companySettings.response_time_hours}h)`
                      : t.form.responseTimeNotice}
                  </span>
                </div>
                <h3 className="text-xl font-extrabold font-heading text-[#F3F4F1]">
                  {t.form.headline}
                </h3>
                <p className="text-xs text-[#889AA7] mt-1 leading-relaxed">
                  {t.form.subtext}
                </p>
              </div>

              {submitSuccess ? (
                <div className="p-6 rounded-md bg-[#101820] border border-[#1F8A83]/50 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-[#1F8A83]/20 text-[#1F8A83] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-[#F3F4F1]">{t.form.successTitle}</h4>
                  <p className="text-xs text-[#889AA7] leading-relaxed">
                    {t.form.successMessage} (<strong>{companyName}</strong>, <strong>{siteLocation}</strong>)
                  </p>
                  <p className="text-xs text-[#F3F4F1] font-mono bg-[#18232B] p-3 rounded border border-[rgba(243,244,241,0.08)]">
                    {companySettings?.response_time_hours
                      ? `We will review your load metrics and contact you at ${phone} within ${companySettings.response_time_hours} business hours.`
                      : `Our engineering desk will contact ${phone} to arrange single-line diagram review.`}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitSuccess(false);
                      setMessage('');
                    }}
                    className="mt-4 px-4 py-2 rounded-md bg-[#18232B] border border-[rgba(243,244,241,0.15)] text-xs font-semibold text-[#F3F4F1] hover:bg-[#202f3a] cursor-pointer"
                  >
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Honeypot field (hidden from human visitors) */}
                  <div className="hidden" aria-hidden="true">
                    <label htmlFor="website_url_check">Leave empty</label>
                    <input
                      id="website_url_check"
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

                  {/* Contact Name & Phone */}
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
                        placeholder="Ato / W/ro Full Name"
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

                  {/* Company Name & Email */}
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
                        placeholder="e.g. Habesha Flour Mills PLC"
                        className="w-full px-3 py-2 rounded-md bg-[#101820] border border-[rgba(243,244,241,0.15)] text-xs text-[#F3F4F1] focus:outline-none focus:ring-1 focus:ring-[#F2B544]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#F3F4F1] mb-1">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="engineering@facility.com"
                        className="w-full px-3 py-2 rounded-md bg-[#101820] border border-[rgba(243,244,241,0.15)] text-xs text-[#F3F4F1] focus:outline-none focus:ring-1 focus:ring-[#F2B544]"
                      />
                    </div>
                  </div>

                  {/* Site Location & Industry Sector */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#F3F4F1] mb-1">
                        {t.form.location}
                      </label>
                      <input
                        type="text"
                        required
                        value={siteLocation}
                        onChange={(e) => setSiteLocation(e.target.value)}
                        placeholder="e.g. Dukem Industrial Zone / Addis Ababa"
                        className="w-full px-3 py-2 rounded-md bg-[#101820] border border-[rgba(243,244,241,0.15)] text-xs text-[#F3F4F1] focus:outline-none focus:ring-1 focus:ring-[#F2B544]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#F3F4F1] mb-1">
                        {t.form.industry}
                      </label>
                      <select
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        className="w-full px-3 py-2 rounded-md bg-[#101820] border border-[rgba(243,244,241,0.15)] text-xs text-[#F3F4F1] focus:outline-none focus:ring-1 focus:ring-[#F2B544]"
                      >
                        <option value="Manufacturing / Factory">Manufacturing / Factory</option>
                        <option value="Cold Storage & Logistics">Cold Storage & Logistics</option>
                        <option value="Commercial Building / Hotel">Commercial Building / Hotel</option>
                        <option value="Agro-Processing & Farming">Agro-Processing & Farming</option>
                        <option value="Hospital & Healthcare">Hospital & Healthcare</option>
                        <option value="Educational Campus">Educational Campus</option>
                        <option value="Other High-Energy Facility">Other High-Energy Facility</option>
                      </select>
                    </div>
                  </div>

                  {/* System Architecture Interest */}
                  <div>
                    <label className="block text-xs font-bold text-[#F3F4F1] mb-1">
                      {t.form.interest}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'grid_tied', label: t.form.solarOnly, icon: Zap },
                        { id: 'solar_battery', label: t.form.solarBess, icon: BatteryCharging },
                        { id: 'solar_generator_hybrid', label: t.form.solarHybrid, icon: Flame },
                        { id: 'not_sure', label: t.form.notSure, icon: Calculator },
                      ].map((item) => {
                        const Icon = item.icon;
                        const isSelected = solutionInterest === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setSolutionInterest(item.id as SolutionInterest)}
                            className={`p-2 rounded-md text-left border flex items-center gap-2 cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-[#F2B544]/15 border-[#F2B544] text-[#F3F4F1]'
                                : 'bg-[#101820] border-[rgba(243,244,241,0.1)] text-[#889AA7] hover:text-[#F3F4F1]'
                            }`}
                          >
                            <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-[#F2B544]' : 'text-[#889AA7]'}`} />
                            <span className="text-[10px] font-semibold leading-tight line-clamp-1">{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Monthly Bill synced from calculator */}
                  <div>
                    <label className="block text-xs font-bold text-[#F3F4F1] mb-1">
                      {t.form.monthlyBill}
                    </label>
                    <input
                      type="number"
                      required
                      value={monthlyBillInput || ''}
                      onChange={(e) => setMonthlyBillInput(Number(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-md bg-[#101820] border border-[rgba(243,244,241,0.15)] text-xs font-mono text-[#F3F4F1] focus:outline-none focus:ring-1 focus:ring-[#F2B544]"
                    />
                  </div>

                  {/* Optional Message */}
                  <div>
                    <label className="block text-xs font-bold text-[#F3F4F1] mb-1">
                      {t.form.message}
                    </label>
                    <textarea
                      rows={2}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="e.g. 400 kVA transformer, 3-phase grid connection, trapezoidal steel roof..."
                      className="w-full px-3 py-2 rounded-md bg-[#101820] border border-[rgba(243,244,241,0.15)] text-xs text-[#F3F4F1] focus:outline-none focus:ring-1 focus:ring-[#F2B544]"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 rounded-md bg-[#F2B544] hover:bg-[#d99f32] text-[#101820] font-black text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-[#101820] border-t-transparent rounded-full animate-spin" />
                        <span>{t.form.submitting}</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>{t.form.submitBtn}</span>
                      </>
                    )}
                  </button>

                  <p className="text-[10px] text-[#889AA7] text-center leading-tight">
                    {t.form.privacyNote}
                  </p>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
