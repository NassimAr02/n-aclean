import { supabase } from '@/lib/supabase';
import type { QuoteRequestPayload } from '@/lib/quoteRequests';

export interface QuoteRequestRecord extends QuoteRequestPayload {
  id: string;
  created_at: string;
}

export async function fetchQuoteRequests(): Promise<QuoteRequestRecord[]> {
  const { data, error } = await supabase
    .from('quote_requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as QuoteRequestRecord[];
}
