import { ArrowRight, Briefcase, Home } from 'lucide-react';
import type { ClientType } from '@/lib/quoteRequests';

interface AudiencesProps {
  onSelect: (type: ClientType) => void;
}

const AUDIENCE_CARDS = [
  {
    type: 'particulier' as ClientType,
    title: 'Particuliers',
    description:
      'Vitres de votre maison ou de votre appartement, et remise en état complète de votre logement après un déménagement.',
    image: 'https://images.pexels.com/photos/7218121/pexels-photo-7218121.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    imageAlt: 'Logement lumineux en cours de déménagement',
    icon: Home,
  },
  {
    type: 'professionnel' as ClientType,
    title: 'Professionnels',
    description:
      'Bureaux, commerces et espaces communs entretenus selon vos horaires, avec un interlocuteur unique.',
    image: 'https://images.pexels.com/photos/5511093/pexels-photo-5511093.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    imageAlt: 'Couloir de bureaux lumineux et propre',
    icon: Briefcase,
  },
];

export default function Audiences({ onSelect }: AudiencesProps) {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-teal-700">Pour qui ?</p>
          <h2 className="mt-3 text-3xl font-bold leading-[1.2] tracking-tight text-slate-900 sm:text-4xl">
            Une prestation adaptée à votre situation
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {AUDIENCE_CARDS.map((card) => (
            <article
              key={card.type}
              className="group relative overflow-hidden rounded-3xl bg-slate-900 shadow-sm transition-shadow duration-300 hover:shadow-xl"
            >
              <img
                src={card.image}
                alt={card.imageAlt}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-slate-900/10" />

              <div className="relative flex h-full min-h-[380px] flex-col justify-end p-8">
                <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur">
                  <card.icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="text-2xl font-bold leading-[1.2] text-white">{card.title}</h3>
                <p className="mt-3 max-w-md text-base leading-normal text-slate-200">{card.description}</p>
                <button
                  type="button"
                  onClick={() => onSelect(card.type)}
                  className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition-colors duration-200 hover:bg-teal-50"
                >
                  Demander un devis
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
