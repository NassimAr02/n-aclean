import type { Frequency, PropertyType } from '@/lib/quoteRequests';

export interface LabeledOption<T extends string> {
  value: T;
  label: string;
}

export const PROPERTY_LABELS: Record<PropertyType, string> = {
  appartement: 'Appartement',
  maison: 'Maison',
  bureaux: 'Bureaux',
  commerce: 'Commerce ou boutique',
  espaces_communs: 'Espaces communs (immeuble, copropriété)',
  locaux_activite: "Local d'activité",
  autre: 'Autre',
};

export const FREQUENCY_LABELS: Record<Frequency, string> = {
  ponctuelle: 'Ponctuelle (une seule fois)',
  hebdomadaire: 'Chaque semaine',
  bihebdomadaire: 'Deux fois par semaine',
  quotidienne: 'Chaque jour',
  mensuelle: 'Chaque mois',
  a_definir: 'Je ne sais pas encore',
};

const toOptions = <T extends string>(values: T[], labels: Record<T, string>): LabeledOption<T>[] =>
  values.map((value) => ({ value, label: labels[value] }));

export const HOUSING_OPTIONS = toOptions<PropertyType>(['appartement', 'maison', 'autre'], PROPERTY_LABELS);

export const PREMISES_OPTIONS = toOptions<PropertyType>(
  ['bureaux', 'commerce', 'espaces_communs', 'locaux_activite', 'autre'],
  PROPERTY_LABELS,
);

export const FREQUENCY_OPTIONS = toOptions<Frequency>(
  ['ponctuelle', 'hebdomadaire', 'bihebdomadaire', 'quotidienne', 'mensuelle', 'a_definir'],
  FREQUENCY_LABELS,
);
