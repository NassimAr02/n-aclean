import { Sparkles } from 'lucide-react';

interface LogoProps {
  tone?: 'light' | 'dark';
}

export default function Logo({ tone = 'dark' }: LogoProps) {
  const nameClass = tone === 'light' ? 'text-white' : 'text-slate-900';
  const accentClass = tone === 'light' ? 'text-teal-200' : 'text-teal-700';

  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-700 text-white shadow-sm">
        <Sparkles className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className={`text-lg font-bold tracking-tight transition-colors duration-300 ${nameClass}`}>
        {'N&A'} <span className={accentClass}>Clean</span>
      </span>
    </div>
  );
}
