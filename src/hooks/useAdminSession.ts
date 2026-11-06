import { useCallback, useEffect, useState } from 'react';
import { fetchAdminSession, type AdminSession } from '@/lib/adminAuth';

export type AdminStatus = 'loading' | 'signed_out' | 'admin' | 'error';

export function useAdminSession() {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [status, setStatus] = useState<AdminStatus>('loading');

  const refresh = useCallback(async () => {
    setStatus('loading');
    try {
      const nextSession = await fetchAdminSession();
      setSession(nextSession);
      setStatus(nextSession.authenticated ? 'admin' : 'signed_out');
    } catch {
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { session, status, refresh };
}
