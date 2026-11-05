import { MapPin } from 'lucide-react';
import { COVERED_CITIES } from '@/data/siteContent';

export default function Coverage() {
  return (
    <section id="zones" className="scroll-mt-24 bg-slate-900 py-24">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-teal-200">Zone d'intervention</p>
          <h2 className="mt-3 text-3xl font-bold leading-[1.2] tracking-tight text-white sm:text-4xl">
            Strasbourg et l'Eurométropole
          </h2>
          <p className="mt-4 text-lg leading-normal text-slate-300">
            Nous intervenons dans les communes de l'Eurométropole de Strasbourg. Votre commune ne figure pas
            dans la liste ? Décrivez votre besoin dans le formulaire, nous étudierons votre demande.
          </p>
        </div>

        <ul className="flex flex-wrap gap-3">
          {COVERED_CITIES.map((city) => (
            <li
              key={city}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:border-teal-200 hover:bg-white/10"
            >
              <MapPin className="h-4 w-4 text-teal-200" aria-hidden="true" />
              {city}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
