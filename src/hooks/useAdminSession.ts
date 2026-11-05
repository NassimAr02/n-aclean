import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { fetchIsAdmin } from '@/lib/adminAuth';
import { supabase } from '@/lib/supabase';

export type AdminStatus = 'loading' | 'signed_out' | 'not_admin' | 'admin' | 'error';

export function useAdminSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [status, setStatus] = useState<AdminStatus>('loading');

  useEffect(() => {
    let isActive = true;

    const resolveSession = async (nextSession: Session | null) => {
      if (!isActive) return;
      setSession(nextSession);

      if (!nextSession) {
        setStatus('signed_out');
        return;
      }

      setStatus('loading');
      try {
        const isAdmin = await fetchIsAdmin(nextSession.user.id);
        if (isActive) setStatus(isAdmin ? 'admin' : 'not_admin');
      } catch {
        if (isActive) setStatus('error');
      }
    };

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      (async () => {
        await resolveSession(nextSession);
      })();
    });

    return () => {
      isActive = false;
      data.subscription.unsubscribe();
    };
  }, []);

  return { session, status };
}
