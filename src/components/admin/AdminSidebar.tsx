'use client';

import React from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users2,
  Zap,
  Briefcase,
  TrendingUp,
  Calculator,
  ShieldCheck,
  Sliders,
  LogOut,
  ExternalLink,
  Sun
} from 'lucide-react';
import { useAdminAuth } from '@/src/context/AdminAuthContext';
import { siteConfig } from '@/src/config/site';

export type AdminTab =
  | 'overview'
  | 'leads'
  | 'solutions'
  | 'projects'
  | 'energy_rates'
  | 'roi_assumptions'
  | 'trust_items'
  | 'settings';

interface AdminSidebarProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  newLeadsCount?: number;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentTab,
  onSelectTab,
  newLeadsCount = 0,
}) => {
  const { user, signOut } = useAdminAuth();

  const navItems: Array<{
    id: AdminTab;
    label: string;
    icon: React.ReactNode;
    badgeCount?: number;
  }> = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'leads',
      label: 'Leads CRM',
      icon: <Users2 className="w-4 h-4" />,
      badgeCount: newLeadsCount > 0 ? newLeadsCount : undefined,
    },
    {
      id: 'solutions',
      label: 'Solar Solutions',
      icon: <Zap className="w-4 h-4" />,
    },
    {
      id: 'projects',
      label: 'Projects Portfolio',
      icon: <Briefcase className="w-4 h-4" />,
    },
    {
      id: 'energy_rates',
      label: 'Tariff & Fuel Rates',
      icon: <TrendingUp className="w-4 h-4" />,
    },
    {
      id: 'roi_assumptions',
      label: 'ROI Assumptions',
      icon: <Calculator className="w-4 h-4" />,
    },
    {
      id: 'trust_items',
      label: 'Trust & Licences',
      icon: <ShieldCheck className="w-4 h-4" />,
    },
    {
      id: 'settings',
      label: 'Company Settings',
      icon: <Sliders className="w-4 h-4" />,
    },
  ];

  return (
    <aside className="w-64 bg-[#0a101d] text-[#f8fafc] border-r border-[rgba(241,245,249,0.1)] flex flex-col justify-between shrink-0 h-screen sticky top-0">
      {/* Brand Header */}
      <div>
        <div className="p-6 border-b border-[rgba(241,245,249,0.08)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#162238] border border-[#f59e0b]/40 text-[#f59e0b] shadow-md">
              <Sun className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#f8fafc] tracking-tight font-heading truncate max-w-[140px]">
                {siteConfig.businessName}
              </h2>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-[#f59e0b] flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#10b981]" /> EPC Admin CRM
              </span>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-220px)]">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#f59e0b] text-[#0e1626] font-bold shadow-md shadow-[#f59e0b]/20'
                    : 'text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#162238]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isActive ? 'text-[#0e1626]' : 'text-[#f59e0b]'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badgeCount !== undefined && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold tabular-nums ${
                      isActive
                        ? 'bg-[#0e1626] text-[#f59e0b]'
                        : 'bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/30'
                    }`}
                  >
                    {item.badgeCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile & Actions */}
      <div className="p-4 border-t border-[rgba(241,245,249,0.08)] space-y-3 bg-[#070b14]">
        <Link
          href="/"
          target="_blank"
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#162238] transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Public Website</span>
          </span>
          <span className="text-[10px] text-[#10b981] font-semibold">Active</span>
        </Link>

        {user && (
          <div className="px-3 py-2 rounded-xl bg-[#162238] border border-[rgba(241,245,249,0.08)] text-xs">
            <p className="text-[#94a3b8] text-[10px] uppercase font-semibold tracking-wider">
              Authorized Engineer
            </p>
            <p className="text-[#f8fafc] font-medium truncate text-xs mt-0.5">
              {user.email}
            </p>
            <p className="text-[10px] font-mono text-[#94a3b8]/70 truncate mt-0.5">
              UID: {user.id.substring(0, 10)}...
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={() => signOut()}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
