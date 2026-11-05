import { Building2, GlassWater, Truck, type LucideIcon } from 'lucide-react';
import type { ClientType } from '@/lib/quoteRequests';

export interface Service {
  title: string;
  description: string;
  audiences: ClientType[];
  highlights: string[];
  icon: LucideIcon;
}

export const SERVICES: Service[] = [
  {
    title: 'Vitres et vitrines',
    description:
      'Des surfaces vitrées nettes et sans traces, à l\'intérieur comme à l\'extérieur, pour votre logement ou votre commerce.',
    audiences: ['particulier', 'professionnel'],
    highlights: ['Fenêtres et baies vitrées', 'Intérieur et extérieur', 'Vitrines et surfaces en verre'],
    icon: GlassWater,
  },
  {
    title: 'Bureaux et espaces communs',
    description:
      'Un entretien soigné de vos locaux, planifié selon vos horaires pour ne pas gêner vos équipes ni vos visiteurs.',
    audiences: ['professionnel'],
    highlights: ['Postes de travail et sols', 'Sanitaires et cuisines', 'Couloirs, halls et parties communes'],
    icon: Building2,
  },
  {
    title: 'Remise en état après déménagement',
    description:
      'Un logement ou des locaux rendus propres et prêts à être remis, avant l\'état des lieux ou le nouvel emménagement.',
    audiences: ['particulier', 'professionnel'],
    highlights: ['Sols, plinthes et placards', 'Sanitaires et cuisine', 'Vitres et surfaces incluses'],
    icon: Truck,
  },
];

export const COVERED_CITIES = [
  'Achenheim',
  'Bischheim',
  'Blaesheim',
  'Breuschwickersheim',
  'Eckbolsheim',
  'Eckwersheim',
  'Entzheim',
  'Eschau',
  'Fegersheim',
  'Geispolsheim',
  'Hangenbieten',
  'Hœnheim',
  'Holtzheim',
  'Illkirch-Graffenstaden',
  'Kolbsheim',
  'La Wantzenau',
  'Lampertheim',
  'Lingolsheim',
  'Lipsheim',
  'Mittelhausbergen',
  'Mundolsheim',
  'Niederhausbergen',
  'Oberhausbergen',
  'Oberschaeffolsheim',
  'Osthoffen',
  'Ostwald',
  'Plobsheim',
  'Reichstett',
  'Schiltigheim',
  'Souffelweyersheim',
  'Strasbourg',
  'Vendenheim',
  'Wolfisheim',
];

export const PROCESS_STEPS = [
  {
    title: 'Vous décrivez votre besoin',
    description: 'Remplissez le formulaire en quelques minutes : type de logement ou de locaux, prestations et commune.',
  },
  {
    title: 'Nous prenons contact',
    description: 'Nous revenons vers vous pour préciser les détails et convenir d\'une date d\'intervention.',
  },
  {
    title: 'Nous intervenons',
    description: 'Une équipe soigneuse réalise la prestation selon ce qui a été convenu, avec un résultat vérifié.',
  },
];

export const FAQ_ITEMS = [
  {
    question: 'Comment demander un devis ?',
    answer:
      'Remplissez le formulaire en bas de cette page en précisant si vous êtes particulier ou professionnel, les prestations souhaitées et votre commune. Nous revenons vers vous rapidement.',
  },
  {
    question: 'Intervenez-vous pour les particuliers et les professionnels ?',
    answer:
      'Oui. Nous proposons des prestations adaptées aux logements comme aux bureaux, commerces et espaces communs.',
  },
  {
    question: 'Que faut-il préparer pour une remise en état après déménagement ?',
    answer:
      'Indiquez la surface du logement, la date souhaitée et si le logement est vide. Cela nous permet de préparer une intervention adaptée à votre situation.',
  },
  {
    question: 'Mes informations sont-elles protégées ?',
    answer:
      'Les informations transmises servent uniquement à traiter votre demande de devis.',
  },
];
