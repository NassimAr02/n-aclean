import { useState, type FormEvent } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Field } from '@/components/quote/QuoteFormControls';
import { loginAdmin, setupAdmin } from '@/lib/adminAuth';
import { inputClass } from '@/lib/formStyles';
import { isValidEmail } from '@/lib/quoteValidation';

const MIN_SETUP_PASSWORD_LENGTH = 10;

interface AdminLoginFormProps {
  needsSetup: boolean;
  onAuthenticated: () => void;
}

export default function AdminLoginForm({ needsSetup, onAuthenticated }: AdminLoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [setupToken, setSetupToken] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const trimmedEmail = email.trim();
    if (!isValidEmail(trimmedEmail)) {
      setError('Merci de saisir une adresse email valide.');
      return;
    }
    if (needsSetup && password.length < MIN_SETUP_PASSWORD_LENGTH) {
      setError(`Le mot de passe doit contenir au moins ${MIN_SETUP_PASSWORD_LENGTH} caractères.`);
      return;
    }
    if (!password) {
      setError('Merci de saisir votre mot de passe.');
      return;
    }
    if (needsSetup && !setupToken.trim()) {
      setError("Merci de saisir le code d'activation.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (needsSetup) {
        await setupAdmin(trimmedEmail, password, setupToken.trim());
      } else {
        await loginAdmin(trimmedEmail, password);
      }
      onAuthenticated();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Une erreur est survenue. Merci de réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
      <h1 className="text-2xl font-bold leading-[1.2] text-slate-900">
        {needsSetup ? 'Créer le compte administrateur' : 'Espace administration'}
      </h1>
      <p className="mt-3 text-base leading-normal text-slate-600">
        {needsSetup
          ? "Aucun compte n'existe encore. Renseignez le code d'activation défini lors de l'installation du site."
          : 'Connectez-vous pour consulter les demandes de devis.'}
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-8 flex flex-col gap-5">
        <Field label="Email">
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={inputClass(false)}
          />
        </Field>
        <Field label="Mot de passe">
          <input
            type="password"
            autoComplete={needsSetup ? 'new-password' : 'current-password'}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={inputClass(false)}
          />
        </Field>
        {needsSetup && (
          <Field label="Code d'activation">
            <input
              type="password"
              autoComplete="off"
              value={setupToken}
              onChange={(event) => setSetupToken(event.target.value)}
              className={inputClass(false)}
            />
          </Field>
        )}

        {error && (
          <div role="alert" className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-teal-700 px-8 py-4 text-base font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-teal-800 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
        >
          {isSubmitting && <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />}
          {isSubmitting ? 'Veuillez patienter...' : needsSetup ? 'Créer le compte' : 'Se connecter'}
        </button>
      </form>
    </div>
  );
}
