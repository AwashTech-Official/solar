'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  ExternalLink,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  X,
  AlertCircle
} from 'lucide-react';
import {
  EnergyRateHistory,
  RateType,
  RecordKind,
  createEnergyRateAdmin,
  updateEnergyRateAdmin,
  deleteEnergyRateAdmin
} from '@/src/lib/supabase';

interface EnergyRatesViewProps {
  rates: EnergyRateHistory[];
  isLoading: boolean;
  error?: string | null;
  onRefresh: () => void;
}

export const EnergyRatesView: React.FC<EnergyRatesViewProps> = ({
  rates,
  isLoading,
  error,
  onRefresh,
}) => {
  const [editingRate, setEditingRate] = useState<Partial<EnergyRateHistory> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleOpenNew = () => {
    setEditingRate({
      rate_type: 'commercial_grid',
      record_kind: 'actual',
      period_label: 'Current Year Commercial Tariff',
      period_start: new Date().toISOString().split('T')[0],
      rate_value: 4.12,
      unit: 'ETB/kWh',
      demand_charge_value: 95.0,
      demand_charge_unit: 'ETB/kVA/month',
      fixed_charge_value: 65.0,
      source_url: 'https://www.eeu.et',
      verified_at: new Date().toISOString().split('T')[0],
      notes: 'Confirmed with official utility tariff gazette.',
      is_current: false,
      is_published: true,
      sort_order: rates.length + 1,
    });
    setFormError(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRate?.period_label?.trim() || !editingRate.rate_value) {
      setFormError('Period label and rate value are required.');
      return;
    }

    // Strict constraint enforcement: Forecast cannot be labeled current
    if (editingRate.is_current && editingRate.record_kind === 'forecast') {
      setFormError('Rule Violation: Forecast records cannot be marked as the current rate.');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      if (editingRate.id) {
        const res = await updateEnergyRateAdmin(editingRate.id, editingRate);
        if (!res.success) throw new Error(res.error || 'Failed to update energy rate');
      } else {
        const res = await createEnergyRateAdmin(editingRate as any);
        if (!res.success) throw new Error(res.error || 'Failed to create energy rate');
      }
      setEditingRate(null);
      onRefresh();
    } catch (err: any) {
      setFormError(err.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this energy rate record?')) return;
    try {
      await deleteEnergyRateAdmin(id);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Delete failed');
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto text-[#f8fafc]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-heading text-white">Tariff Trajectory & Diesel Fuel Records</h2>
          <p className="text-xs text-[#94a3b8] mt-0.5">
            Maintain historical baseline, verified current rates, and planned forecast timelines. Enforces at most 1 current rate per category.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenNew}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#f59e0b] hover:bg-[#d97706] text-[#0e1626] text-xs font-bold uppercase transition-all shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Rate Record</span>
        </button>
      </div>

      <div className="rounded-2xl bg-[#162238] border border-[rgba(241,245,249,0.1)] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0e1626] border-b border-[rgba(241,245,249,0.08)] text-[#94a3b8] font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Rate Category</th>
                <th className="py-3.5 px-4">Kind / Nature</th>
                <th className="py-3.5 px-4">Period & Label</th>
                <th className="py-3.5 px-4">Rate Value</th>
                <th className="py-3.5 px-4">Demand / Fixed</th>
                <th className="py-3.5 px-4">Verified Date</th>
                <th className="py-3.5 px-4">Current?</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(241,245,249,0.06)]">
              {rates.map((r) => (
                <tr key={r.id} className="hover:bg-[#1e2d4a]/40 transition-colors">
                  <td className="py-3 px-4 capitalize font-semibold text-white">
                    {r.rate_type.replace('_', ' ')}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        r.record_kind === 'forecast'
                          ? 'bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/30'
                          : r.record_kind === 'actual'
                          ? 'bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30'
                          : 'bg-[#94a3b8]/20 text-[#cbd5e1]'
                      }`}
                    >
                      {r.record_kind}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-[#f8fafc]">{r.period_label}</div>
                    {r.notes && <div className="text-[11px] text-[#94a3b8] line-clamp-1">{r.notes}</div>}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-[#f59e0b]">
                    {Number(r.rate_value).toFixed(2)} {r.unit}
                  </td>
                  <td className="py-3 px-4 text-[#94a3b8] font-mono text-[11px]">
                    {r.demand_charge_value ? `${r.demand_charge_value} ${r.demand_charge_unit}` : '—'}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-[#cbd5e1]">
                    {r.verified_at || 'Unverified'}
                  </td>
                  <td className="py-3 px-4">
                    {r.is_current ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#10b981] text-[#0e1626]">
                        Active Current
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#94a3b8]">No</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => setEditingRate({ ...r })}
                        className="p-1.5 rounded-lg bg-[#0e1626] text-[#cbd5e1] hover:text-[#f59e0b] transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      {r.id && (
                        <button
                          type="button"
                          onClick={() => handleDelete(r.id!)}
                          className="p-1.5 rounded-lg bg-[#0e1626] text-rose-400 hover:bg-rose-950/40 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Create Modal */}
      {editingRate && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[#162238] border border-[rgba(241,245,249,0.15)] rounded-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[rgba(241,245,249,0.08)] mb-6">
              <h3 className="text-lg font-bold font-heading text-white">
                {editingRate.id ? 'Edit Energy Rate Record' : 'Add Energy Rate Record'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingRate(null)}
                className="p-1.5 rounded-lg bg-[#0e1626] text-[#94a3b8] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="p-3 mb-4 rounded-xl bg-red-950/60 border border-red-500/50 text-xs text-red-200">
                {formError}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">Rate Category</label>
                  <select
                    value={editingRate.rate_type || 'commercial_grid'}
                    onChange={(e) => setEditingRate({ ...editingRate, rate_type: e.target.value as RateType })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0e1626] border border-[rgba(241,245,249,0.12)] text-xs text-white"
                  >
                    <option value="commercial_grid">Commercial Grid (Low Voltage)</option>
                    <option value="industrial_low_voltage">Industrial (Low Voltage)</option>
                    <option value="industrial_high_voltage">Industrial (High Voltage)</option>
                    <option value="diesel_fuel">Diesel Generator Fuel</option>
                    <option value="other">Other Rate</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">Record Kind</label>
                  <select
                    value={editingRate.record_kind || 'actual'}
                    onChange={(e) => {
                      const kind = e.target.value as RecordKind;
                      setEditingRate({
                        ...editingRate,
                        record_kind: kind,
                        // If user picks forecast, automatically uncheck is_current
                        is_current: kind === 'forecast' ? false : editingRate.is_current,
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-[#0e1626] border border-[rgba(241,245,249,0.12)] text-xs text-white"
                  >
                    <option value="historical">Historical (Past Rates)</option>
                    <option value="actual">Actual (Active Verified Rates)</option>
                    <option value="forecast">Forecast (Planned Schedule Only)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">Period Label</label>
                <input
                  type="text"
                  required
                  value={editingRate.period_label || ''}
                  onChange={(e) => setEditingRate({ ...editingRate, period_label: e.target.value })}
                  placeholder="e.g. Current Commercial Tariff (Verified 2026)"
                  className="w-full px-3 py-2 rounded-xl bg-[#0e1626] border border-[rgba(241,245,249,0.12)] text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">Rate Value</label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={editingRate.rate_value || ''}
                    onChange={(e) => setEditingRate({ ...editingRate, rate_value: Number(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0e1626] border border-[rgba(241,245,249,0.12)] text-xs font-mono text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">Unit</label>
                  <input
                    type="text"
                    required
                    value={editingRate.unit || 'ETB/kWh'}
                    onChange={(e) => setEditingRate({ ...editingRate, unit: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0e1626] border border-[rgba(241,245,249,0.12)] text-xs font-mono text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">Demand Charge (Optional)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingRate.demand_charge_value || ''}
                    onChange={(e) => setEditingRate({ ...editingRate, demand_charge_value: Number(e.target.value) || null })}
                    placeholder="e.g. 95.00"
                    className="w-full px-3 py-2 rounded-xl bg-[#0e1626] border border-[rgba(241,245,249,0.12)] text-xs font-mono text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">Verified Date</label>
                  <input
                    type="date"
                    value={editingRate.verified_at || ''}
                    onChange={(e) => setEditingRate({ ...editingRate, verified_at: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0e1626] border border-[rgba(241,245,249,0.12)] text-xs font-mono text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">Official Source URL</label>
                <input
                  type="url"
                  value={editingRate.source_url || ''}
                  onChange={(e) => setEditingRate({ ...editingRate, source_url: e.target.value })}
                  placeholder="https://www.eeu.et"
                  className="w-full px-3 py-2 rounded-xl bg-[#0e1626] border border-[rgba(241,245,249,0.12)] text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">Notes & Regulatory Context</label>
                <textarea
                  rows={2}
                  value={editingRate.notes || ''}
                  onChange={(e) => setEditingRate({ ...editingRate, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#0e1626] border border-[rgba(241,245,249,0.12)] text-xs text-white"
                />
              </div>

              {/* Status toggles */}
              <div className="p-3 rounded-xl bg-[#0e1626] border border-[rgba(241,245,249,0.08)] space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_current"
                    disabled={editingRate.record_kind === 'forecast'}
                    checked={editingRate.is_current || false}
                    onChange={(e) => setEditingRate({ ...editingRate, is_current: e.target.checked })}
                    className="accent-[#10b981] w-4 h-4 cursor-pointer disabled:opacity-30"
                  />
                  <label htmlFor="is_current" className={`text-xs font-bold ${editingRate.record_kind === 'forecast' ? 'text-[#94a3b8]' : 'text-white'}`}>
                    Active Current Rate (Overrides existing current rate for this category)
                  </label>
                </div>
                {editingRate.record_kind === 'forecast' && (
                  <p className="text-[11px] text-[#f59e0b]">
                    Forecast data cannot be marked as the current rate.
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[rgba(241,245,249,0.08)]">
                <button
                  type="button"
                  onClick={() => setEditingRate(null)}
                  className="px-4 py-2 rounded-xl bg-[#0e1626] text-xs font-bold text-[#94a3b8] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-[#f59e0b] text-[#0e1626] text-xs font-bold uppercase transition-all shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save Rate Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
