import { ArrowRight, MapPin } from 'lucide-react';

const HERO_IMAGE_URL =
  'https://images.pexels.com/photos/12741260/pexels-photo-12741260.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';

export default function Hero() {
  return (
    <section id="top" className="relative isolate flex min-h-[92vh] items-center overflow-hidden bg-slate-900">
      <img
        src={HERO_IMAGE_URL}
        alt="Nettoyage de vitres d'un immeuble par un professionnel"
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-900/90 via-slate-900/75 to-slate-900/30" />

      <div className="mx-auto w-full max-w-6xl px-5 pb-20 pt-32 sm:px-8">
        <p className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-semibold text-teal-100 backdrop-blur">
          <MapPin className="h-4 w-4" aria-hidden="true" />
          Strasbourg et Eurométropole
        </p>

        <h1 className="animate-fade-up mt-6 max-w-3xl text-4xl font-bold leading-[1.2] tracking-tight text-white [animation-delay:100ms] sm:text-5xl lg:text-6xl">
          Des vitres, des bureaux et un logement impeccables.
        </h1>

        <p className="animate-fade-up mt-6 max-w-2xl text-lg leading-normal text-slate-200 [animation-delay:200ms]">
          N&A Clean intervient pour les particuliers et les professionnels : nettoyage de vitres et
          vitrines, entretien de bureaux et d'espaces communs, remise en état après déménagement.
        </p>

        <div className="animate-fade-up mt-10 flex flex-col gap-4 [animation-delay:300ms] sm:flex-row">
          <a
            href="#devis"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-teal-700 px-7 py-3.5 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-teal-800"
          >
            Demander un devis
            <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
          </a>
          <a
            href="#services"
            className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white/5 px-7 py-3.5 text-base font-semibold text-white backdrop-blur transition-colors duration-200 hover:bg-white/15"
          >
            Découvrir nos services
          </a>
        </div>
      </div>
    </section>
  );
}
