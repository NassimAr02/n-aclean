export const inputClass = (hasError: boolean) =>
  `w-full rounded-xl border bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 transition-colors duration-200 focus:border-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-700/15 ${
    hasError ? 'border-red-600' : 'border-slate-300'
  }`;
