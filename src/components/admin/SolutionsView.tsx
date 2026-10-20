'use client';

import React, { useState } from 'react';
import {
  Zap,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  X,
  Layers,
  Save
} from 'lucide-react';
import {
  SolarSolution,
  SystemType,
  createSolutionAdmin,
  updateSolutionAdmin,
  deleteSolutionAdmin
} from '@/src/lib/supabase';

interface SolutionsViewProps {
  solutions: SolarSolution[];
  isLoading: boolean;
  error?: string | null;
  onRefresh: () => void;
}

export const SolutionsView: React.FC<SolutionsViewProps> = ({
  solutions,
  isLoading,
  error,
  onRefresh,
}) => {
  const [editingSolution, setEditingSolution] = useState<Partial<SolarSolution> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleOpenNew = () => {
    setEditingSolution({
      slug: '',
      title: '',
      short_description: '',
      system_type: 'grid_tied',
      suitable_for: ['Commercial Offices', 'Manufacturing Facilities'],
      features: ['Tier-1 Modules', 'Remote Monitoring'],
      minimum_capacity_kwp: 30,
      maximum_capacity_kwp: 1000,
      image_url: 'https://picsum.photos/seed/grid-tied-solar-sample/1000/800',
      sort_order: solutions.length + 1,
      is_active: true,
    });
    setFormError(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSolution?.title?.trim() || !editingSolution.slug?.trim() || !editingSolution.short_description?.trim()) {
      setFormError('Title, Slug, and Description are required.');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      if (editingSolution.id) {
        const res = await updateSolutionAdmin(editingSolution.id, editingSolution);
        if (!res.success) throw new Error(res.error || 'Failed to update solution');
      } else {
        const res = await createSolutionAdmin(editingSolution as any);
        if (!res.success) throw new Error(res.error || 'Failed to create solution');
      }
      setEditingSolution(null);
      onRefresh();
    } catch (err: any) {
      setFormError(err.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this solar solution architecture?')) return;
    try {
      await deleteSolutionAdmin(id);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Delete failed');
    }
  };

  const handleToggleActive = async (sol: SolarSolution) => {
    if (!sol.id) return;
    try {
      await updateSolutionAdmin(sol.id, { is_active: !sol.is_active });
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto text-[#f8fafc]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-heading text-white">Commercial Solar Architectures</h2>
          <p className="text-xs text-[#94a3b8] mt-0.5">
            Configure C&I system offerings, suitability, features, and capacity ranges.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenNew}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#f59e0b] hover:bg-[#d97706] text-[#0e1626] text-xs font-bold uppercase transition-all shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Solar Solution</span>
        </button>
      </div>

      {/* Solutions Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {solutions.map((sol) => (
          <div
            key={sol.id || sol.slug}
            className="p-6 rounded-2xl bg-[#162238] border border-[rgba(241,245,249,0.1)] flex flex-col justify-between space-y-4 shadow-xl"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#0e1626] text-[#f59e0b] border border-[#f59e0b]/30">
                  {sol.system_type.replace('_', ' ')}
                </span>
                <button
                  type="button"
                  onClick={() => handleToggleActive(sol)}
                  className={`text-xs font-bold flex items-center gap-1 cursor-pointer ${
                    sol.is_active ? 'text-[#10b981]' : 'text-[#94a3b8]'
                  }`}
                >
                  {sol.is_active ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Active</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4" />
                      <span>Inactive</span>
                    </>
                  )}
                </button>
              </div>

              <h3 className="text-base font-bold text-white mt-3 font-heading">
                {sol.title}
              </h3>
              <p className="text-xs text-[#94a3b8] mt-2 line-clamp-3 leading-relaxed">
                {sol.short_description}
              </p>

              <div className="mt-4 pt-3 border-t border-[rgba(241,245,249,0.06)] text-xs text-[#cbd5e1] font-mono">
                Capacity: {sol.minimum_capacity_kwp || 0}–{sol.maximum_capacity_kwp || 0} kWp
              </div>
            </div>

            <div className="pt-4 border-t border-[rgba(241,245,249,0.08)] flex items-center justify-between">
              <span className="text-[11px] font-mono text-[#94a3b8]">Sort Order: {sol.sort_order}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditingSolution({ ...sol })}
                  className="p-2 rounded-lg bg-[#0e1626] text-[#cbd5e1] hover:text-[#f59e0b] transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                {sol.id && (
                  <button
                    type="button"
                    onClick={() => handleDelete(sol.id!)}
                    className="p-2 rounded-lg bg-[#0e1626] text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Create Modal */}
      {editingSolution && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#162238] border border-[rgba(241,245,249,0.15)] rounded-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[rgba(241,245,249,0.08)] mb-6">
              <h3 className="text-lg font-bold font-heading text-white">
                {editingSolution.id ? 'Edit Solar Solution' : 'Add Solar Solution'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingSolution(null)}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={editingSolution.title || ''}
                    onChange={(e) => setEditingSolution({ ...editingSolution, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0e1626] border border-[rgba(241,245,249,0.12)] text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">Slug</label>
                  <input
                    type="text"
                    required
                    value={editingSolution.slug || ''}
                    onChange={(e) => setEditingSolution({ ...editingSolution, slug: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0e1626] border border-[rgba(241,245,249,0.12)] text-xs font-mono text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">System Type</label>
                <select
                  value={editingSolution.system_type || 'grid_tied'}
                  onChange={(e) => setEditingSolution({ ...editingSolution, system_type: e.target.value as SystemType })}
                  className="w-full px-3 py-2 rounded-xl bg-[#0e1626] border border-[rgba(241,245,249,0.12)] text-xs text-white"
                >
                  <option value="grid_tied">Commercial Grid-Tied PV</option>
                  <option value="bess_storage">Solar + Battery Storage (BESS)</option>
                  <option value="hybrid">Solar + Generator Hybrid Microgrid</option>
                  <option value="off_grid">Off-Grid Industrial Island</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">Short Description</label>
                <textarea
                  rows={3}
                  required
                  value={editingSolution.short_description || ''}
                  onChange={(e) => setEditingSolution({ ...editingSolution, short_description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#0e1626] border border-[rgba(241,245,249,0.12)] text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">Min Capacity (kWp)</label>
                  <input
                    type="number"
                    value={editingSolution.minimum_capacity_kwp || ''}
                    onChange={(e) => setEditingSolution({ ...editingSolution, minimum_capacity_kwp: Number(e.target.value) || null })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0e1626] border border-[rgba(241,245,249,0.12)] text-xs font-mono text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">Max Capacity (kWp)</label>
                  <input
                    type="number"
                    value={editingSolution.maximum_capacity_kwp || ''}
                    onChange={(e) => setEditingSolution({ ...editingSolution, maximum_capacity_kwp: Number(e.target.value) || null })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0e1626] border border-[rgba(241,245,249,0.12)] text-xs font-mono text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">Image URL</label>
                <input
                  type="url"
                  value={editingSolution.image_url || ''}
                  onChange={(e) => setEditingSolution({ ...editingSolution, image_url: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#0e1626] border border-[rgba(241,245,249,0.12)] text-xs text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[rgba(241,245,249,0.08)]">
                <button
                  type="button"
                  onClick={() => setEditingSolution(null)}
                  className="px-4 py-2 rounded-xl bg-[#0e1626] text-xs font-bold text-[#94a3b8] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-[#f59e0b] text-[#0e1626] text-xs font-bold uppercase transition-all shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save Solution'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
