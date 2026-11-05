import { Sparkles } from 'lucide-react';
import Logo from '@/components/Logo';

const FOOTER_LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'Zones', href: '#zones' },
  { label: 'Questions', href: '#faq' },
  { label: 'Demande de devis', href: '#devis' },
];

export default function Footer() {
  return (
    <footer className="bg-slate-950 py-14 text-slate-300">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-5 sm:px-8 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <Logo tone="light" />
          <p className="mt-4 text-base leading-normal text-slate-400">
            Nettoyage de vitres et vitrines, entretien de bureaux et remise en état après déménagement, à Strasbourg
            et dans l'Eurométropole.
          </p>
        </div>

        <nav aria-label="Pied de page" className="flex flex-col gap-3">
          <span className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-teal-200">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Navigation
          </span>
          {FOOTER_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="w-fit text-base text-slate-300 transition-colors duration-200 hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>

      <div className="mx-auto mt-12 flex max-w-6xl flex-col gap-3 border-t border-white/10 px-5 pt-8 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <span>© {new Date().getFullYear()} N&A Clean. Tous droits réservés.</span>
        <a href="/admin" className="w-fit transition-colors duration-200 hover:text-white">
          Espace administration
        </a>
      </div>
    </footer>
  );
}
