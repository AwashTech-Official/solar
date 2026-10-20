'use client';

import React from 'react';
import {
  Users2,
  Calendar,
  FileCheck2,
  CheckCircle2,
  TrendingUp,
  Zap,
  BatteryCharging,
  Flame,
  ArrowRight,
  AlertTriangle,
  Building2
} from 'lucide-react';
import { Lead, SolarSolution, Project } from '@/src/lib/supabase';
import { AdminTab } from './AdminSidebar';

interface OverviewViewProps {
  leads: Lead[];
  solutions: SolarSolution[];
  projects: Project[];
  isLoading: boolean;
  error?: string | null;
  onNavigateToTab: (tab: AdminTab) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  leads,
  solutions,
  projects,
  isLoading,
  error,
  onNavigateToTab,
}) => {
  // Metric counts
  const totalLeads = leads.length;
  const newLeads = leads.filter((l) => l.status === 'new').length;
  const siteVisits = leads.filter((l) => l.status === 'site_visit_scheduled').length;
  const proposalsSent = leads.filter((l) => l.status === 'proposal_sent').length;
  const wonContracts = leads.filter((l) => l.status === 'won').length;

  // Breakdown by Interest
  const gridTiedCount = leads.filter((l) => l.solution_interest === 'grid_tied').length;
  const batteryCount = leads.filter((l) => l.solution_interest === 'solar_battery').length;
  const hybridCount = leads.filter((l) => l.solution_interest === 'solar_generator_hybrid').length;
  const notSureCount = leads.filter((l) => l.solution_interest === 'not_sure').length;

  // Breakdown by Source
  const websiteCount = leads.filter((l) => l.source === 'website').length;
  const jotformCount = leads.filter((l) => l.source === 'jotform').length;
  const whatsappCount = leads.filter((l) => l.source === 'whatsapp').length;
  const telegramCount = leads.filter((l) => l.source === 'telegram').length;

  // High-value lead queue (sorted transparently by monthly electricity bill ETB)
  const highBillLeads = [...leads]
    .sort((a, b) => (Number(b.monthly_electricity_bill_etb) || 0) - (Number(a.monthly_electricity_bill_etb) || 0))
    .slice(0, 5);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto text-[#f8fafc]">
      {/* Top Notification / Error if any */}
      {error && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/50 flex items-center gap-3 text-xs text-red-200">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        <div className="p-5 rounded-2xl bg-[#162238] border border-[rgba(241,245,249,0.1)]">
          <div className="flex items-center justify-between text-xs text-[#94a3b8]">
            <span>Total Leads</span>
            <Users2 className="w-4 h-4 text-[#f59e0b]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#f8fafc] mt-2">
            {totalLeads}
          </div>
          <div className="text-[11px] text-[#94a3b8] mt-1">Inbound facility requests</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#162238] border border-[#f59e0b]/40">
          <div className="flex items-center justify-between text-xs text-[#f59e0b]">
            <span className="font-bold">New Assessment Leads</span>
            <span className="w-2 h-2 rounded-full bg-[#f59e0b] animate-ping" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#f59e0b] mt-2">
            {newLeads}
          </div>
          <div className="text-[11px] text-[#94a3b8] mt-1">Pending initial review</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#162238] border border-[rgba(241,245,249,0.1)]">
          <div className="flex items-center justify-between text-xs text-[#94a3b8]">
            <span>Site Audits Scheduled</span>
            <Calendar className="w-4 h-4 text-[#06b6d4]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#06b6d4] mt-2">
            {siteVisits}
          </div>
          <div className="text-[11px] text-[#94a3b8] mt-1">Roof & electrical inspections</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#162238] border border-[rgba(241,245,249,0.1)]">
          <div className="flex items-center justify-between text-xs text-[#94a3b8]">
            <span>Proposals Dispatched</span>
            <FileCheck2 className="w-4 h-4 text-[#f59e0b]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#f8fafc] mt-2">
            {proposalsSent}
          </div>
          <div className="text-[11px] text-[#94a3b8] mt-1">Single-line diagram quotations</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#162238] border border-[#10b981]/40">
          <div className="flex items-center justify-between text-xs text-[#10b981]">
            <span className="font-bold">Contracts Won</span>
            <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#10b981] mt-2">
            {wonContracts}
          </div>
          <div className="text-[11px] text-[#94a3b8] mt-1">Active EPC execution</div>
        </div>

      </div>

      {/* Middle Grid: High Electricity Bill Queue & Solution Interest Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* High Bill Priority Queue (lg:col-span-8) */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-[#162238] border border-[rgba(241,245,249,0.1)] shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-[rgba(241,245,249,0.08)] mb-4">
            <div>
              <h3 className="text-base font-bold font-heading text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#f59e0b]" />
                <span>High Monthly Electricity Bill Queue (Transparent Sort)</span>
              </h3>
              <p className="text-xs text-[#94a3b8] mt-0.5">
                Prioritized transparently by submitted utility spend. Highest potential solar offset.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateToTab('leads')}
              className="text-xs font-bold text-[#f59e0b] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All Leads</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {highBillLeads.map((lead) => (
              <div
                key={lead.id}
                className="p-4 rounded-xl bg-[#0e1626] border border-[rgba(241,245,249,0.08)] flex flex-wrap items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white font-heading">
                      {lead.company_name}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#162238] text-[#f59e0b]">
                      {lead.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-xs text-[#94a3b8] mt-1 flex items-center gap-3">
                    <span>{lead.full_name} ({lead.phone})</span>
                    <span>•</span>
                    <span>{lead.site_location}</span>
                    <span>•</span>
                    <span className="capitalize">{lead.solution_interest.replace('_', ' ')}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-[#f59e0b]">
                    {Number(lead.monthly_electricity_bill_etb).toLocaleString()} ETB / mo
                  </div>
                  {lead.estimated_annual_savings_etb && (
                    <div className="text-[10px] font-mono text-[#10b981] mt-0.5">
                      ~{Number(lead.estimated_annual_savings_etb).toLocaleString()} ETB est. annual offset
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Breakdown by Solution Interest & Channel (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Solution Breakdown */}
          <div className="p-6 rounded-2xl bg-[#162238] border border-[rgba(241,245,249,0.1)] shadow-xl">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#94a3b8] mb-4">
              Leads by System Interest
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-[#cbd5e1]">
                  <Zap className="w-3.5 h-3.5 text-[#f59e0b]" />
                  <span>Grid-Tied Rooftop PV</span>
                </span>
                <span className="font-mono font-bold text-white">{gridTiedCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-[#cbd5e1]">
                  <BatteryCharging className="w-3.5 h-3.5 text-[#f59e0b]" />
                  <span>Solar + Battery BESS</span>
                </span>
                <span className="font-mono font-bold text-white">{batteryCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-[#cbd5e1]">
                  <Flame className="w-3.5 h-3.5 text-[#f59e0b]" />
                  <span>Solar + Generator Hybrid</span>
                </span>
                <span className="font-mono font-bold text-white">{hybridCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#94a3b8]">Undecided / Needs Audit</span>
                <span className="font-mono font-bold text-white">{notSureCount}</span>
              </div>
            </div>
          </div>

          {/* Acquisition Channels */}
          <div className="p-6 rounded-2xl bg-[#162238] border border-[rgba(241,245,249,0.1)] shadow-xl">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#94a3b8] mb-4">
              Inbound Acquisition Channels
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#cbd5e1]">Website Lead Form</span>
                <span className="font-mono font-bold text-white">{websiteCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#cbd5e1]">Jotform Webhook</span>
                <span className="font-mono font-bold text-white">{jotformCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#cbd5e1]">WhatsApp Inquiries</span>
                <span className="font-mono font-bold text-white">{whatsappCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#cbd5e1]">Telegram Bot</span>
                <span className="font-mono font-bold text-white">{telegramCount}</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
