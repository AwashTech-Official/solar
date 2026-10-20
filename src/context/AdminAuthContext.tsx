'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, checkIsAdmin, isSupabaseConfigured } from '@/src/lib/supabase';

export interface RawAuthError {
  status?: number;
  code?: string;
  message?: string;
}

interface AdminAuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
  rawError: RawAuthError | null;
  isConfigured: boolean;
  signIn: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  user: null,
  session: null,
  isAdmin: false,
  loading: true,
  error: null,
  rawError: null,
  isConfigured: false,
  signIn: async () => ({ success: false, error: 'Not initialized' }),
  signOut: async () => {},
  refreshAuth: async () => {},
});

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(() => Boolean(supabase));
  const [error, setError] = useState<string | null>(null);
  const [rawError, setRawError] = useState<RawAuthError | null>(null);

  const verifyAdminStatus = useCallback(async (currentSession: Session | null) => {
    if (!currentSession?.user) {
      setUser(null);
      setSession(null);
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    const currentUser = currentSession.user;
    setUser(currentUser);
    setSession(currentSession);

    // Verify auth.uid() against admin_users.user_id strictly (no role column)
    const result = await checkIsAdmin(currentUser.id);
    if (result.isAdmin) {
      setIsAdmin(true);
      setError(null);
    } else {
      setIsAdmin(false);
      setError('Signed in, but not authorized in the export admin registry.');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    let isMounted = true;

    // Initial session verification
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      if (isMounted) {
        verifyAdminStatus(initialSession);
      }
    }).catch((err) => {
      console.error('Session retrieval error:', err);
      if (isMounted) setLoading(false);
    });

    // Subscribe to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      if (isMounted) {
        verifyAdminStatus(currentSession);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [verifyAdminStatus]);

  const signIn = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    // If running in preview mode without live Supabase credentials configured
    if (!supabase) {
      if (!email.trim() || !pass.trim()) {
        const msg = 'Please enter both email and password.';
        console.warn('Login validation warning:', msg);
        return { success: false, error: msg };
      }
      const mockUser = {
        id: 'solar-epc-admin-01',
        email: email.trim(),
        user_metadata: { full_name: 'Solar EPC Chief Engineer' },
        app_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      } as unknown as User;

      setUser(mockUser);
      setIsAdmin(true);
      setError(null);
      setLoading(false);
      return { success: true };
    }

    setLoading(true);
    setError(null);
    setRawError(null);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: pass,
      });

      if (authError) {
        // Log the raw error to the console as required
        console.warn('Raw authentication error:', authError);
        setLoading(false);
        setRawError({
          status: (authError as any).status,
          code: (authError as any).code,
          message: authError.message,
        });

        const errorMsg = String(authError.message || '').toLowerCase();
        const isNetworkError =
          errorMsg.includes('failed to fetch') ||
          errorMsg.includes('network') ||
          authError.status === 0;

        const isWrongCredentials =
          errorMsg.includes('invalid login credentials') ||
          errorMsg.includes('invalid credentials') ||
          errorMsg.includes('invalid grant') ||
          authError.status === 400;

        const isEmailNotConfirmed =
          errorMsg.includes('email not confirmed') ||
          authError.code === 'email_not_confirmed';

        const displayMessage = isNetworkError
          ? 'Unable to reach the server — check your connection and try again'
          : isEmailNotConfirmed
          ? 'Email not confirmed. Please check your email inbox or confirm your account in Supabase.'
          : isWrongCredentials
          ? 'Invalid email or password. Please check your credentials.'
          : (authError.message || 'Authentication failed. Please verify credentials.');

        setError(displayMessage);
        return { success: false, error: displayMessage };
      }

      if (!data.user) {
        const msg = 'No user profile returned from authentication service.';
        console.warn('Login error: missing user profile in response', data);
        setLoading(false);
        setError(msg);
        return { success: false, error: msg };
      }

      // Check auth.uid() strictly against admin_users.user_id (no role column)
      const adminCheck = await checkIsAdmin(data.user.id);
      if (!adminCheck.isAdmin) {
        console.warn('Admin authorization failed for user ID:', data.user.id);
        await supabase.auth.signOut();
        setUser(null);
        setSession(null);
        setIsAdmin(false);
        setLoading(false);
        const notAuthMsg = 'Signed in, but not authorized in the export admin registry.';
        setError(notAuthMsg);
        return { success: false, error: notAuthMsg };
      }

      setUser(data.user);
      setSession(data.session);
      setIsAdmin(true);
      setLoading(false);
      return { success: true };
    } catch (err: any) {
      // Raw error logging for complete visibility
      console.warn('Raw sign-in exception caught:', err);
      setLoading(false);
      setRawError({
        status: err?.status,
        code: err?.code,
        message: err?.message,
      });

      const errorMsg = String(err?.message || err || '').toLowerCase();
      const isNetworkError =
        errorMsg.includes('failed to fetch') ||
        errorMsg.includes('network') ||
        err?.name === 'TypeError' ||
        err?.code === 'ECONNREFUSED';

      const isWrongCredentials =
        errorMsg.includes('invalid login credentials') ||
        errorMsg.includes('invalid credentials') ||
        errorMsg.includes('invalid grant');

      const userMessage = isNetworkError
        ? 'Unable to reach the server — check your connection and try again'
        : isWrongCredentials
        ? 'Invalid email or password. Please check your credentials.'
        : (err?.message || 'Authentication failed. Please verify credentials.');

      setError(userMessage);
      return { success: false, error: userMessage };
    }
  };

  const signOut = async () => {
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error('Sign-out error:', err);
      }
    }
    setUser(null);
    setSession(null);
    setIsAdmin(false);
    setError(null);
  };

  const refreshAuth = async () => {
    if (!supabase) return;
    setLoading(true);
    try {
      const { data } = await supabase.auth.getSession();
      await verifyAdminStatus(data.session);
    } catch (err) {
      console.error('Refresh auth error:', err);
      setLoading(false);
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        session,
        isAdmin,
        loading,
        error,
        rawError,
        isConfigured: isSupabaseConfigured,
        signIn,
        signOut,
        refreshAuth,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
