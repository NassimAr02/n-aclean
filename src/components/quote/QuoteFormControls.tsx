import type { ReactNode } from 'react';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { COVERED_CITIES, type Service } from '@/data/siteContent';
import { inputClass } from '@/lib/formStyles';

export function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-800">{label}</span>
      {children}
      {error && <span className="mt-2 block text-sm text-red-700">{error}</span>}
    </label>
  );
}

interface CommuneSelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function CommuneSelect({ value, onChange, error }: CommuneSelectProps) {
  return (
    <Field label="Commune" error={error}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass(!!error)}
      >
        <option value="">Choisissez votre commune</option>
        {COVERED_CITIES.map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </select>
    </Field>
  );
}

interface ServiceCheckboxesProps {
  services: Service[];
  selected: string[];
  onToggle: (title: string) => void;
  error?: string;
}

export function ServiceCheckboxes({ services, selected, onToggle, error }: ServiceCheckboxesProps) {
  return (
    <div>
      <span className="mb-3 block text-sm font-semibold text-slate-800">Prestations souhaitées</span>
      <div className="grid gap-3 sm:grid-cols-2">
        {services.map((service) => {
          const isChecked = selected.includes(service.title);
          return (
            <label
              key={service.title}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 text-sm font-semibold transition-colors duration-200 ${
                isChecked
                  ? 'border-teal-700 bg-teal-50 text-teal-900'
                  : 'border-slate-300 bg-white text-slate-800 hover:border-slate-400'
              }`}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => onToggle(service.title)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-teal-700"
              />
              {service.title}
            </label>
          );
        })}
      </div>
      {error && <span className="mt-2 block text-sm text-red-700">{error}</span>}
    </div>
  );
}

interface ConsentCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
}

export function ConsentCheckbox({ checked, onChange, error }: ConsentCheckboxProps) {
  return (
    <div>
      <label className="flex cursor-pointer items-start gap-3 text-sm leading-normal text-slate-700">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-1 h-4 w-4 shrink-0 accent-teal-700"
        />
        <span>J'accepte que les informations transmises soient utilisées pour traiter ma demande de devis.</span>
      </label>
      {error && <span className="mt-2 block text-sm text-red-700">{error}</span>}
    </div>
  );
}

export function SubmitErrorAlert() {
  return (
    <div
      role="alert"
      className="mt-8 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
    >
      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
      Une erreur est survenue lors de l'envoi. Merci de réessayer dans quelques instants.
    </div>
  );
}

export function SubmitButton({ isSubmitting }: { isSubmitting: boolean }) {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-teal-700 px-8 py-4 text-base font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-teal-800 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 sm:w-auto"
    >
      {isSubmitting && <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />}
      {isSubmitting ? 'Envoi en cours...' : 'Envoyer ma demande'}
    </button>
  );
}

export function QuoteSuccessPanel({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-teal-100 bg-white p-10 text-center shadow-sm">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-50 text-teal-700">
        <CheckCircle2 className="h-9 w-9" aria-hidden="true" />
      </span>
      <h3 className="mt-6 text-2xl font-bold leading-[1.2] text-slate-900">Merci, votre demande est envoyée</h3>
      <p className="mt-3 max-w-md text-base leading-normal text-slate-600">
        Nous avons bien reçu vos informations. Nous revenons vers vous rapidement pour préciser votre besoin.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-8 rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50"
      >
        Faire une autre demande
      </button>
    </div>
  );
}
