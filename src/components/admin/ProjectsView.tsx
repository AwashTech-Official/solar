'use client';

import React, { useState } from 'react';
import {
  Briefcase,
  Plus,
  Edit2,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  X,
  MapPin,
  Save
} from 'lucide-react';
import {
  Project,
  SystemType,
  createProjectAdmin,
  updateProjectAdmin,
  deleteProjectAdmin
} from '@/src/lib/supabase';

interface ProjectsViewProps {
  projects: Project[];
  isLoading: boolean;
  error?: string | null;
  onRefresh: () => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  isLoading,
  error,
  onRefresh,
}) => {
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleOpenNew = () => {
    setEditingProject({
      slug: '',
      title: '',
      location: 'Addis Ababa / Regional Hub',
      customer_sector: 'Manufacturing / Industrial',
      system_type: 'grid_tied',
      capacity_kwp: 150,
      panel_brand: 'Tier-1 TOPCon 580W',
      inverter_brand: '100kW Multi-MPPT Commercial Inverter',
      monthly_generation_kwh: 22000,
      monthly_savings_etb: 90000,
      project_description: '',
      cover_image_url: 'https://picsum.photos/seed/ethiopian-commercial-solar-project/1000/800',
      measurement_period: '90-Day Continuous Telemetry',
      verification_note: 'Verified with EEU bi-directional meter readings.',
      is_illustrative: false,
      is_published: false,
      sort_order: projects.length + 1,
    });
    setFormError(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject?.title?.trim() || !editingProject.slug?.trim() || !editingProject.capacity_kwp) {
      setFormError('Title, Slug, and Capacity (kWp) are required.');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      if (editingProject.id) {
        const res = await updateProjectAdmin(editingProject.id, editingProject);
        if (!res.success) throw new Error(res.error || 'Failed to update project');
      } else {
        const res = await createProjectAdmin(editingProject as any);
        if (!res.success) throw new Error(res.error || 'Failed to create project');
      }
      setEditingProject(null);
      onRefresh();
    } catch (err: any) {
      setFormError(err.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project record?')) return;
    try {
      await deleteProjectAdmin(id);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Delete failed');
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto text-[#f8fafc]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-heading text-white">Commercial Projects & Case Studies</h2>
          <p className="text-xs text-[#94a3b8] mt-0.5">
            Manage published installations. Prominently labels illustrative records to prevent unverified claims.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenNew}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#f59e0b] hover:bg-[#d97706] text-[#0e1626] text-xs font-bold uppercase transition-all shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Project Record</span>
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#162238] border border-[rgba(241,245,249,0.08)]">
          <Briefcase className="w-10 h-10 text-[#94a3b8] mx-auto mb-3" />
          <h3 className="text-sm font-bold text-white">No Project Records In Database</h3>
          <p className="text-xs text-[#94a3b8] max-w-md mx-auto mt-1">
            In accordance with content safeguards, case studies are hidden from public visitors until verified project data is published here by an authorized engineer.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => (
            <div
              key={proj.id || proj.slug}
              className="p-6 rounded-2xl bg-[#162238] border border-[rgba(241,245,249,0.1)] flex flex-col justify-between space-y-4 shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-[#0e1626] text-[#f59e0b] border border-[#f59e0b]/30">
                    {proj.capacity_kwp} kWp
                  </span>

                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    proj.is_published ? 'bg-[#10b981]/20 text-[#10b981]' : 'bg-[#94a3b8]/20 text-[#cbd5e1]'
                  }`}>
                    {proj.is_published ? 'Published' : 'Draft'}
                  </span>
                </div>

                {proj.is_illustrative && (
                  <div className="mt-3 p-2 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center gap-1.5 text-[11px] font-bold text-[#f59e0b]">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>Illustrative example — not a client project</span>
                  </div>
                )}

                <h3 className="text-base font-bold text-white mt-3 font-heading">
                  {proj.title}
                </h3>
                <div className="text-xs text-[#94a3b8] mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#f59e0b]" />
                  <span>{proj.location} • {proj.customer_sector}</span>
                </div>

                <p className="text-xs text-[#94a3b8] mt-3 line-clamp-2 leading-relaxed">
                  {proj.project_description}
                </p>

                <div className="mt-4 pt-3 border-t border-[rgba(241,245,249,0.06)] grid grid-cols-2 gap-2 text-xs font-mono">
                  {proj.monthly_generation_kwh && (
                    <div>
                      <span className="text-[10px] text-[#94a3b8]">Gen / mo:</span>
                      <div className="text-white font-bold">{proj.monthly_generation_kwh} kWh</div>
                    </div>
                  )}
                  {proj.monthly_savings_etb && (
                    <div>
                      <span className="text-[10px] text-[#94a3b8]">Savings / mo:</span>
                      <div className="text-[#10b981] font-bold">{proj.monthly_savings_etb} ETB</div>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-[rgba(241,245,249,0.08)] flex items-center justify-between">
                <span className="text-[11px] font-mono text-[#94a3b8]">Order: {proj.sort_order}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingProject({ ...proj })}
                    className="p-2 rounded-lg bg-[#0e1626] text-[#cbd5e1] hover:text-[#f59e0b] transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  {proj.id && (
                    <button
                      type="button"
                      onClick={() => handleDelete(proj.id!)}
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
      )}

      {/* Edit / Create Modal */}
      {editingProject && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#162238] border border-[rgba(241,245,249,0.15)] rounded-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[rgba(241,245,249,0.08)] mb-6">
              <h3 className="text-lg font-bold font-heading text-white">
                {editingProject.id ? 'Edit Project' : 'Add Project Record'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingProject(null)}
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
                  <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">Project Title</label>
                  <input
                    type="text"
                    required
                    value={editingProject.title || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0e1626] border border-[rgba(241,245,249,0.12)] text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">Slug</label>
                  <input
                    type="text"
                    required
                    value={editingProject.slug || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, slug: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0e1626] border border-[rgba(241,245,249,0.12)] text-xs font-mono text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">Capacity (kWp)</label>
                  <input
                    type="number"
                    required
                    value={editingProject.capacity_kwp || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, capacity_kwp: Number(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0e1626] border border-[rgba(241,245,249,0.12)] text-xs font-mono text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">Location</label>
                  <input
                    type="text"
                    value={editingProject.location || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0e1626] border border-[rgba(241,245,249,0.12)] text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">Sector</label>
                  <input
                    type="text"
                    value={editingProject.customer_sector || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, customer_sector: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0e1626] border border-[rgba(241,245,249,0.12)] text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">Project Description</label>
                <textarea
                  rows={3}
                  required
                  value={editingProject.project_description || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, project_description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#0e1626] border border-[rgba(241,245,249,0.12)] text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">Monthly Gen (kWh)</label>
                  <input
                    type="number"
                    value={editingProject.monthly_generation_kwh || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, monthly_generation_kwh: Number(e.target.value) || null })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0e1626] border border-[rgba(241,245,249,0.12)] text-xs font-mono text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">Monthly Savings (ETB)</label>
                  <input
                    type="number"
                    value={editingProject.monthly_savings_etb || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, monthly_savings_etb: Number(e.target.value) || null })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0e1626] border border-[rgba(241,245,249,0.12)] text-xs font-mono text-white"
                  />
                </div>
              </div>

              {/* Guard Flags */}
              <div className="p-4 rounded-xl bg-[#0e1626] border border-[rgba(241,245,249,0.08)] space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="is_illustrative"
                    checked={editingProject.is_illustrative || false}
                    onChange={(e) => setEditingProject({ ...editingProject, is_illustrative: e.target.checked })}
                    className="accent-[#f59e0b] w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="is_illustrative" className="text-xs font-bold text-[#f59e0b] cursor-pointer">
                    Mark as Illustrative Example (Will display: &quot;Illustrative example — not a client project&quot;)
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="is_published"
                    checked={editingProject.is_published || false}
                    onChange={(e) => setEditingProject({ ...editingProject, is_published: e.target.checked })}
                    className="accent-[#10b981] w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="is_published" className="text-xs font-semibold text-[#cbd5e1] cursor-pointer">
                    Publish to Public Website
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[rgba(241,245,249,0.08)]">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2 rounded-xl bg-[#0e1626] text-xs font-bold text-[#94a3b8] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-[#f59e0b] text-[#0e1626] text-xs font-bold uppercase transition-all shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save Project Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
