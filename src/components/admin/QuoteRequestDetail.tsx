import type { ReactNode } from 'react';
import { Mail, Phone } from 'lucide-react';
import { FREQUENCY_LABELS, PROPERTY_LABELS } from '@/data/quoteOptions';
import { formatCalendarDate, formatDateTime } from '@/lib/dateFormat';
import type { QuoteRequestRecord } from '@/lib/quoteRequestsAdmin';

function DetailRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-1 py-4 sm:grid-cols-[11rem_1fr] sm:gap-4">
      <dt className="text-sm font-semibold text-slate-500">{label}</dt>
      <dd className="text-base text-slate-900">{children}</dd>
    </div>
  );
}

export default function QuoteRequestDetail({ request }: { request: QuoteRequestRecord }) {
  const isPro = request.client_type === 'professionnel';
  const propertyLabel = request.property_type ? PROPERTY_LABELS[request.property_type] : null;
  const frequencyLabel = request.frequency ? FREQUENCY_LABELS[request.frequency] : null;

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <header className="flex flex-col gap-3 border-b border-slate-200 pb-6">
        <span className="text-sm text-slate-500">Reçue le {formatDateTime(request.created_at)}</span>
        <h2 className="text-2xl font-bold leading-[1.2] text-slate-900">
          {isPro && request.company_name ? request.company_name : request.full_name}
        </h2>
        {isPro && <p className="text-base text-slate-600">Contact : {request.full_name}</p>}
        <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <a
            href={`mailto:${request.email}`}
            className="inline-flex items-center gap-2 rounded-full bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-800"
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            {request.email}
          </a>
          <a
            href={`tel:${request.phone.replace(/\s/g, '')}`}
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            {request.phone}
          </a>
        </div>
      </header>

      <dl className="divide-y divide-slate-200">
        <DetailRow label="Commune">{request.city}</DetailRow>
        {isPro && request.siret && <DetailRow label="SIRET">{request.siret}</DetailRow>}
        {propertyLabel && <DetailRow label={isPro ? 'Type de locaux' : 'Type de logement'}>{propertyLabel}</DetailRow>}
        {request.surface_m2 !== null && <DetailRow label="Surface">{request.surface_m2} m²</DetailRow>}
        {frequencyLabel && <DetailRow label="Fréquence">{frequencyLabel}</DetailRow>}
        {request.preferred_date && (
          <DetailRow label={isPro ? 'Date de début' : 'Date souhaitée'}>
            {formatCalendarDate(request.preferred_date)}
          </DetailRow>
        )}
        <DetailRow label="Prestations">
          <ul className="flex flex-wrap gap-2">
            {request.services.map((service) => (
              <li key={service} className="rounded-full bg-teal-50 px-3 py-1 text-sm font-semibold text-teal-900">
                {service}
              </li>
            ))}
          </ul>
        </DetailRow>
        {request.message && (
          <DetailRow label="Précisions">
            <p className="whitespace-pre-line leading-normal">{request.message}</p>
          </DetailRow>
        )}
      </dl>
    </article>
  );
}
