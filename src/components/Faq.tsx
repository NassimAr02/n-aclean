import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FAQ_ITEMS } from '@/data/siteContent';

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-24 bg-white py-24">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_1.5fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-teal-700">Questions fréquentes</p>
          <h2 className="mt-3 text-3xl font-bold leading-[1.2] tracking-tight text-slate-900 sm:text-4xl">
            Vous avez une question ?
          </h2>
          <p className="mt-4 text-lg leading-normal text-slate-600">
            Si vous ne trouvez pas la réponse, envoyez-nous votre demande depuis le formulaire de devis.
          </p>
        </div>

        <div className="divide-y divide-slate-200 border-y border-slate-200">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={item.question}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-6 py-6 text-left"
                >
                  <span className="text-lg font-semibold text-slate-900">{item.question}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-teal-700 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>
                <div
                  className={`grid transition-all duration-300 ease-out ${
                    isOpen ? 'grid-rows-[1fr] pb-6 opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <p className="overflow-hidden text-base leading-normal text-slate-600">{item.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
