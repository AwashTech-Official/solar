'use client';

import React, { useState, useEffect } from 'react';
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Building,
  Mail,
  Phone,
  MessageSquare,
  MapPin,
  SendHorizontal,
  Clock,
  ShieldCheck,
  Wrench,
  CreditCard,
  Banknote
} from 'lucide-react';
import {
  CompanySettings,
  updateCompanySettingsAdmin
} from '@/src/lib/supabase';

interface SettingsViewProps {
  companySettings: CompanySettings | null;
  isLoading: boolean;
  error?: string | null;
  onRefresh: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  companySettings,
  isLoading,
  error,
  onRefresh,
}) => {
  const [formData, setFormData] = useState<Partial<CompanySettings>>(() => ({
    company_name: companySettings?.company_name || '',
    tagline: companySettings?.tagline || '',
    contact_email: companySettings?.contact_email || '',
    contact_phone: companySettings?.contact_phone || '',
    whatsapp: companySettings?.whatsapp || '',
    telegram_url: companySettings?.telegram_url || '',
    address: companySettings?.address || '',
    site_url: companySettings?.site_url || '',
    response_time_hours: companySettings?.response_time_hours ?? 24,
    service_areas: companySettings?.service_areas || [],
    warranty_summary: companySettings?.warranty_summary || '',
    maintenance_summary: companySettings?.maintenance_summary || '',
    payment_options: companySettings?.payment_options || '',
    financing_notes: companySettings?.financing_notes || '',
  }));

  const [serviceAreasRaw, setServiceAreasRaw] = useState<string>(
    () => (companySettings?.service_areas || []).join(', ')
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError(null);

    const areasArray = serviceAreasRaw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      const res = await updateCompanySettingsAdmin({
        ...formData,
        service_areas: areasArray,
        response_time_hours: formData.response_time_hours ? Number(formData.response_time_hours) : null,
      });

      if (!res.success) throw new Error(res.error || 'Failed to save settings');
      setSaveSuccess(true);
      onRefresh();
    } catch (err: any) {
      setSaveError(err.message || 'Error updating settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-4xl mx-auto text-[#f8fafc]">
      <div>
        <h2 className="text-xl font-bold font-heading text-white">Company Operations & Contact Settings</h2>
        <p className="text-xs text-[#94a3b8] mt-0.5">
          Manage public contact channels, Telegram bot, response commitment, service corridors, and warranty terms.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-500/50 flex items-center gap-3 text-xs text-emerald-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Company settings saved and active across public portal.</span>
        </div>
      )}

      {saveError && (
        <div className="p-4 rounded-xl bg-red-950/60 border border-red-500/50 flex items-center gap-3 text-xs text-red-200">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{saveError}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="p-6 sm:p-8 rounded-2xl bg-[#162238] border border-[rgba(241,245,249,0.1)] shadow-xl space-y-6">
        
        {/* Core Identity */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">Company Name</label>
            <input
              type="text"
              required
              value={formData.company_name || ''}
              onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e1626] border border-[rgba(241,245,249,0.12)] text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">Response Time (Hours)</label>
            <input
              type="number"
              value={formData.response_time_hours || ''}
              onChange={(e) => setFormData({ ...formData, response_time_hours: Number(e.target.value) || null })}
              placeholder="e.g. 24"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e1626] border border-[rgba(241,245,249,0.12)] text-xs text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">Corporate Tagline</label>
          <input
            type="text"
            required
            value={formData.tagline || ''}
            onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e1626] border border-[rgba(241,245,249,0.12)] text-xs text-white"
          />
        </div>

        {/* Contact Coordinates */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">Primary Phone</label>
            <input
              type="text"
              required
              value={formData.contact_phone || ''}
              onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e1626] border border-[rgba(241,245,249,0.12)] text-xs font-mono text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">WhatsApp Number</label>
            <input
              type="text"
              required
              value={formData.whatsapp || ''}
              onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e1626] border border-[rgba(241,245,249,0.12)] text-xs font-mono text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">Commercial Email</label>
            <input
              type="email"
              required
              value={formData.contact_email || ''}
              onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e1626] border border-[rgba(241,245,249,0.12)] text-xs text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">Telegram URL</label>
            <input
              type="url"
              value={formData.telegram_url || ''}
              onChange={(e) => setFormData({ ...formData, telegram_url: e.target.value })}
              placeholder="https://t.me/SolEthCommercialSolar"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e1626] border border-[rgba(241,245,249,0.12)] text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">Site Public URL</label>
            <input
              type="url"
              value={formData.site_url || ''}
              onChange={(e) => setFormData({ ...formData, site_url: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e1626] border border-[rgba(241,245,249,0.12)] text-xs text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">Headquarters Physical Address</label>
          <input
            type="text"
            required
            value={formData.address || ''}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e1626] border border-[rgba(241,245,249,0.12)] text-xs text-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">
            Service Coverage Areas (Comma-separated)
          </label>
          <input
            type="text"
            value={serviceAreasRaw}
            onChange={(e) => setServiceAreasRaw(e.target.value)}
            placeholder="Addis Ababa, Hawassa Corridor, Adama Industrial Park, Dire Dawa Free Zone"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e1626] border border-[rgba(241,245,249,0.12)] text-xs text-white"
          />
        </div>

        {/* Commercial Terms & Operations */}
        <div>
          <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">Warranty Summary</label>
          <textarea
            rows={2}
            value={formData.warranty_summary || ''}
            onChange={(e) => setFormData({ ...formData, warranty_summary: e.target.value })}
            className="w-full px-3.5 py-2 rounded-xl bg-[#0e1626] border border-[rgba(241,245,249,0.12)] text-xs text-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">Maintenance (O&M) Protocol</label>
          <textarea
            rows={2}
            value={formData.maintenance_summary || ''}
            onChange={(e) => setFormData({ ...formData, maintenance_summary: e.target.value })}
            className="w-full px-3.5 py-2 rounded-xl bg-[#0e1626] border border-[rgba(241,245,249,0.12)] text-xs text-white"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">Payment Milestone Terms</label>
            <textarea
              rows={2}
              value={formData.payment_options || ''}
              onChange={(e) => setFormData({ ...formData, payment_options: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-[#0e1626] border border-[rgba(241,245,249,0.12)] text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">Bank Financing Guidance</label>
            <textarea
              rows={2}
              value={formData.financing_notes || ''}
              onChange={(e) => setFormData({ ...formData, financing_notes: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-[#0e1626] border border-[rgba(241,245,249,0.12)] text-xs text-white"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-[rgba(241,245,249,0.08)]">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#f59e0b] hover:bg-[#d97706] text-[#0e1626] text-xs font-bold uppercase transition-all shadow-md disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Company Settings'}</span>
          </button>
        </div>

      </form>
    </div>
  );
};
