import { useState, type FormEvent } from 'react';
import {
  CommuneSelect,
  ConsentCheckbox,
  Field,
  QuoteSuccessPanel,
  ServiceCheckboxes,
  SubmitButton,
  SubmitErrorAlert,
} from '@/components/quote/QuoteFormControls';
import { HOUSING_OPTIONS } from '@/data/quoteOptions';
import { SERVICES } from '@/data/siteContent';
import { useQuoteSubmission } from '@/hooks/useQuoteSubmission';
import { inputClass } from '@/lib/formStyles';
import type { PropertyType } from '@/lib/quoteRequests';
import { isValidEmail, isValidPhone, isValidSurface } from '@/lib/quoteValidation';

const SERVICE_OPTIONS = SERVICES.filter((service) => service.audiences.includes('particulier'));

interface FormValues {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  housing: '' | PropertyType;
  services: string[];
  surface: string;
  preferredDate: string;
  message: string;
  consent: boolean;
}

type FormErrors = Partial<Record<keyof FormValues, string>>;

const INITIAL_VALUES: FormValues = {
  fullName: '',
  email: '',
  phone: '',
  city: '',
  housing: '',
  services: [],
  surface: '',
  preferredDate: '',
  message: '',
  consent: false,
};

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  if (values.fullName.trim().length < 2) errors.fullName = 'Indiquez votre nom complet.';
  if (!isValidEmail(values.email)) errors.email = 'Indiquez une adresse e-mail valide.';
  if (!isValidPhone(values.phone)) errors.phone = 'Indiquez un numéro de téléphone valide.';
  if (!values.city) errors.city = 'Choisissez votre commune.';
  if (!values.housing) errors.housing = 'Indiquez le type de logement.';
  if (values.services.length === 0) errors.services = 'Sélectionnez au moins une prestation.';
  if (!isValidSurface(values.surface)) errors.surface = 'Indiquez une surface en m² (nombre entier).';
  if (!values.consent) errors.consent = 'Merci de confirmer pour que nous puissions traiter votre demande.';
  return errors;
}

export default function ParticulierQuoteForm() {
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<FormErrors>({});
  const { status, setStatus, send } = useQuoteSubmission();

  const updateField = <K extends keyof FormValues>(key: K, value: FormValues[K]) => {
    setValues((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => ({ ...previous, [key]: undefined }));
  };

  const toggleService = (title: string) => {
    const next = values.services.includes(title)
      ? values.services.filter((service) => service !== title)
      : [...values.services, title];
    updateField('services', next);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const sent = await send({
      client_type: 'particulier',
      full_name: values.fullName.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      city: values.city,
      services: values.services,
      property_type: values.housing || null,
      surface_m2: values.surface ? Number(values.surface) : null,
      preferred_date: values.preferredDate || null,
      message: values.message.trim() || null,
      company_name: null,
      siret: null,
      frequency: null,
    });
    if (sent) setValues(INITIAL_VALUES);
  };

  if (status === 'success') {
    return <QuoteSuccessPanel onReset={() => setStatus('idle')} />;
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Nom complet" error={errors.fullName}>
          <input
            type="text"
            autoComplete="name"
            maxLength={120}
            value={values.fullName}
            onChange={(e) => updateField('fullName', e.target.value)}
            className={inputClass(!!errors.fullName)}
          />
        </Field>
        <Field label="Adresse e-mail" error={errors.email}>
          <input
            type="email"
            autoComplete="email"
            maxLength={200}
            value={values.email}
            onChange={(e) => updateField('email', e.target.value)}
            className={inputClass(!!errors.email)}
          />
        </Field>
        <Field label="Téléphone" error={errors.phone}>
          <input
            type="tel"
            autoComplete="tel"
            maxLength={30}
            value={values.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            className={inputClass(!!errors.phone)}
          />
        </Field>
        <CommuneSelect value={values.city} onChange={(value) => updateField('city', value)} error={errors.city} />
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <Field label="Type de logement" error={errors.housing}>
          <select
            value={values.housing}
            onChange={(e) => updateField('housing', e.target.value as FormValues['housing'])}
            className={inputClass(!!errors.housing)}
          >
            <option value="">Choisissez un type</option>
            {HOUSING_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Surface en m² (facultatif)" error={errors.surface}>
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={values.surface}
            onChange={(e) => updateField('surface', e.target.value)}
            className={inputClass(!!errors.surface)}
          />
        </Field>
      </div>

      <div className="mt-8">
        <ServiceCheckboxes
          services={SERVICE_OPTIONS}
          selected={values.services}
          onToggle={toggleService}
          error={errors.services}
        />
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <Field label="Date souhaitée (facultatif)">
          <input
            type="date"
            value={values.preferredDate}
            onChange={(e) => updateField('preferredDate', e.target.value)}
            className={inputClass(false)}
          />
        </Field>
      </div>

      <div className="mt-6">
        <Field label="Précisions (facultatif)">
          <textarea
            rows={4}
            maxLength={2000}
            value={values.message}
            onChange={(e) => updateField('message', e.target.value)}
            className={`${inputClass(false)} resize-y`}
          />
        </Field>
      </div>

      <div className="mt-8">
        <ConsentCheckbox
          checked={values.consent}
          onChange={(checked) => updateField('consent', checked)}
          error={errors.consent}
        />
      </div>

      {status === 'error' && <SubmitErrorAlert />}
      <SubmitButton isSubmitting={status === 'submitting'} />
    </form>
  );
}
