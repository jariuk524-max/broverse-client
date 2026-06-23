import { Sparkles } from 'lucide-react';

export default function Header() {
  return (
    <header className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-50 via-white to-white" />
      <div className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full bg-[#4285F4]/5 blur-3xl" />
      <div className="pointer-events-none absolute -top-10 -left-10 h-56 w-56 rounded-full bg-[#34A853]/5 blur-3xl" />

      <div className="relative mx-auto max-w-5xl px-5 pt-14 pb-10 sm:pt-20 sm:pb-14">
        <div className="flex flex-col items-center text-center gap-5 sm:gap-6">
          <div className="flex items-center gap-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#4285F4]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#EA4335]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#FBBC05]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#34A853]" />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl sm:rounded-3xl bg-zinc-900 shadow-2xl shadow-zinc-900/20">
              <Sparkles size={28} className="text-white sm:h-8 sm:w-8" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-zinc-900">
              BroVerse
            </h1>
          </div>

          <p className="max-w-md text-base sm:text-lg font-semibold leading-relaxed text-zinc-400">
            Профессиональные мастера для дома и бизнеса.
            <br className="hidden sm:block" />
            Химчистка, ремонт, переезд, техника и инструменты.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1.5 font-bold text-emerald-600">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Trust Score 100
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3.5 py-1.5 font-bold text-amber-600">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              Рейтинг 5.0
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3.5 py-1.5 font-bold text-blue-600">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
              Выезд от 1ч
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3.5 py-1.5 font-bold text-purple-600">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
              Гарантия
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
