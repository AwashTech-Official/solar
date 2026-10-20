'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Lock, Mail, ShieldAlert, ArrowLeft, RefreshCw, KeyRound, AlertTriangle, Bug } from 'lucide-react';
import { useAdminAuth } from '@/src/context/AdminAuthContext';
import { supabaseHost } from '@/src/lib/supabase';
import { siteConfig } from '@/src/config/site';

export const AdminLogin: React.FC = () => {
  const { signIn, error, rawError, isConfigured } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isDebug, setIsDebug] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('debug') === '1') {
      const timer = setTimeout(() => setIsDebug(true), 0);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!isConfigured) {
      setLocalError('Supabase is not configured. Please configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
      return;
    }

    if (!email.trim() || !password.trim()) {
      setLocalError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    const res = await signIn(email, password);
    setLoading(false);

    if (!res.success) {
      setLocalError(res.error || 'Authentication failed. Please verify credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-[#f8fafc]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs text-[#94a3b8] hover:text-[#f8fafc] transition-colors mb-6 ml-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to {siteConfig.businessName} Website</span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#162238] border border-[#f59e0b]/40 text-[#f59e0b] shadow-lg shadow-black/40">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#f8fafc] font-heading">
              {siteConfig.businessName}
            </h1>
            <p className="text-xs text-[#94a3b8] font-medium">
              Commercial Solar EPC & Operations Portal
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#0e1626] border border-[rgba(241,245,249,0.12)] py-8 px-6 shadow-2xl rounded-2xl sm:px-10">
          <div className="mb-6 pb-4 border-b border-[rgba(241,245,249,0.08)]">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#f59e0b]">
              <Lock className="w-3.5 h-3.5" />
              <span>Admin Access Verification</span>
            </div>
            <h2 className="text-lg font-bold text-[#f8fafc] font-heading mt-1">Sign In to Dashboard</h2>
            <p className="text-xs text-[#94a3b8] mt-1">
              Access is verified strictly via admin_users where user_id matches authenticated account.
            </p>
          </div>

          {!isConfigured && (
            <div className="mb-6 p-4 rounded-xl bg-[#162238] border border-[#f59e0b]/40 text-[#f8fafc] text-xs space-y-2.5">
              <div className="flex items-center gap-2 font-semibold text-[#f59e0b]">
                <AlertTriangle className="w-4 h-4 text-[#f59e0b] shrink-0" />
                <span>Supabase is not configured</span>
              </div>
              <p className="text-[#94a3b8] leading-relaxed">
                NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are not set in the environment. Set your credentials in the environment variables panel to sync with your live database.
              </p>
            </div>
          )}

          {(localError || error) && (
            <div className="mb-6 p-4 rounded-xl bg-rose-950/40 border border-rose-500/50 text-[#f8fafc] text-xs space-y-1.5 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 font-semibold text-rose-300">
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Authentication Notice</span>
              </div>
              <p className="text-[#94a3b8] leading-relaxed">{localError || error}</p>
            </div>
          )}

          {isDebug && (
            <div className="mb-6 p-4 rounded-xl bg-[#070b14] border border-[#f59e0b]/40 text-xs font-mono space-y-1.5 text-[#f8fafc] animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-[#f59e0b] font-bold uppercase tracking-wider text-[11px] mb-2 pb-1 border-b border-[rgba(241,245,249,0.1)]">
                <Bug className="w-3.5 h-3.5" />
                <span>Diagnostics (?debug=1 active)</span>
              </div>
              <div>
                <span className="text-[#94a3b8]">Supabase Host: </span>
                <span className="text-white font-semibold">{supabaseHost}</span>
              </div>
              <div>
                <span className="text-[#94a3b8]">Raw Status: </span>
                <span className="text-[#f8fafc]">{rawError?.status ?? 'None'}</span>
              </div>
              <div>
                <span className="text-[#94a3b8]">Raw Code: </span>
                <span className="text-[#f8fafc]">{rawError?.code ?? 'None'}</span>
              </div>
              <div>
                <span className="text-[#94a3b8]">Raw Message: </span>
                <span className="text-[#f8fafc]">{rawError?.message ?? 'None'}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#f8fafc] mb-1">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#94a3b8] absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  disabled={!isConfigured}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@soleth-solar.com"
                  className="w-full bg-[#070b14] border border-[rgba(241,245,249,0.15)] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:border-transparent transition-all placeholder:text-[#64748b] disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#f8fafc] mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#94a3b8] absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  disabled={!isConfigured}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#070b14] border border-[rgba(241,245,249,0.15)] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:border-transparent transition-all placeholder:text-[#64748b] disabled:opacity-50"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || !isConfigured}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#f59e0b] hover:bg-[#d97706] text-[#070b14] text-xs font-bold uppercase tracking-wider transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer shadow-md shadow-[#f59e0b]/20"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Sign In As Administrator</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
