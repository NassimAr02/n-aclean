import ParticulierQuoteForm from '@/components/quote/ParticulierQuoteForm';
import ProQuoteForm from '@/components/quote/ProQuoteForm';
import type { ClientType } from '@/lib/quoteRequests';

interface QuoteSectionProps {
  clientType: ClientType;
  onClientTypeChange: (type: ClientType) => void;
}

const CLIENT_TYPE_OPTIONS: { value: ClientType; label: string }[] = [
  { value: 'particulier', label: 'Je suis un particulier' },
  { value: 'professionnel', label: 'Je suis un professionnel' },
];

export default function QuoteSection({ clientType, onClientTypeChange }: QuoteSectionProps) {
  return (
    <section id="devis" className="scroll-mt-24 bg-slate-50 py-24">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <p className="text-sm font-semibold uppercase tracking-widest text-teal-700">Demande de devis</p>
          <h2 className="mt-3 text-3xl font-bold leading-[1.2] tracking-tight text-slate-900 sm:text-4xl">
            Parlez-nous de votre besoin
          </h2>
          <p className="mt-4 text-lg leading-normal text-slate-600">
            {clientType === 'particulier'
              ? 'Vitres, remise en état de votre logement après déménagement : quelques informations suffisent pour préparer votre devis.'
              : 'Bureaux, commerces et espaces communs : indiquez-nous vos locaux et votre fréquence, nous proposons une prestation adaptée.'}
          </p>
        </div>

        <div>
          <div className="mb-6 inline-flex rounded-full bg-white p-1 shadow-sm ring-1 ring-slate-200">
            {CLIENT_TYPE_OPTIONS.map((option) => {
              const isActive = clientType === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => onClientTypeChange(option.value)}
                  className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                    isActive ? 'bg-teal-700 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>

          {clientType === 'particulier' ? <ParticulierQuoteForm /> : <ProQuoteForm />}
        </div>
      </div>
    </section>
  );
}
