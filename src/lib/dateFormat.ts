const dateTimeFormatter = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short' });
const calendarDateFormatter = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' });

export const formatDateTime = (iso: string) => dateTimeFormatter.format(new Date(iso));

export const formatCalendarDate = (isoDate: string) => calendarDateFormatter.format(new Date(`${isoDate}T00:00:00`));
