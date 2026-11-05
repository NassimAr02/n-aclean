import { PROCESS_STEPS } from '@/data/siteContent';

export default function Process() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-teal-700">Comment ça marche</p>
          <h2 className="mt-3 text-3xl font-bold leading-[1.2] tracking-tight text-slate-900 sm:text-4xl">
            Du premier contact à l'intervention
          </h2>
        </div>

        <ol className="mt-12 grid gap-8 md:grid-cols-3">
          {PROCESS_STEPS.map((step, index) => (
            <li key={step.title} className="relative rounded-3xl bg-slate-50 p-8">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-700 text-lg font-bold text-white">
                {index + 1}
              </span>
              <h3 className="mt-6 text-xl font-bold leading-[1.2] text-slate-900">{step.title}</h3>
              <p className="mt-3 text-base leading-normal text-slate-600">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
