'use client';

import React from 'react';
import { RefreshCw, Database } from 'lucide-react';
import { AdminTab } from './AdminSidebar';
import { siteConfig } from '@/src/config/site';

interface AdminHeaderProps {
  currentTab: AdminTab;
  isRefreshing?: boolean;
  onRefresh: () => void;
  lastUpdated?: Date | null;
}

const TAB_TITLES: Record<AdminTab, { title: string; subtitle: string }> = {
  overview: {
    title: 'Executive EPC Dashboard',
    subtitle: 'High-electricity bill lead queue, conversion metrics, and facility interest breakdown',
  },
  leads: {
    title: 'Commercial Leads CRM',
    subtitle: 'Inbound facility assessment requests, status progression events, and technical notes',
  },
  solutions: {
    title: 'Solar Solutions & Architectures',
    subtitle: 'Manage Grid-Tied PV, BESS Battery Energy Storage, and Generator Hybrid microgrids',
  },
  projects: {
    title: 'Projects & Case Studies',
    subtitle: 'Manage verified commercial installations and illustrative technical demonstrations',
  },
  energy_rates: {
    title: 'Tariff Trajectory & Diesel Fuel Records',
    subtitle: 'Historical, verified current, and planned forecast electricity and fuel rates',
  },
  roi_assumptions: {
    title: 'Solar Economics & Financial Modeling',
    subtitle: 'Configure default bill offsets, installed cost per kWp, degradation, and escalation',
  },
  trust_items: {
    title: 'Trust Items, Licenses & Certifications',
    subtitle: 'Manage and verify MoWE competency, EEU grid compliance, and manufacturer warranties',
  },
  settings: {
    title: 'Company Settings & Field Operations',
    subtitle: 'Company contacts, Telegram bot, response times, warranty terms, and service areas',
  },
};

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  currentTab,
  isRefreshing = false,
  onRefresh,
  lastUpdated,
}) => {
  const info = TAB_TITLES[currentTab] || {
    title: 'Admin Console',
    subtitle: `${siteConfig.businessName} Operations`,
  };

  return (
    <header className="h-18 px-8 border-b border-[rgba(241,245,249,0.08)] bg-[#162238] flex items-center justify-between shrink-0 text-[#f8fafc]">
      {/* Breadcrumb & Title */}
      <div>
        <div className="flex items-center gap-1.5 text-xs text-[#94a3b8] font-medium">
          <span>EPC Portal</span>
          <span className="text-[#94a3b8]/60">/</span>
          <span className="text-[#f59e0b] font-semibold capitalize">{currentTab.replace('_', ' ')}</span>
        </div>
        <h1 className="text-lg font-bold text-[#f8fafc] tracking-tight leading-tight mt-0.5 font-heading">
          {info.title}
        </h1>
      </div>

      {/* Actions & Sync State */}
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 text-xs text-[#94a3b8]">
          <Database className="w-3.5 h-3.5 text-[#10b981]" />
          <span>EPC Data Store Connected</span>
          {lastUpdated && (
            <span className="text-[11px] text-[#94a3b8]/80 tabular-nums">
              · Synced {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>

        <button
          type="button"
          disabled={isRefreshing}
          onClick={onRefresh}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-[rgba(241,245,249,0.15)] hover:bg-[#1e2d4a] text-[#f8fafc] text-xs font-medium transition-all shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#f59e0b]' : ''}`} />
          <span>{isRefreshing ? 'Syncing...' : 'Refresh Data'}</span>
        </button>
      </div>
    </header>
  );
};
