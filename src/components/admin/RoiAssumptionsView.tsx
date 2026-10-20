'use client';

import React, { useState, useEffect } from 'react';
import {
  Calculator,
  Save,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import {
  SolarEconomicsSettings,
  updateSolarEconomicsSettingsAdmin,
  fetchSolarEconomicsSettings
} from '@/src/lib/supabase';

interface RoiAssumptionsViewProps {
  initialSettings: SolarEconomicsSettings | null;
  onRefresh: () => void;
}

export const RoiAssumptionsView: React.FC<RoiAssumptionsViewProps> = ({
  initialSettings,
  onRefresh,
}) => {
  const [settings, setSettings] = useState<SolarEconomicsSettings | null>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);


  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError(null);

    try {
      const res = await updateSolarEconomicsSettingsAdmin({
        default_solar_bill_offset_pct: Number(settings.default_solar_bill_offset_pct) || 55,
        estimated_installed_cost_per_kwp_etb: settings.estimated_installed_cost_per_kwp_etb
          ? Number(settings.estimated_installed_cost_per_kwp_etb)
          : null,
        forecast_tariff_escalation_pct: settings.forecast_tariff_escalation_pct
          ? Number(settings.forecast_tariff_escalation_pct)
          : null,
        annual_solar_degradation_pct: settings.annual_solar_degradation_pct
          ? Number(settings.annual_solar_degradation_pct)
          : null,
        system_lifetime_years: settings.system_lifetime_years
          ? Number(settings.system_lifetime_years)
          : null,
        assumptions_note: settings.assumptions_note || null,
        assumptions_source_url: settings.assumptions_source_url || null,
        assumptions_verified_at: settings.assumptions_verified_at || null,
      });

      if (!res.success) throw new Error(res.error || 'Failed to update economics assumptions');
      setSaveSuccess(true);
      onRefresh();
    } catch (err: any) {
      setSaveError(err.message || 'Save failed');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-4xl mx-auto text-[#f8fafc]">
      <div>
        <h2 className="text-xl font-bold font-heading text-white">Solar Economics & Modeling Assumptions</h2>
        <p className="text-xs text-[#94a3b8] mt-0.5">
          Configures public live calculator baseline assumptions. Null values mean unconfigured—no invented assumptions will be substituted.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-500/50 flex items-center gap-3 text-xs text-emerald-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Economics settings updated and synchronized with live public calculator.</span>
        </div>
      )}

      {saveError && (
        <div className="p-4 rounded-xl bg-red-950/60 border border-red-500/50 flex items-center gap-3 text-xs text-red-200">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{saveError}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="p-6 sm:p-8 rounded-2xl bg-[#162238] border border-[rgba(241,245,249,0.1)] shadow-xl space-y-6">
        
        {/* Core Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-[#cbd5e1] mb-1.5">
              Default Solar Bill Offset (%)
            </label>
            <input
              type="number"
              min="10"
              max="90"
              required
              value={settings?.default_solar_bill_offset_pct || ''}
              onChange={(e) => setSettings(prev => prev ? { ...prev, default_solar_bill_offset_pct: Number(e.target.value) } : null)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e1626] border border-[rgba(241,245,249,0.15)] text-sm font-mono text-white focus:outline-none focus:ring-2 focus:ring-[#f59e0b]"
            />
            <p className="text-[11px] text-[#94a3b8] mt-1">Default percentage pre-selected on user slider.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#cbd5e1] mb-1.5">
              Estimated Installed EPC Cost (ETB / kWp)
            </label>
            <input
              type="number"
              step="1000"
              value={settings?.estimated_installed_cost_per_kwp_etb || ''}
              onChange={(e) => setSettings(prev => prev ? { ...prev, estimated_installed_cost_per_kwp_etb: Number(e.target.value) || null } : null)}
              placeholder="Leave empty if unconfigured"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e1626] border border-[rgba(241,245,249,0.15)] text-sm font-mono text-white focus:outline-none focus:ring-2 focus:ring-[#f59e0b]"
            />
            <p className="text-[11px] text-[#94a3b8] mt-1">Required for preliminary payback estimates. If null, payback shows unconfigured.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-semibold text-[#cbd5e1] mb-1.5">
              Tariff Escalation Assumption (% / yr)
            </label>
            <input
              type="number"
              step="0.5"
              value={settings?.forecast_tariff_escalation_pct || ''}
              onChange={(e) => setSettings(prev => prev ? { ...prev, forecast_tariff_escalation_pct: Number(e.target.value) || null } : null)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e1626] border border-[rgba(241,245,249,0.15)] text-sm font-mono text-white focus:outline-none focus:ring-2 focus:ring-[#f59e0b]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#cbd5e1] mb-1.5">
              Annual PV Degradation (% / yr)
            </label>
            <input
              type="number"
              step="0.05"
              value={settings?.annual_solar_degradation_pct || ''}
              onChange={(e) => setSettings(prev => prev ? { ...prev, annual_solar_degradation_pct: Number(e.target.value) || null } : null)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e1626] border border-[rgba(241,245,249,0.15)] text-sm font-mono text-white focus:outline-none focus:ring-2 focus:ring-[#f59e0b]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#cbd5e1] mb-1.5">
              System Design Lifetime (Years)
            </label>
            <input
              type="number"
              value={settings?.system_lifetime_years || ''}
              onChange={(e) => setSettings(prev => prev ? { ...prev, system_lifetime_years: Number(e.target.value) || null } : null)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e1626] border border-[rgba(241,245,249,0.15)] text-sm font-mono text-white focus:outline-none focus:ring-2 focus:ring-[#f59e0b]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-[#cbd5e1] mb-1.5">
              Source URL for Assumptions
            </label>
            <input
              type="url"
              value={settings?.assumptions_source_url || ''}
              onChange={(e) => setSettings(prev => prev ? { ...prev, assumptions_source_url: e.target.value } : null)}
              placeholder="https://globalsolaratlas.info"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e1626] border border-[rgba(241,245,249,0.15)] text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#f59e0b]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#cbd5e1] mb-1.5">
              Assumptions Verification Date
            </label>
            <input
              type="date"
              value={settings?.assumptions_verified_at || ''}
              onChange={(e) => setSettings(prev => prev ? { ...prev, assumptions_verified_at: e.target.value } : null)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e1626] border border-[rgba(241,245,249,0.15)] text-xs font-mono text-white focus:outline-none focus:ring-2 focus:ring-[#f59e0b]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#cbd5e1] mb-1.5">
            Public Assumptions Note & Disclaimer
          </label>
          <textarea
            rows={3}
            value={settings?.assumptions_note || ''}
            onChange={(e) => setSettings(prev => prev ? { ...prev, assumptions_note: e.target.value } : null)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e1626] border border-[rgba(241,245,249,0.15)] text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#f59e0b]"
          />
        </div>

        <div className="flex justify-end pt-4 border-t border-[rgba(241,245,249,0.08)]">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#f59e0b] hover:bg-[#d97706] text-[#0e1626] text-xs font-bold uppercase transition-all shadow-md disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Economics Assumptions'}</span>
          </button>
        </div>

      </form>
    </div>
  );
};
