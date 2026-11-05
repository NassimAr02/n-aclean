import { Building2, Home, Inbox } from 'lucide-react';
import { formatDateTime } from '@/lib/dateFormat';
import type { QuoteRequestRecord } from '@/lib/quoteRequestsAdmin';

interface QuoteRequestListProps {
  requests: QuoteRequestRecord[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function QuoteRequestList({ requests, selectedId, onSelect }: QuoteRequestListProps) {
  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-3xl border border-slate-200 bg-white p-10 text-center">
        <Inbox className="h-10 w-10 text-slate-400" aria-hidden="true" />
        <p className="mt-4 text-base text-slate-600">Aucune demande pour le moment.</p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {requests.map((request) => {
        const isSelected = request.id === selectedId;
        const isPro = request.client_type === 'professionnel';
        const displayName = isPro && request.company_name ? request.company_name : request.full_name;
        const TypeIcon = isPro ? Building2 : Home;

        return (
          <li key={request.id}>
            <button
              type="button"
              onClick={() => onSelect(request.id)}
              aria-current={isSelected ? 'true' : undefined}
              className={`flex w-full flex-col gap-3 rounded-2xl border bg-white p-5 text-left transition-all duration-200 hover:border-teal-600 hover:shadow-md ${
                isSelected ? 'border-teal-700 ring-4 ring-teal-700/15' : 'border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <span className="min-w-0 truncate text-base font-semibold text-slate-900">{displayName}</span>
                <span
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                    isPro ? 'bg-sky-50 text-sky-800' : 'bg-teal-50 text-teal-800'
                  }`}
                >
                  <TypeIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  {isPro ? 'Professionnel' : 'Particulier'}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600">
                <span>{request.city}</span>
                <span aria-hidden="true">·</span>
                <span>{formatDateTime(request.created_at)}</span>
              </div>
              <span className="text-sm text-slate-500">
                {request.services.length} prestation{request.services.length > 1 ? 's' : ''} demandée
                {request.services.length > 1 ? 's' : ''}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
