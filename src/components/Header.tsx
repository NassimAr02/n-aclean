import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import Logo from '@/components/Logo';

const NAV_LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'Zones', href: '#zones' },
  { label: 'Questions', href: '#faq' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isSolid = scrolled || menuOpen;
  const linkClass = isSolid
    ? 'text-slate-700 hover:text-teal-700'
    : 'text-white/90 hover:text-white';

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        isSolid ? 'border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-5 sm:px-8">
        <a href="#top" aria-label="N&A Clean, retour en haut de page">
          <Logo tone={isSolid ? 'dark' : 'light'} />
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-sm font-semibold transition-colors duration-200 ${linkClass}`}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#devis"
            className="rounded-full bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-teal-800 hover:shadow-md"
          >
            Demander un devis
          </a>
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={menuOpen}
          className={`inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors md:hidden ${
            isSolid ? 'text-slate-900 hover:bg-slate-100' : 'text-white hover:bg-white/10'
          }`}
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {menuOpen && (
        <nav className="border-t border-slate-200 bg-white px-5 pb-6 pt-2 md:hidden">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block border-b border-slate-100 py-4 text-base font-semibold text-slate-900"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#devis"
            onClick={() => setMenuOpen(false)}
            className="mt-5 block rounded-full bg-teal-700 px-5 py-3 text-center text-sm font-semibold text-white"
          >
            Demander un devis
          </a>
        </nav>
      )}
    </header>
  );
}
