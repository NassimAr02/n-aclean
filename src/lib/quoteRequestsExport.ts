import type { QuoteRequestRecord } from '@/lib/quoteRequestsAdmin';
import { FREQUENCY_LABELS, PROPERTY_LABELS } from '@/data/quoteOptions';

const CSV_HEADERS = [
  'Date de réception',
  'Type de client',
  'Nom ou raison sociale',
  'Contact',
  'Email',
  'Téléphone',
  'Commune',
  'SIRET',
  'Type de logement ou de locaux',
  'Surface (m2)',
  'Fréquence',
  'Date souhaitée',
  'Prestations',
  'Précisions',
];

const FORMULA_START = /^[=+\-@\t\r]/;

function escapeCell(value: string | number | null): string {
  if (value === null) return '';
  let text = String(value);
  if (FORMULA_START.test(text)) text = `'${text}`;
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function toCsvRow(request: QuoteRequestRecord): (string | number | null)[] {
  const isPro = request.client_type === 'professionnel';
  return [
    new Date(request.created_at).toISOString().replace('T', ' ').slice(0, 19),
    isPro ? 'Professionnel' : 'Particulier',
    isPro ? request.company_name : request.full_name,
    isPro ? request.full_name : null,
    request.email,
    request.phone,
    request.city,
    request.siret,
    request.property_type ? PROPERTY_LABELS[request.property_type] : null,
    request.surface_m2,
    request.frequency ? FREQUENCY_LABELS[request.frequency] : null,
    request.preferred_date,
    request.services.join(' ; '),
    request.message,
  ];
}

export function buildQuoteRequestsCsv(requests: QuoteRequestRecord[]): string {
  const lines = [CSV_HEADERS, ...requests.map(toCsvRow)].map((row) => row.map(escapeCell).join(','));
  return `\uFEFF${lines.join('\r\n')}`;
}

export function downloadQuoteRequestsCsv(requests: QuoteRequestRecord[]): void {
  const blob = new Blob([buildQuoteRequestsCsv(requests)], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const today = new Date().toISOString().slice(0, 10);
  const link = document.createElement('a');
  link.href = url;
  link.download = `demandes-devis-${today}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
