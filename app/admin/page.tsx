'use client';

import React, { useState, useEffect } from 'react';
import { AdminAuthProvider, useAdminAuth } from '@/src/context/AdminAuthContext';
import { AdminLogin } from '@/src/components/admin/AdminLogin';
import { AdminSidebar, AdminTab } from '@/src/components/admin/AdminSidebar';
import { AdminHeader } from '@/src/components/admin/AdminHeader';
import { OverviewView } from '@/src/components/admin/OverviewView';
import { LeadsView } from '@/src/components/admin/LeadsView';
import { SolutionsView } from '@/src/components/admin/SolutionsView';
import { ProjectsView } from '@/src/components/admin/ProjectsView';
import { EnergyRatesView } from '@/src/components/admin/EnergyRatesView';
import { RoiAssumptionsView } from '@/src/components/admin/RoiAssumptionsView';
import { TrustItemsView } from '@/src/components/admin/TrustItemsView';
import { SettingsView } from '@/src/components/admin/SettingsView';
import {
  Lead,
  SolarSolution,
  Project,
  EnergyRateHistory,
  SolarEconomicsSettings,
  TrustItem,
  CompanySettings,
  fetchAllLeadsAdmin,
  fetchSolutionsAdmin,
  fetchProjectsAdmin,
  fetchEnergyRatesAdmin,
  fetchSolarEconomicsSettings,
  fetchTrustItemsAdmin,
  fetchCompanySettings,
  isSupabaseConfigured,
} from '@/src/lib/supabase';
import { RefreshCw, AlertTriangle } from 'lucide-react';

function AdminDashboardContent() {
  const { user, isAdmin, loading: authLoading } = useAdminAuth();
  const [currentTab, setCurrentTab] = useState<AdminTab>('overview');

  // Database Data States
  const [leads, setLeads] = useState<Lead[]>([]);
  const [solutions, setSolutions] = useState<SolarSolution[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [rates, setRates] = useState<EnergyRateHistory[]>([]);
  const [roiSettings, setRoiSettings] = useState<SolarEconomicsSettings | null>(null);
  const [trustItems, setTrustItems] = useState<TrustItem[]>([]);
  const [companySettings, setCompanySettings] = useState<CompanySettings | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [dataError, setDataError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Reusable refresh handler triggered by user action
  const handleRefreshData = async () => {
    setIsRefreshing(true);
    setDataError(null);
    try {
      const [
        leadsRes,
        solutionsRes,
        projectsRes,
        ratesRes,
        roiRes,
        trustRes,
        settingsRes,
      ] = await Promise.all([
        fetchAllLeadsAdmin(),
        fetchSolutionsAdmin(),
        fetchProjectsAdmin(),
        fetchEnergyRatesAdmin(),
        fetchSolarEconomicsSettings(),
        fetchTrustItemsAdmin(),
        fetchCompanySettings(),
      ]);

      setLeads(leadsRes.data || []);
      setSolutions(solutionsRes.data || []);
      setProjects(projectsRes.data || []);
      setRates(ratesRes.data || []);
      setRoiSettings(roiRes || null);
      setTrustItems(trustRes.data || []);
      setCompanySettings(settingsRes || null);
      setLastUpdated(new Date());

      if (
        leadsRes.error ||
        solutionsRes.error ||
        projectsRes.error ||
        ratesRes.error ||
        trustRes.error
      ) {
        setDataError(
          leadsRes.error ||
            solutionsRes.error ||
            projectsRes.error ||
            ratesRes.error ||
            trustRes.error ||
            null
        );
      }
    } catch (err: any) {
      console.error('Failed to load dashboard data:', err);
      setDataError(err?.message || 'Error communicating with Supabase database');
    } finally {
      setIsRefreshing(false);
      setIsLoading(false);
    }
  };

  // Initial load on admin auth
  useEffect(() => {
    if (!isAdmin) return;
    let isMounted = true;

    async function initialLoad() {
      try {
        const [
          leadsRes,
          solutionsRes,
          projectsRes,
          ratesRes,
          roiRes,
          trustRes,
          settingsRes,
        ] = await Promise.all([
          fetchAllLeadsAdmin(),
          fetchSolutionsAdmin(),
          fetchProjectsAdmin(),
          fetchEnergyRatesAdmin(),
          fetchSolarEconomicsSettings(),
          fetchTrustItemsAdmin(),
          fetchCompanySettings(),
        ]);

        if (isMounted) {
          setLeads(leadsRes.data || []);
          setSolutions(solutionsRes.data || []);
          setProjects(projectsRes.data || []);
          setRates(ratesRes.data || []);
          setRoiSettings(roiRes || null);
          setTrustItems(trustRes.data || []);
          setCompanySettings(settingsRes || null);
          setLastUpdated(new Date());

          if (
            leadsRes.error ||
            solutionsRes.error ||
            projectsRes.error ||
            ratesRes.error ||
            trustRes.error
          ) {
            setDataError(
              leadsRes.error ||
                solutionsRes.error ||
                projectsRes.error ||
                ratesRes.error ||
                trustRes.error ||
                null
            );
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setDataError(err?.message || 'Error communicating with database');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    initialLoad();

    return () => {
      isMounted = false;
    };
  }, [isAdmin]);

  // Loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#070b14] flex flex-col items-center justify-center text-[#f8fafc] space-y-3">
        <RefreshCw className="w-8 h-8 text-[#f59e0b] animate-spin" />
        <p className="text-xs text-[#94a3b8] font-medium font-mono uppercase tracking-wider">
          Verifying credentials against admin_users table...
        </p>
      </div>
    );
  }

  // Not authenticated or not in admin_users -> show login screen
  if (!user || !isAdmin) {
    return <AdminLogin />;
  }

  const newLeadsCount = leads.filter((l) => l.status === 'new').length;

  return (
    <div className="min-h-screen bg-[#070b14] flex text-[#f8fafc] font-sans">
      {/* Sidebar Navigation */}
      <AdminSidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        newLeadsCount={newLeadsCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto h-screen">
        <AdminHeader
          currentTab={currentTab}
          isRefreshing={isRefreshing}
          onRefresh={handleRefreshData}
          lastUpdated={lastUpdated}
        />

        {/* Supabase unconfigured notification banner */}
        {!isSupabaseConfigured && (
          <div className="mx-8 mt-6 p-4 rounded-xl bg-[#162238] border border-[#f59e0b]/40 text-[#f8fafc] flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-4 h-4 text-[#f59e0b] shrink-0" />
              <div>
                <span className="font-bold text-[#f59e0b]">Supabase is in Preview Mode</span>
                <span className="text-[#94a3b8] ml-2">
                  NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are missing from environment variables. Running in local in-memory preview mode with full CRUD simulation.
                </span>
              </div>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#f59e0b]/20 text-[#f59e0b]">
              Preview Active
            </span>
          </div>
        )}

        <main className="flex-1 pb-16">
          {currentTab === 'overview' && (
            <OverviewView
              leads={leads}
              solutions={solutions}
              projects={projects}
              isLoading={isLoading}
              error={dataError}
              onNavigateToTab={(tab) => setCurrentTab(tab)}
            />
          )}

          {currentTab === 'leads' && (
            <LeadsView
              leads={leads}
              isLoading={isLoading}
              error={dataError}
              onRefresh={handleRefreshData}
            />
          )}

          {currentTab === 'solutions' && (
            <SolutionsView
              solutions={solutions}
              isLoading={isLoading}
              error={dataError}
              onRefresh={handleRefreshData}
            />
          )}

          {currentTab === 'projects' && (
            <ProjectsView
              projects={projects}
              isLoading={isLoading}
              error={dataError}
              onRefresh={handleRefreshData}
            />
          )}

          {currentTab === 'energy_rates' && (
            <EnergyRatesView
              rates={rates}
              isLoading={isLoading}
              error={dataError}
              onRefresh={handleRefreshData}
            />
          )}

          {currentTab === 'roi_assumptions' && (
            <RoiAssumptionsView
              key={roiSettings?.updated_at || 'roi-assumptions'}
              initialSettings={roiSettings}
              onRefresh={handleRefreshData}
            />
          )}

          {currentTab === 'trust_items' && (
            <TrustItemsView
              items={trustItems}
              isLoading={isLoading}
              error={dataError}
              onRefresh={handleRefreshData}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsView
              key={companySettings?.updated_at || 'company-settings'}
              companySettings={companySettings}
              isLoading={isLoading}
              error={dataError}
              onRefresh={handleRefreshData}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <AdminAuthProvider>
      <AdminDashboardContent />
    </AdminAuthProvider>
  );
}
