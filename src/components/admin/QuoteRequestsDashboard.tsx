import { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertCircle, Download, Loader2, LogOut, RefreshCw } from 'lucide-react';
import Logo from '@/components/Logo';
import QuoteRequestDetail from '@/components/admin/QuoteRequestDetail';
import QuoteRequestList from '@/components/admin/QuoteRequestList';
import { downloadQuoteRequestsCsv } from '@/lib/quoteRequestsExport';
import { fetchQuoteRequests, type QuoteRequestRecord } from '@/lib/quoteRequestsAdmin';
import type { ClientType } from '@/lib/quoteRequests';

type ClientFilter = 'all' | ClientType;

const FILTERS: { value: ClientFilter; label: string }[] = [
  { value: 'all', label: 'Toutes' },
  { value: 'particulier', label: 'Particuliers' },
  { value: 'professionnel', label: 'Professionnels' },
];

interface QuoteRequestsDashboardProps {
  onSignOut: () => void;
  isSigningOut: boolean;
  signOutError: string | null;
}

export default function QuoteRequestsDashboard({ onSignOut, isSigningOut, signOutError }: QuoteRequestsDashboardProps) {
  const [requests, setRequests] = useState<QuoteRequestRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [filter, setFilter] = useState<ClientFilter>('all');
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const loadRequests = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      setRequests(await fetchQuoteRequests());
    } catch {
      setLoadError('Impossible de charger les demandes. Vérifiez votre connexion puis réessayez.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadRequests();
  }, [loadRequests]);

  const visibleRequests = useMemo(
    () => (filter === 'all' ? requests : requests.filter((request) => request.client_type === filter)),
    [requests, filter],
  );

  const selectedRequest = requests.find((request) => request.id === selectedId) ?? null;

  const countFor = (value: ClientFilter) =>
    value === 'all' ? requests.length : requests.filter((request) => request.client_type === value).length;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="flex items-center gap-4">
            <Logo />
            <span className="hidden h-6 w-px bg-slate-300 sm:block" aria-hidden="true" />
            <span className="text-sm font-semibold uppercase tracking-widest text-slate-500">Administration</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => downloadQuoteRequestsCsv(requests)}
              disabled={requests.length === 0}
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50 disabled:opacity-50"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Exporter (CSV)
            </button>
            <button
              type="button"
              onClick={() => void loadRequests()}
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50 disabled:opacity-70"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} aria-hidden="true" />
              Actualiser
            </button>
            <button
              type="button"
              onClick={onSignOut}
              disabled={isSigningOut}
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:opacity-70"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Se déconnecter
            </button>
          </div>
        </div>
        {signOutError && (
          <p role="alert" className="mx-auto flex max-w-7xl items-center gap-2 px-5 pb-4 text-sm text-red-700 sm:px-8">
            <AlertCircle className="h-4 w-4" aria-hidden="true" />
            {signOutError}
          </p>
        )}
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold leading-[1.2] text-slate-900">Demandes de devis</h1>
            <p className="mt-2 text-base leading-normal text-slate-600">
              {requests.length} demande{requests.length > 1 ? 's' : ''} reçue{requests.length > 1 ? 's' : ''}
            </p>
          </div>

          <div role="tablist" aria-label="Filtrer par type de client" className="flex flex-wrap gap-2">
            {FILTERS.map((option) => {
              const isActive = filter === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setFilter(option.value)}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
                    isActive
                      ? 'bg-teal-700 text-white shadow-sm'
                      : 'border border-slate-300 bg-white text-slate-700 hover:border-slate-400'
                  }`}
                >
                  {option.label}
                  <span className={isActive ? 'text-teal-100' : 'text-slate-500'}>{countFor(option.value)}</span>
                </button>
              );
            })}
          </div>
        </div>

        {loadError && (
          <div role="alert" className="mt-8 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            {loadError}
          </div>
        )}

        {isLoading && requests.length === 0 ? (
          <div className="mt-16 flex items-center justify-center gap-3 text-base text-slate-600">
            <Loader2 className="h-5 w-5 animate-spin text-teal-700" aria-hidden="true" />
            Chargement des demandes...
          </div>
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <QuoteRequestList requests={visibleRequests} selectedId={selectedId} onSelect={setSelectedId} />
            </div>
            <div className="lg:col-span-7">
              {selectedRequest ? (
                <QuoteRequestDetail request={selectedRequest} />
              ) : (
                <div className="flex h-full min-h-64 items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-base text-slate-500">
                  Sélectionnez une demande pour voir son détail.
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
