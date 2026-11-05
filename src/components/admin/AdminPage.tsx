import { useState, type ReactNode } from 'react';
import { AlertCircle, Loader2, LogOut } from 'lucide-react';
import AdminLoginForm from '@/components/admin/AdminLoginForm';
import QuoteRequestsDashboard from '@/components/admin/QuoteRequestsDashboard';
import Logo from '@/components/Logo';
import { signOutAdmin } from '@/lib/adminAuth';
import { useAdminSession } from '@/hooks/useAdminSession';

function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-900 antialiased">
      <header className="px-5 py-6 sm:px-8">
        <Logo />
      </header>
      <div className="flex flex-1 items-start justify-center px-5 pb-16 pt-6 sm:items-center sm:pt-0">{children}</div>
    </div>
  );
}

function AdminStatusPanel({ title, message, children }: { title: string; message: string; children?: ReactNode }) {
  return (
    <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-10">
      <h1 className="text-2xl font-bold leading-[1.2] text-slate-900">{title}</h1>
      <p className="mt-3 text-base leading-normal text-slate-600">{message}</p>
      {children}
    </div>
  );
}

export default function AdminPage() {
  const { session, status } = useAdminSession();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState<string | null>(null);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    setSignOutError(null);
    try {
      await signOutAdmin();
    } catch (caughtError) {
      setSignOutError(caughtError instanceof Error ? caughtError.message : 'Déconnexion impossible.');
    } finally {
      setIsSigningOut(false);
    }
  };

  if (status === 'loading') {
    return (
      <AdminShell>
        <div className="flex items-center gap-3 text-base text-slate-600">
          <Loader2 className="h-5 w-5 animate-spin text-teal-700" aria-hidden="true" />
          Chargement de l'espace administration...
        </div>
      </AdminShell>
    );
  }

  if (status === 'signed_out') {
    return (
      <AdminShell>
        <AdminLoginForm />
      </AdminShell>
    );
  }

  if (status === 'admin') {
    return <QuoteRequestsDashboard onSignOut={handleSignOut} isSigningOut={isSigningOut} signOutError={signOutError} />;
  }

  return (
    <AdminShell>
      <AdminStatusPanel
        title={status === 'error' ? 'Vérification impossible' : 'Accès non autorisé'}
        message={
          status === 'error'
            ? 'Nous n\'avons pas pu vérifier votre accès. Vérifiez votre connexion puis reconnectez-vous.'
            : `Le compte ${session?.user.email ?? ''} n'a pas encore accès aux demandes de devis. Demandez au propriétaire du site de l'activer.`
        }
      >
        {status === 'not_admin' && session && (
          <p className="mt-6 break-all rounded-xl bg-slate-100 px-4 py-3 font-mono text-sm text-slate-700">
            Identifiant : {session.user.id}
          </p>
        )}
        <div className="mt-8 flex flex-col items-center gap-4">
          {signOutError && (
            <p role="alert" className="flex items-center gap-2 text-sm text-red-700">
              <AlertCircle className="h-4 w-4" aria-hidden="true" />
              {signOutError}
            </p>
          )}
          <button
            type="button"
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50 disabled:opacity-70"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Se déconnecter
          </button>
        </div>
      </AdminStatusPanel>
    </AdminShell>
  );
}
