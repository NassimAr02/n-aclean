import { useState, type FormEvent } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Field } from '@/components/quote/QuoteFormControls';
import { signInAdmin, signUpAdmin } from '@/lib/adminAuth';
import { inputClass } from '@/lib/formStyles';
import { isValidEmail } from '@/lib/quoteValidation';

const MIN_PASSWORD_LENGTH = 8;

type AuthMode = 'signin' | 'signup';

export default function AdminLoginForm() {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSignup = mode === 'signup';

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setError(null);
    setNotice(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setNotice(null);

    const trimmedEmail = email.trim();
    if (!isValidEmail(trimmedEmail)) {
      setError('Merci de saisir une adresse email valide.');
      return;
    }
    if (isSignup && password.length < MIN_PASSWORD_LENGTH) {
      setError(`Le mot de passe doit contenir au moins ${MIN_PASSWORD_LENGTH} caractères.`);
      return;
    }
    if (!password) {
      setError('Merci de saisir votre mot de passe.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isSignup) {
        const hasSession = await signUpAdmin(trimmedEmail, password);
        if (!hasSession) setNotice('Compte créé. Connectez-vous avec vos identifiants.');
      } else {
        await signInAdmin(trimmedEmail, password);
      }
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Une erreur est survenue. Merci de réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
      <h1 className="text-2xl font-bold leading-[1.2] text-slate-900">
        {isSignup ? 'Créer un accès administrateur' : 'Espace administration'}
      </h1>
      <p className="mt-3 text-base leading-normal text-slate-600">
        {isSignup
          ? 'Créez votre compte. Il ne donnera accès aux demandes qu\'après validation par le propriétaire du site.'
          : 'Connectez-vous pour consulter les demandes de devis.'}
      </p>

      <div role="tablist" aria-label="Mode de connexion" className="mt-6 grid grid-cols-2 rounded-full bg-slate-100 p-1">
        {(['signin', 'signup'] as const).map((value) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={mode === value}
            onClick={() => switchMode(value)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
              mode === value ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {value === 'signin' ? 'Se connecter' : 'Créer un compte'}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-5">
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
            autoComplete={isSignup ? 'new-password' : 'current-password'}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={inputClass(false)}
          />
        </Field>

        {error && (
          <div role="alert" className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            {error}
          </div>
        )}
        {notice && (
          <div role="status" className="rounded-xl border border-teal-200 bg-teal-50 p-4 text-sm text-teal-900">
            {notice}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-teal-700 px-8 py-4 text-base font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-teal-800 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
        >
          {isSubmitting && <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />}
          {isSubmitting ? 'Veuillez patienter...' : isSignup ? 'Créer mon compte' : 'Se connecter'}
        </button>
      </form>
    </div>
  );
}
