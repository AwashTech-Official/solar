'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  ExternalLink,
  X
} from 'lucide-react';
import {
  TrustItem,
  TrustItemType,
  createTrustItemAdmin,
  updateTrustItemAdmin,
  deleteTrustItemAdmin
} from '@/src/lib/supabase';

interface TrustItemsViewProps {
  items: TrustItem[];
  isLoading: boolean;
  error?: string | null;
  onRefresh: () => void;
}

export const TrustItemsView: React.FC<TrustItemsViewProps> = ({
  items,
  isLoading,
  error,
  onRefresh,
}) => {
  const [editingItem, setEditingItem] = useState<Partial<TrustItem> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleOpenNew = () => {
    setEditingItem({
      item_type: 'certification',
      title: '',
      description: '',
      issuer_or_company: '',
      proof_url: '',
      // Default to unverified / unpublished as required by prompt
      is_verified: false,
      is_published: false,
      sort_order: items.length + 1,
    });
    setFormError(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.title?.trim() || !editingItem.description?.trim()) {
      setFormError('Title and description are required.');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      if (editingItem.id) {
        const res = await updateTrustItemAdmin(editingItem.id, editingItem);
        if (!res.success) throw new Error(res.error || 'Failed to update trust item');
      } else {
        const res = await createTrustItemAdmin(editingItem as any);
        if (!res.success) throw new Error(res.error || 'Failed to create trust item');
      }
      setEditingItem(null);
      onRefresh();
    } catch (err: any) {
      setFormError(err.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this trust item?')) return;
    try {
      await deleteTrustItemAdmin(id);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Delete failed');
    }
  };

  const handleToggleVerification = async (item: TrustItem) => {
    if (!item.id) return;
    try {
      await updateTrustItemAdmin(item.id, { is_verified: !item.is_verified });
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleTogglePublished = async (item: TrustItem) => {
    if (!item.id) return;
    try {
      await updateTrustItemAdmin(item.id, { is_published: !item.is_published });
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto text-[#f8fafc]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-heading text-white">Trust Items, Licences & Certifications</h2>
          <p className="text-xs text-[#94a3b8] mt-0.5">
            Default items to unverified/unpublished. Only displayed publicly after explicit admin verification and publication.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenNew}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#f59e0b] hover:bg-[#d97706] text-[#0e1626] text-xs font-bold uppercase transition-all shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Trust Item</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="p-6 rounded-2xl bg-[#162238] border border-[rgba(241,245,249,0.1)] flex flex-col justify-between space-y-4 shadow-xl"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#0e1626] text-[#f59e0b]">
                  {item.item_type}
                </span>

                <div className="flex items-center gap-3 text-xs">
                  <button
                    type="button"
                    onClick={() => handleToggleVerification(item)}
                    className={`flex items-center gap-1 cursor-pointer font-bold ${
                      item.is_verified ? 'text-[#10b981]' : 'text-[#94a3b8]'
                    }`}
                  >
                    {item.is_verified ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                    <span>{item.is_verified ? 'Verified' : 'Unverified'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTogglePublished(item)}
                    className={`flex items-center gap-1 cursor-pointer font-bold ${
                      item.is_published ? 'text-[#06b6d4]' : 'text-[#94a3b8]'
                    }`}
                  >
                    <span>{item.is_published ? 'Published' : 'Hidden'}</span>
                  </button>
                </div>
              </div>

              <h3 className="text-base font-bold text-white mt-3 font-heading">
                {item.title}
              </h3>

              <p className="text-xs text-[#94a3b8] mt-2 leading-relaxed">
                {item.description}
              </p>

              <div className="mt-4 pt-3 border-t border-[rgba(241,245,249,0.06)] text-[11px] text-[#cbd5e1] flex items-center justify-between">
                <span>{item.issuer_or_company || 'Issuer not specified'}</span>
                {item.proof_url && (
                  <a
                    href={item.proof_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#f59e0b] hover:underline flex items-center gap-1"
                  >
                    <span>Proof Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-[rgba(241,245,249,0.08)] flex items-center justify-between">
              <span className="text-[11px] font-mono text-[#94a3b8]">Order: {item.sort_order}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditingItem({ ...item })}
                  className="p-1.5 rounded-lg bg-[#0e1626] text-[#cbd5e1] hover:text-[#f59e0b] transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                {item.id && (
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id!)}
                    className="p-1.5 rounded-lg bg-[#0e1626] text-rose-400 hover:bg-rose-950/40 transition-colors"
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
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[#162238] border border-[rgba(241,245,249,0.15)] rounded-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[rgba(241,245,249,0.08)] mb-6">
              <h3 className="text-lg font-bold font-heading text-white">
                {editingItem.id ? 'Edit Trust Item' : 'Add Trust Item'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
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
              <div>
                <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">Item Type</label>
                <select
                  value={editingItem.item_type || 'certification'}
                  onChange={(e) => setEditingItem({ ...editingItem, item_type: e.target.value as TrustItemType })}
                  className="w-full px-3 py-2 rounded-xl bg-[#0e1626] border border-[rgba(241,245,249,0.12)] text-xs text-white"
                >
                  <option value="license">Regulatory License</option>
                  <option value="certification">Engineering Certification / Standard</option>
                  <option value="warranty">Hardware Manufacturer Warranty</option>
                  <option value="team">Engineering Team Credential</option>
                  <option value="financing">Bank Financing Partnership</option>
                  <option value="maintenance">Local O&M After-Sales Support</option>
                  <option value="testimonial">Verified Client Testimonial</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editingItem.title || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  placeholder="e.g. Ministry of Water & Energy Solar EPC Competency"
                  className="w-full px-3 py-2 rounded-xl bg-[#0e1626] border border-[rgba(241,245,249,0.12)] text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={editingItem.description || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#0e1626] border border-[rgba(241,245,249,0.12)] text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">Issuer / Entity</label>
                  <input
                    type="text"
                    value={editingItem.issuer_or_company || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, issuer_or_company: e.target.value })}
                    placeholder="e.g. MoWE / EEU / Tier-1 OEM"
                    className="w-full px-3 py-2 rounded-xl bg-[#0e1626] border border-[rgba(241,245,249,0.12)] text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">Proof URL (Optional)</label>
                  <input
                    type="url"
                    value={editingItem.proof_url || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, proof_url: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl bg-[#0e1626] border border-[rgba(241,245,249,0.12)] text-xs text-white"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0e1626] border border-[rgba(241,245,249,0.08)] space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_verified"
                    checked={editingItem.is_verified || false}
                    onChange={(e) => setEditingItem({ ...editingItem, is_verified: e.target.checked })}
                    className="accent-[#10b981] w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="is_verified" className="text-xs font-semibold text-[#cbd5e1] cursor-pointer">
                    Admin Verified (Documentation inspected and approved)
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_published"
                    checked={editingItem.is_published || false}
                    onChange={(e) => setEditingItem({ ...editingItem, is_published: e.target.checked })}
                    className="accent-[#f59e0b] w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="is_published" className="text-xs font-semibold text-[#cbd5e1] cursor-pointer">
                    Publish to Public Website (Only shows when verified AND published)
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[rgba(241,245,249,0.08)]">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-xl bg-[#0e1626] text-xs font-bold text-[#94a3b8] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-[#f59e0b] text-[#0e1626] text-xs font-bold uppercase transition-all shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
