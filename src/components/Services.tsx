import { Check } from 'lucide-react';
import { SERVICES } from '@/data/siteContent';

const AUDIENCE_LABELS = {
  particulier: 'Particuliers',
  professionnel: 'Professionnels',
} as const;

export default function Services() {
  return (
    <section id="services" className="scroll-mt-24 bg-slate-50 py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-teal-700">Nos services</p>
          <h2 className="mt-3 text-3xl font-bold leading-[1.2] tracking-tight text-slate-900 sm:text-4xl">
            Trois prestations, un même niveau d'exigence
          </h2>
          <p className="mt-4 text-lg leading-normal text-slate-600">
            Chaque intervention est préparée avec vous pour répondre précisément à vos attentes.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <article
              key={service.title}
              className="flex flex-col rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-teal-200 hover:shadow-lg"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                <service.icon className="h-7 w-7" aria-hidden="true" />
              </span>

              <div className="mt-6 flex flex-wrap gap-2">
                {service.audiences.map((audience) => (
                  <span
                    key={audience}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
                  >
                    {AUDIENCE_LABELS[audience]}
                  </span>
                ))}
              </div>

              <h3 className="mt-5 text-xl font-bold leading-[1.2] text-slate-900">{service.title}</h3>
              <p className="mt-3 text-base leading-normal text-slate-600">{service.description}</p>

              <ul className="mt-6 space-y-3 border-t border-slate-100 pt-6">
                {service.highlights.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-slate-700">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
