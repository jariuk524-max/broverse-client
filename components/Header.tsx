'use client';

import { useState } from 'react';
import { Sparkles, History, X, Package, Clock, MapPin, CheckCircle2 } from 'lucide-react';

export default function Header() {
  const [showHistory, setShowHistory] = useState(false);

  return (
    <>
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
              <button
                type="button"
                onClick={() => setShowHistory(true)}
                className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-3.5 py-1.5 font-bold text-zinc-600 hover:bg-zinc-200 transition-colors active:scale-95"
              >
                <History size={12} />
                История заказов
              </button>
            </div>
          </div>
        </div>
      </header>

      {showHistory && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowHistory(false)} />
          <div className="relative w-full sm:max-w-[420px] mx-0 sm:mx-4 mb-0 sm:mb-0 bg-white rounded-t-[24px] sm:rounded-[24px] shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-100 bg-white/90 backdrop-blur-xl p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-900">
                  <History size={18} className="text-white" />
                </div>
                <div>
                  <h2 className="text-[15px] font-bold text-zinc-900">История заказов</h2>
                  <p className="text-[11px] text-zinc-400">Все ваши заявки</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowHistory(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 hover:bg-zinc-200 transition-colors"
              >
                <X size={16} className="text-zinc-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-5">
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-zinc-100 mx-auto mb-4 flex items-center justify-center">
                  <Package size={28} className="text-zinc-300" />
                </div>
                <p className="text-[15px] font-bold text-zinc-400 mb-1">Пока нет заказов</p>
                <p className="text-[12px] text-zinc-300">Ваши выполненные заявки появятся здесь</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
