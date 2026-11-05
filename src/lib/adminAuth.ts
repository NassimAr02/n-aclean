import { supabase } from '@/lib/supabase';

function translateAuthError(message: string): string {
  if (message.includes('Invalid login credentials')) return 'Email ou mot de passe incorrect.';
  if (message.includes('already registered')) return 'Un compte existe déjà avec cet email.';
  if (/at least \d+ characters/.test(message)) return 'Le mot de passe est trop court.';
  if (message.includes('Failed to fetch') || message.includes('NetworkError')) {
    return 'Connexion impossible. Vérifiez votre réseau et réessayez.';
  }
  return 'Une erreur est survenue. Merci de réessayer.';
}

export async function signInAdmin(email: string, password: string): Promise<void> {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(translateAuthError(error.message));
}

export async function signUpAdmin(email: string, password: string): Promise<boolean> {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw new Error(translateAuthError(error.message));
  return data.session !== null;
}

export async function signOutAdmin(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(translateAuthError(error.message));
}

export async function fetchIsAdmin(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('admin_users')
    .select('user_id')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data !== null;
}
