import { getJson } from '@/lib/api';
import type { Frequency, PropertyType } from '@/lib/quoteRequests';

export interface QuoteRequestRecord {
  id: number;
  created_at: string;
  client_type: 'particulier' | 'professionnel';
  full_name: string;
  email: string;
  phone: string;
  city: string;
  services: string[];
  property_type: PropertyType | null;
  surface_m2: number | null;
  preferred_date: string | null;
  message: string | null;
  company_name: string | null;
  siret: string | null;
  frequency: Frequency | null;
}

export async function fetchQuoteRequests(): Promise<QuoteRequestRecord[]> {
  const data = await getJson<{ requests: QuoteRequestRecord[] }>('/api/admin/quote-requests.php');
  return data.requests;
}
