import { useState } from 'react';
import { submitQuoteRequest, type QuoteRequestPayload } from '@/lib/quoteRequests';

export type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

export function useQuoteSubmission() {
  const [status, setStatus] = useState<SubmitStatus>('idle');

  const send = async (payload: QuoteRequestPayload): Promise<boolean> => {
    setStatus('submitting');
    try {
      await submitQuoteRequest(payload);
      setStatus('success');
      return true;
    } catch {
      setStatus('error');
      return false;
    }
  };

  return { status, setStatus, send };
}
