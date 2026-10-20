'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Users2,
  Calendar,
  Phone,
  Mail,
  MapPin,
  TrendingUp,
  FileText,
  CheckCircle2,
  AlertCircle,
  X,
  MessageSquare,
  Clock,
  ArrowUpDown,
  Filter,
  Save,
  Zap,
  BatteryCharging,
  Flame,
  PlusCircle
} from 'lucide-react';
import {
  Lead,
  LeadStatus,
  LeadSource,
  SolutionInterest,
  updateLeadAdmin,
  recordLeadStatusEventAdmin,
  fetchLeadStatusEventsAdmin,
  LeadStatusEvent
} from '@/src/lib/supabase';

interface LeadsViewProps {
  leads: Lead[];
  isLoading: boolean;
  error?: string | null;
  onRefresh: () => void;
}

export const LeadsView: React.FC<LeadsViewProps> = ({
  leads,
  isLoading,
  error,
  onRefresh,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [solutionFilter, setSolutionFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'bill_desc' | 'date_desc' | 'date_asc'>('bill_desc');

  // Selected Lead Drawer Modal
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [internalNotesInput, setInternalNotesInput] = useState<string>('');
  const [isSavingNotes, setIsSavingNotes] = useState<boolean>(false);
  const [saveNotesSuccess, setSaveNotesSuccess] = useState<boolean>(false);

  // Status Change Event State
  const [statusEventNote, setStatusEventNote] = useState<string>('');
  const [statusEvents, setStatusEvents] = useState<LeadStatusEvent[]>([]);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<boolean>(false);

  // Handler for opening lead inspection drawer
  const handleSelectLead = (lead: Lead) => {
    setSelectedLead(lead);
    setInternalNotesInput(lead.internal_notes || '');
    setSaveNotesSuccess(false);
    setStatusEvents([]);
  };

  // Load status events asynchronously when selected lead changes
  useEffect(() => {
    const leadId = selectedLead?.id;
    if (!leadId) return;

    let isCurrent = true;
    fetchLeadStatusEventsAdmin(leadId).then((events) => {
      if (isCurrent) {
        setStatusEvents(events);
      }
    });
    return () => {
      isCurrent = false;
    };
  }, [selectedLead?.id]);

  // Filter & Sort Logic
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      if (statusFilter !== 'all' && lead.status !== statusFilter) return false;
      if (sourceFilter !== 'all' && lead.source !== sourceFilter) return false;
      if (solutionFilter !== 'all' && lead.solution_interest !== solutionFilter) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = lead.full_name?.toLowerCase().includes(query);
        const matchCompany = lead.company_name?.toLowerCase().includes(query);
        const matchPhone = lead.phone?.toLowerCase().includes(query);
        const matchEmail = lead.email?.toLowerCase().includes(query);
        const matchLocation = lead.site_location?.toLowerCase().includes(query);
        const matchIndustry = lead.industry?.toLowerCase().includes(query);
        if (!matchName && !matchCompany && !matchPhone && !matchEmail && !matchLocation && !matchIndustry) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'bill_desc') {
        return (Number(b.monthly_electricity_bill_etb) || 0) - (Number(a.monthly_electricity_bill_etb) || 0);
      }
      if (sortBy === 'date_asc') {
        return (a.created_at || '').localeCompare(b.created_at || '');
      }
      return (b.created_at || '').localeCompare(a.created_at || '');
    });
  }, [leads, statusFilter, sourceFilter, solutionFilter, searchQuery, sortBy]);

  // Handle Status Update
  const handleStatusChange = async (newStatus: LeadStatus) => {
    if (!selectedLead?.id) return;
    setIsUpdatingStatus(true);
    const oldStatus = selectedLead.status;

    try {
      await updateLeadAdmin(selectedLead.id, { status: newStatus });
      await recordLeadStatusEventAdmin(
        selectedLead.id,
        oldStatus,
        newStatus,
        statusEventNote.trim() || `Status updated to ${newStatus}`
      );

      // Refresh events and parent state
      const updatedEvents = await fetchLeadStatusEventsAdmin(selectedLead.id);
      setStatusEvents(updatedEvents);
      setStatusEventNote('');
      setSelectedLead((prev) => (prev ? { ...prev, status: newStatus } : null));
      onRefresh();
    } catch (err) {
      console.error('Status change error:', err);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Handle Internal Notes Save
  const handleSaveNotes = async () => {
    if (!selectedLead?.id) return;
    setIsSavingNotes(true);
    setSaveNotesSuccess(false);

    try {
      await updateLeadAdmin(selectedLead.id, {
        internal_notes: internalNotesInput.trim(),
      });
      setSelectedLead((prev) => (prev ? { ...prev, internal_notes: internalNotesInput.trim() } : null));
      setSaveNotesSuccess(true);
      onRefresh();
    } catch (err) {
      console.error('Save notes error:', err);
    } finally {
      setIsSavingNotes(false);
    }
  };

  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case 'new':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/30">New</span>;
      case 'contacted':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#06b6d4]/20 text-[#06b6d4] border border-[#06b6d4]/30">Contacted</span>;
      case 'site_visit_scheduled':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">Audit Scheduled</span>;
      case 'proposal_sent':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30">Proposal Sent</span>;
      case 'won':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30">Contract Won</span>;
      case 'lost':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">Closed / Lost</span>;
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto text-[#f8fafc]">
      
      {/* Header & Search / Filter Toolbar */}
      <div className="p-6 rounded-2xl bg-[#162238] border border-[rgba(241,245,249,0.1)] shadow-xl space-y-4">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-[#94a3b8] absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search company, contact, location, phone..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#0e1626] border border-[rgba(241,245,249,0.12)] text-xs text-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#f59e0b]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 text-xs text-[#94a3b8]">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#f59e0b]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1.5 rounded-lg bg-[#0e1626] border border-[rgba(241,245,249,0.12)] text-xs text-[#f8fafc] focus:outline-none"
              >
                <option value="bill_desc">Sort: Highest Monthly Bill (ETB)</option>
                <option value="date_desc">Sort: Newest Leads First</option>
                <option value="date_asc">Sort: Oldest Leads First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[rgba(241,245,249,0.06)] text-xs">
          <span className="text-[#94a3b8] flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3 text-[#f59e0b]" /> Status:
          </span>
          {[
            { id: 'all', label: 'All' },
            { id: 'new', label: 'New' },
            { id: 'contacted', label: 'Contacted' },
            { id: 'site_visit_scheduled', label: 'Site Audit' },
            { id: 'proposal_sent', label: 'Proposal Sent' },
            { id: 'won', label: 'Won' },
            { id: 'lost', label: 'Lost' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-[#f59e0b] text-[#0e1626]'
                  : 'bg-[#0e1626] text-[#94a3b8] hover:text-[#f8fafc]'
              }`}
            >
              {tab.label}
            </button>
          ))}

          <span className="text-[#94a3b8] ml-4 mr-1">Source:</span>
          {['all', 'website', 'jotform', 'whatsapp', 'telegram'].map((src) => (
            <button
              key={src}
              type="button"
              onClick={() => setSourceFilter(src)}
              className={`px-2 py-0.5 rounded text-[11px] capitalize cursor-pointer ${
                sourceFilter === src
                  ? 'bg-[#f59e0b]/20 text-[#f59e0b] font-bold border border-[#f59e0b]/30'
                  : 'text-[#94a3b8] hover:text-[#f8fafc]'
              }`}
            >
              {src}
            </button>
          ))}
        </div>

      </div>

      {/* Leads Table / List */}
      <div className="rounded-2xl bg-[#162238] border border-[rgba(241,245,249,0.1)] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0e1626] border-b border-[rgba(241,245,249,0.08)] text-[#94a3b8] font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Facility / Contact</th>
                <th className="py-3.5 px-4">Location & Sector</th>
                <th className="py-3.5 px-4">Monthly Bill (ETB)</th>
                <th className="py-3.5 px-4">Architecture Interest</th>
                <th className="py-3.5 px-4">Source</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(241,245,249,0.06)]">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#94a3b8]">
                    No leads matching current filters.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    onClick={() => handleSelectLead(lead)}
                    className="hover:bg-[#1e2d4a]/50 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#f8fafc]">{lead.company_name}</div>
                      <div className="text-[11px] text-[#94a3b8]">{lead.full_name} • {lead.phone}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-[#cbd5e1]">{lead.site_location}</div>
                      <div className="text-[11px] text-[#94a3b8]">{lead.industry || 'Commercial Facility'}</div>
                    </td>
                    <td className="py-3 px-4 font-mono">
                      <div className="font-bold text-[#f59e0b]">
                        {Number(lead.monthly_electricity_bill_etb).toLocaleString()} ETB
                      </div>
                      {lead.monthly_diesel_liters && (
                        <div className="text-[10px] text-[#94a3b8]">
                          {lead.monthly_diesel_liters} L diesel/mo
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 capitalize">
                      <span className="px-2 py-0.5 rounded text-[11px] bg-[#0e1626] text-[#cbd5e1] border border-[rgba(241,245,249,0.08)]">
                        {lead.solution_interest.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 capitalize font-mono text-[11px] text-[#94a3b8]">
                      {lead.source}
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(lead.status)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectLead(lead);
                        }}
                        className="px-2.5 py-1 rounded-md bg-[#0e1626] hover:bg-[#f59e0b] hover:text-[#0e1626] text-[11px] font-bold uppercase transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Lead Details Drawer / Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-xl bg-[#162238] border-l border-[rgba(241,245,249,0.15)] h-screen overflow-y-auto p-6 sm:p-8 flex flex-col justify-between shadow-2xl space-y-6">
            
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[rgba(241,245,249,0.08)]">
                <div>
                  <div className="text-[11px] font-mono text-[#f59e0b] uppercase font-bold">
                    Lead CRM Detail • ID: {selectedLead.id?.substring(0, 8)}
                  </div>
                  <h3 className="text-xl font-bold font-heading text-white mt-0.5">
                    {selectedLead.company_name}
                  </h3>
                  <div className="text-xs text-[#94a3b8]">
                    {selectedLead.full_name} • {selectedLead.site_location}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedLead(null)}
                  className="p-2 rounded-xl bg-[#0e1626] text-[#94a3b8] hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Communication Actions */}
              <div className="flex flex-wrap gap-2">
                <a
                  href={`tel:${selectedLead.phone.replace(/\s+/g, '')}`}
                  className="px-3 py-1.5 rounded-lg bg-[#0e1626] text-xs font-semibold text-[#f8fafc] hover:bg-[#f59e0b] hover:text-[#0e1626] transition-colors inline-flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call {selectedLead.phone}</span>
                </a>

                <a
                  href={`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-[#10b981]/20 text-xs font-semibold text-[#10b981] hover:bg-[#10b981] hover:text-[#0e1626] transition-colors inline-flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp Chat</span>
                </a>

                {selectedLead.email && (
                  <a
                    href={`mailto:${selectedLead.email}`}
                    className="px-3 py-1.5 rounded-lg bg-[#0e1626] text-xs font-semibold text-[#cbd5e1] hover:text-white transition-colors inline-flex items-center gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email</span>
                  </a>
                )}
              </div>

              {/* Energy Metrics Summary */}
              <div className="p-4 rounded-xl bg-[#0e1626] border border-[rgba(241,245,249,0.08)] grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[10px] text-[#94a3b8] uppercase font-bold">Monthly Electricity Bill</div>
                  <div className="text-base font-bold font-mono text-[#f59e0b] mt-0.5">
                    {Number(selectedLead.monthly_electricity_bill_etb).toLocaleString()} ETB
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-[#94a3b8] uppercase font-bold">Est. Annual Bill Offset</div>
                  <div className="text-base font-bold font-mono text-[#10b981] mt-0.5">
                    {Number(selectedLead.estimated_annual_savings_etb || 0).toLocaleString()} ETB
                  </div>
                </div>
                {selectedLead.monthly_electricity_kwh && (
                  <div>
                    <div className="text-[10px] text-[#94a3b8] uppercase font-bold">Monthly Energy</div>
                    <div className="text-xs font-mono text-white mt-0.5">
                      {selectedLead.monthly_electricity_kwh} kWh
                    </div>
                  </div>
                )}
                {selectedLead.monthly_diesel_liters && (
                  <div>
                    <div className="text-[10px] text-[#94a3b8] uppercase font-bold">Monthly Diesel</div>
                    <div className="text-xs font-mono text-white mt-0.5">
                      {selectedLead.monthly_diesel_liters} Liters
                    </div>
                  </div>
                )}
              </div>

              {/* Inquirer Message */}
              {selectedLead.message && (
                <div className="p-3.5 rounded-xl bg-[#0e1626]/60 border border-[rgba(241,245,249,0.06)]">
                  <div className="text-[11px] font-bold text-[#94a3b8] mb-1">Inquiry Message:</div>
                  <div className="text-xs text-[#cbd5e1] leading-relaxed">{selectedLead.message}</div>
                </div>
              )}

              {/* Status Update Action & Event Logging */}
              <div className="p-4 rounded-xl bg-[#0e1626] border border-[rgba(241,245,249,0.08)] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-[#cbd5e1]">Change Lead Status</span>
                  {getStatusBadge(selectedLead.status)}
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {(['new', 'contacted', 'site_visit_scheduled', 'proposal_sent', 'won', 'lost'] as LeadStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      disabled={isUpdatingStatus || selectedLead.status === st}
                      onClick={() => handleStatusChange(st)}
                      className={`px-2 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-40 ${
                        selectedLead.status === st
                          ? 'bg-[#f59e0b] text-[#0e1626]'
                          : 'bg-[#162238] text-[#94a3b8] hover:text-white'
                      }`}
                    >
                      {st.replace('_', ' ')}
                    </button>
                  ))}
                </div>

                <div>
                  <input
                    type="text"
                    value={statusEventNote}
                    onChange={(e) => setStatusEventNote(e.target.value)}
                    placeholder="Optional note for status history (e.g. Roof audit booked for Friday)"
                    className="w-full px-3 py-1.5 rounded-lg bg-[#162238] border border-[rgba(241,245,249,0.12)] text-xs text-[#f8fafc] focus:outline-none"
                  />
                </div>
              </div>

              {/* Status History Timeline */}
              {statusEvents.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#94a3b8] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#f59e0b]" />
                    <span>Status Progression History</span>
                  </div>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto">
                    {statusEvents.map((evt) => (
                      <div key={evt.id} className="p-2.5 rounded-lg bg-[#0e1626] text-[11px] border border-[rgba(241,245,249,0.06)]">
                        <div className="flex items-center justify-between text-[#94a3b8]">
                          <span className="capitalize font-bold text-[#f59e0b]">{evt.new_status.replace('_', ' ')}</span>
                          <span className="font-mono">{new Date(evt.created_at || '').toLocaleDateString()}</span>
                        </div>
                        {evt.note && <div className="text-[#cbd5e1] mt-1">{evt.note}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Editable Internal Technical Notes */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#cbd5e1]">
                    Internal Engineering Notes
                  </label>
                  {saveNotesSuccess && (
                    <span className="text-[11px] text-[#10b981] flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Saved
                    </span>
                  )}
                </div>
                <textarea
                  rows={4}
                  value={internalNotesInput}
                  onChange={(e) => setInternalNotesInput(e.target.value)}
                  placeholder="Record structural roof condition, transformer kVA, transformer meter serials, generator make..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e1626] border border-[rgba(241,245,249,0.15)] text-xs text-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#f59e0b]"
                />
                <button
                  type="button"
                  disabled={isSavingNotes}
                  onClick={handleSaveNotes}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f59e0b] hover:bg-[#d97706] text-[#0e1626] text-xs font-bold uppercase transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSavingNotes ? 'Saving...' : 'Save Notes'}</span>
                </button>
              </div>

            </div>

            <div className="pt-4 border-t border-[rgba(241,245,249,0.08)] text-[11px] text-[#94a3b8] flex justify-between items-center">
              <span>Submitted: {new Date(selectedLead.created_at || '').toLocaleString()}</span>
              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="px-4 py-1.5 rounded-lg bg-[#0e1626] text-xs text-white"
              >
                Close Drawer
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
