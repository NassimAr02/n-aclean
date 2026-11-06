import { getJson, postJson } from '@/lib/api';

export interface AdminSession {
  authenticated: boolean;
  email: string | null;
  needsSetup: boolean;
}

export function fetchAdminSession(): Promise<AdminSession> {
  return getJson<AdminSession>('/api/admin/session.php');
}

export async function loginAdmin(email: string, password: string): Promise<void> {
  await postJson('/api/admin/login.php', { email, password });
}

export async function setupAdmin(email: string, password: string, setupToken: string): Promise<void> {
  await postJson('/api/admin/setup.php', { email, password, setup_token: setupToken });
}

export async function logoutAdmin(): Promise<void> {
  await postJson('/api/admin/logout.php', {});
}
