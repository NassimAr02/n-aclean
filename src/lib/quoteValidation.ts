const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

export function isValidPhone(value: string): boolean {
  return value.trim().length >= 6;
}

export function isValidSurface(value: string): boolean {
  return value === '' || (/^\d+$/.test(value) && Number(value) >= 1);
}

export function isValidSiret(value: string): boolean {
  return value === '' || /^\d{14}$/.test(value);
}
