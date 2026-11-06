const GENERIC_ERROR = 'Une erreur est survenue. Merci de réessayer.';

function errorMessageFrom(data: unknown): string {
  if (typeof data === 'object' && data !== null && 'error' in data && typeof data.error === 'string') {
    return data.error;
  }
  return GENERIC_ERROR;
}

async function request<T>(path: string, init: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(path, init);
  } catch {
    throw new Error('Connexion impossible. Vérifiez votre réseau et réessayez.');
  }

  const data: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(errorMessageFrom(data));
  }
  if (data === null) {
    throw new Error(GENERIC_ERROR);
  }
  return data as T;
}

export function getJson<T>(path: string): Promise<T> {
  return request<T>(path, { method: 'GET', headers: { Accept: 'application/json' } });
}

export function postJson<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
  });
}
