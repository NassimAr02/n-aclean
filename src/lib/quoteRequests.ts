import { supabase } from '@/lib/supabase';

export type ClientType = 'particulier' | 'professionnel';

export type PropertyType =
  | 'appartement'
  | 'maison'
  | 'bureaux'
  | 'commerce'
  | 'espaces_communs'
  | 'locaux_activite'
  | 'autre';

export type Frequency = 'ponctuelle' | 'hebdomadaire' | 'bihebdomadaire' | 'quotidienne' | 'mensuelle' | 'a_definir';

export interface QuoteRequestPayload {
  client_type: ClientType;
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

export async function submitQuoteRequest(payload: QuoteRequestPayload): Promise<void> {
  const { data, error } = await supabase.functions.invoke<{ ok?: boolean }>('submit-quote-request', {
    body: payload,
  });

  if (error || !data?.ok) {
    throw new Error(error?.message ?? 'Quote request failed');
  }
}
