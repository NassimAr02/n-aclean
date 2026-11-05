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
import { SERVICES } from '@/data/siteContent';
import { FREQUENCY_OPTIONS, PREMISES_OPTIONS } from '@/data/quoteOptions';
import { useQuoteSubmission } from '@/hooks/useQuoteSubmission';
import { inputClass } from '@/lib/formStyles';
import type { Frequency, PropertyType } from '@/lib/quoteRequests';
import { isValidEmail, isValidPhone, isValidSiret, isValidSurface } from '@/lib/quoteValidation';

interface FormValues {
  companyName: string;
  siret: string;
  contactName: string;
  email: string;
  phone: string;
  city: string;
  premises: '' | PropertyType;
  frequency: '' | Frequency;
  services: string[];
  surface: string;
  preferredDate: string;
  message: string;
  consent: boolean;
}

type FormErrors = Partial<Record<keyof FormValues, string>>;

const INITIAL_VALUES: FormValues = {
  companyName: '',
  siret: '',
  contactName: '',
  email: '',
  phone: '',
  city: '',
  premises: '',
  frequency: '',
  services: [],
  surface: '',
  preferredDate: '',
  message: '',
  consent: false,
};

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  if (values.companyName.trim().length < 2) errors.companyName = "Indiquez le nom de l'entreprise.";
  if (!isValidSiret(values.siret.replace(/\s/g, ''))) errors.siret = 'Le numéro SIRET doit contenir 14 chiffres.';
  if (values.contactName.trim().length < 2) errors.contactName = 'Indiquez le nom de la personne à contacter.';
  if (!isValidEmail(values.email)) errors.email = 'Indiquez une adresse e-mail professionnelle valide.';
  if (!isValidPhone(values.phone)) errors.phone = 'Indiquez un numéro de téléphone valide.';
  if (!values.city) errors.city = 'Choisissez la commune du site.';
  if (!values.premises) errors.premises = 'Indiquez le type de locaux.';
  if (!values.frequency) errors.frequency = 'Indiquez la fréquence souhaitée.';
  if (values.services.length === 0) errors.services = 'Sélectionnez au moins une prestation.';
  if (!isValidSurface(values.surface)) errors.surface = 'Indiquez une surface en m² (nombre entier).';
  if (!values.consent) errors.consent = 'Merci de confirmer pour que nous puissions traiter votre demande.';
  return errors;
}

export default function ProQuoteForm() {
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
      client_type: 'professionnel',
      full_name: values.contactName.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      city: values.city,
      services: values.services,
      property_type: values.premises || null,
      surface_m2: values.surface ? Number(values.surface) : null,
      preferred_date: values.preferredDate || null,
      message: values.message.trim() || null,
      company_name: values.companyName.trim(),
      siret: values.siret.replace(/\s/g, '') || null,
      frequency: values.frequency || null,
    });
    if (sent) setValues(INITIAL_VALUES);
  };

  if (status === 'success') {
    return <QuoteSuccessPanel onReset={() => setStatus('idle')} />;
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Nom de l'entreprise" error={errors.companyName}>
          <input
            type="text"
            autoComplete="organization"
            maxLength={160}
            value={values.companyName}
            onChange={(e) => updateField('companyName', e.target.value)}
            className={inputClass(!!errors.companyName)}
          />
        </Field>
        <Field label="SIRET (facultatif)" error={errors.siret}>
          <input
            type="text"
            inputMode="numeric"
            maxLength={17}
            value={values.siret}
            onChange={(e) => updateField('siret', e.target.value)}
            className={inputClass(!!errors.siret)}
          />
        </Field>
        <Field label="Personne à contacter" error={errors.contactName}>
          <input
            type="text"
            autoComplete="name"
            maxLength={120}
            value={values.contactName}
            onChange={(e) => updateField('contactName', e.target.value)}
            className={inputClass(!!errors.contactName)}
          />
        </Field>
        <Field label="E-mail professionnel" error={errors.email}>
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
        <Field label="Type de locaux" error={errors.premises}>
          <select
            value={values.premises}
            onChange={(e) => updateField('premises', e.target.value as FormValues['premises'])}
            className={inputClass(!!errors.premises)}
          >
            <option value="">Choisissez un type</option>
            {PREMISES_OPTIONS.map((option) => (
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
        <Field label="Fréquence souhaitée" error={errors.frequency}>
          <select
            value={values.frequency}
            onChange={(e) => updateField('frequency', e.target.value as FormValues['frequency'])}
            className={inputClass(!!errors.frequency)}
          >
            <option value="">Choisissez une fréquence</option>
            {FREQUENCY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Date de début souhaitée (facultatif)">
          <input
            type="date"
            value={values.preferredDate}
            onChange={(e) => updateField('preferredDate', e.target.value)}
            className={inputClass(false)}
          />
        </Field>
      </div>

      <div className="mt-8">
        <ServiceCheckboxes
          services={SERVICES}
          selected={values.services}
          onToggle={toggleService}
          error={errors.services}
        />
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
