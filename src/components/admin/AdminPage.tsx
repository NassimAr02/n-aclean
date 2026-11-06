import { useState, type ReactNode } from 'react';
import { AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import AdminLoginForm from '@/components/admin/AdminLoginForm';
import QuoteRequestsDashboard from '@/components/admin/QuoteRequestsDashboard';
import Logo from '@/components/Logo';
import { logoutAdmin } from '@/lib/adminAuth';
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

export default function AdminPage() {
  const { session, status, refresh } = useAdminSession();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState<string | null>(null);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    setSignOutError(null);
    try {
      await logoutAdmin();
      await refresh();
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

  if (status === 'signed_out' && session) {
    return (
      <AdminShell>
        <AdminLoginForm needsSetup={session.needsSetup} onAuthenticated={() => void refresh()} />
      </AdminShell>
    );
  }

  if (status === 'admin') {
    return <QuoteRequestsDashboard onSignOut={handleSignOut} isSigningOut={isSigningOut} signOutError={signOutError} />;
  }

  return (
    <AdminShell>
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-10">
        <AlertCircle className="mx-auto h-10 w-10 text-red-700" aria-hidden="true" />
        <h1 className="mt-4 text-2xl font-bold leading-[1.2] text-slate-900">Espace indisponible</h1>
        <p className="mt-3 text-base leading-normal text-slate-600">
          Nous n'avons pas pu vérifier votre accès. Vérifiez votre connexion puis réessayez.
        </p>
        <button
          type="button"
          onClick={() => void refresh()}
          className="mt-8 inline-flex items-center gap-2 rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Réessayer
        </button>
      </div>
    </AdminShell>
  );
}
