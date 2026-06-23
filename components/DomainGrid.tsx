'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import SmartSearch from '@/components/SmartSearch';
import OrderModal, { type OrderServiceItem } from '@/components/OrderModal';
import { ChevronRight, Shield, Star, Clock, CheckCircle2, X, Phone, MessageCircle } from 'lucide-react';

function BrandLogo({ brand, size = 24 }: { brand: string; size?: number }) {
  const s = size;
  switch (brand) {
    case 'wash': return (<svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="11" fill="#4285F4" /><path d="M7 16c0-2.8 2.2-5 5-5s5 2.2 5 5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" /><circle cx="9" cy="10" r="1.2" fill="#fff" /><circle cx="12" cy="8.5" r="1.2" fill="#fff" /><circle cx="15" cy="10" r="1.2" fill="#fff" /><path d="M8 17.5h8" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" /></svg>);
    case 'build': return (<svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="11" fill="#EA4335" /><path d="M8 16V8l4-3 4 3v8" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round" /><rect x="10" y="12" width="4" height="4" rx="0.5" stroke="#fff" strokeWidth="1.5" /><circle cx="12" cy="9" r="1" fill="#fff" /></svg>);
    case 'frame': return (<svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="11" fill="#FBBC05" /><rect x="7" y="5" width="10" height="14" rx="2" stroke="#fff" strokeWidth="1.8" /><line x1="7" y1="8" x2="17" y2="8" stroke="#fff" strokeWidth="1" /><line x1="7" y1="16" x2="17" y2="16" stroke="#fff" strokeWidth="1" /><circle cx="12" cy="17.5" r="0.8" fill="#fff" /></svg>);
    case 'move': return (<svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="11" fill="#34A853" /><rect x="4" y="9" width="10" height="7" rx="1" stroke="#fff" strokeWidth="1.8" /><path d="M14 11l4-2v7l-4-2" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round" /><circle cx="8" cy="17" r="1.5" stroke="#fff" strokeWidth="1.2" /><circle cx="16" cy="17" r="1.5" stroke="#fff" strokeWidth="1.2" /></svg>);
    case 'rent': return (<svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="11" fill="#4285F4" /><path d="M9 7v5l3 3 3-3V7" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /><line x1="12" y1="15" x2="12" y2="18" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" /><line x1="9" y1="18" x2="15" y2="18" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" /></svg>);
    case 'care': return (<svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="11" fill="#1C1C1E" /><path d="M8 11c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" /><path d="M7 15h10" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" /><circle cx="12" cy="17" r="1" fill="#34A853" /></svg>);
    default: return null;
  }
}

function BroVerseLogo({ className = '' }: { className?: string }) {
  return (<svg viewBox="0 0 40 40" fill="none" className={className}><rect width="40" height="40" rx="12" fill="#18181b" /><path d="M10 12h4l4 8 4-8h4v16h-3.5v-10l-4.5 8-4.5-8v10H10V12z" fill="#fff" /><circle cx="32" cy="14" r="3" fill="#34A853" /><circle cx="32" cy="14" r="1.5" fill="#fff" /></svg>);
}

const CATEGORY_CARDS = [
  { id: 'wash', label: 'BroWash', desc: 'Химчистка', color: '#4285F4', bg: '#EBF3FF' },
  { id: 'build', label: 'BroBuild', desc: 'Ремонт', color: '#EA4335', bg: '#FDECEA' },
  { id: 'frame', label: 'BroFrame', desc: 'Техника', color: '#FBBC05', bg: '#FEF7E0' },
  { id: 'move', label: 'BroMove', desc: 'Переезд', color: '#34A853', bg: '#E8F5E9' },
  { id: 'rent', label: 'BroRent', desc: 'Инструмент', color: '#34A853', bg: '#E8F5E9' },
  { id: 'care', label: 'BroCare', desc: 'Обучение', color: '#1C1C1E', bg: '#F5F5F5' },
];

const TRUST_ITEMS = [
  { icon: Shield, label: 'Trust Score 100', desc: 'Проверенные мастера' },
  { icon: Star, label: 'Рейтинг 5.0', desc: '4.9 средний балл' },
  { icon: Clock, label: 'Выезд от 1ч', desc: 'Быстрый отклик' },
  { icon: CheckCircle2, label: 'Гарантия', desc: 'На все виды работ' },
];

const ALL_SERVICES: OrderServiceItem[] = [
  { name: 'Химчистка дивана', desc: 'Глубокая чистка с удалением пятен', price: '3 500', domain: 'wash', brand: 'BroWash', color: '#4285F4', icon: '🛋️', time: '2-3 ч', image: '/hero/wash-hero.jpg' },
  { name: 'Химчистка кресла', desc: 'Детские, офисные, качалки', price: '2 500', domain: 'wash', brand: 'BroWash', color: '#4285F4', icon: '💺', time: '1-2 ч', image: '/hero/wash-slider-0.jpg' },
  { name: 'Чистка матраса', desc: 'Удаление клещей и запахов', price: '2 000', domain: 'wash', brand: 'BroWash', color: '#4285F4', icon: '🛏️', time: '1-2 ч', image: '/hero/wash-slider-2.jpg' },
  { name: 'Мойка окон', desc: 'Стандартные и панорамные', price: '1 500', domain: 'wash', brand: 'BroWash', color: '#4285F4', icon: '🪟', time: '1-2 ч', image: '/hero/wash-slider-1.jpg' },
  { name: 'Чистка ковра', desc: 'Глубокая чистка с выведением пятен', price: '2 000', domain: 'wash', brand: 'BroWash', color: '#4285F4', icon: '🧶', time: '2-3 ч', image: '/hero/wash-slider-3.jpg' },
  { name: 'Химчистка салона авто', desc: 'Выездная чистка в любую точку', price: '4 000', domain: 'wash', brand: 'BroWash', color: '#4285F4', icon: '🚗', time: '3-4 ч', image: '/hero/wash-slider-4.jpg' },
  { name: 'Озонирование', desc: 'Удаление запахов: дым, животные', price: '1 500', domain: 'wash', brand: 'BroWash', color: '#4285F4', icon: '💨', time: '1 ч', image: '/hero/wash-slider-5.jpg' },
  { name: 'Чистка штор', desc: 'Без снятия на карнизе', price: '1 800', domain: 'wash', brand: 'BroWash', color: '#4285F4', icon: '🪭', time: '1-2 ч', image: '/hero/wash-hero.jpg' },
  { name: 'Замена экрана iPhone', desc: 'Все модели iPhone', price: '4 500', domain: 'frame', brand: 'BroFrame', color: '#FBBC05', icon: '📱', time: '30-60 мин', image: '/hero/frame-hero.jpg' },
  { name: 'Замена аккумулятора', desc: 'Оригинал и аналоги', price: '2 000', domain: 'frame', brand: 'BroFrame', color: '#FBBC05', icon: '🔋', time: '30 мин', image: '/hero/frame-slider-0.jpg' },
  { name: 'Чистка ноутбука', desc: 'Продувка, замена термопасты', price: '1 500', domain: 'frame', brand: 'BroFrame', color: '#FBBC05', icon: '💻', time: '1 ч', image: '/hero/frame-slider-1.jpg' },
  { name: 'Ремонт робота-пылесоса', desc: 'Включая парк BroRent', price: '3 000', domain: 'frame', brand: 'BroFrame', color: '#FBBC05', icon: '🤖', time: '1-2 ч', image: '/hero/frame-slider-2.jpg' },
  { name: 'Настройка Wi-Fi', desc: 'Mesh-системы, роутеры', price: '1 500', domain: 'frame', brand: 'BroFrame', color: '#FBBC05', icon: '📶', time: '1 ч', image: '/hero/frame-slider-3.jpg' },
  { name: 'Ремонт Samsung/Xiaomi', desc: 'Все модели Android', price: '3 500', domain: 'frame', brand: 'BroFrame', color: '#FBBC05', icon: '📲', time: '30-60 мин', image: '/hero/frame-slider-4.jpg' },
  { name: 'Восстановление после воды', desc: 'Диагностика, чип-мойка', price: '5 000', domain: 'frame', brand: 'BroFrame', color: '#FBBC05', icon: '💧', time: '2-3 ч', image: '/hero/frame-slider-5.jpg' },
  { name: 'Замена смесителя', desc: 'Ванные, кухни, туалеты', price: '1 500', domain: 'build', brand: 'BroBuild', color: '#EA4335', icon: '🚿', time: '30-60 мин', image: '/hero/build-hero.jpg' },
  { name: 'Устранение протечек', desc: 'Трубы, стыки, узлы', price: '1 200', domain: 'build', brand: 'BroBuild', color: '#EA4335', icon: '🔧', time: '30-60 мин', image: '/hero/build-slider-0.jpg' },
  { name: 'Установка розеток', desc: 'Силовые, USB, обычные', price: '800', domain: 'build', brand: 'BroBuild', color: '#EA4335', icon: '🔌', time: '20-40 мин', image: '/hero/build-slider-2.jpg' },
  { name: 'Замена проводки', desc: 'Полная или частичная', price: '5 000', domain: 'build', brand: 'BroBuild', color: '#EA4335', icon: '⚡', time: '3-5 ч', image: '/hero/build-slider-3.jpg' },
  { name: 'Установка дверей', desc: 'Входные, межкомнатные', price: '3 000', domain: 'build', brand: 'BroBuild', color: '#EA4335', icon: '🚪', time: '1-2 ч', image: '/hero/build-slider-4.jpg' },
  { name: 'Ремонт холодильника', desc: 'Заправка, компрессоры', price: '3 500', domain: 'build', brand: 'BroBuild', color: '#EA4335', icon: '🧊', time: '1-2 ч', image: '/hero/build-slider-5.jpg' },
  { name: 'Ремонт кофемашины', desc: 'Профессиональные и домашние', price: '2 500', domain: 'build', brand: 'BroBuild', color: '#EA4335', icon: '☕', time: '1-2 ч', image: '/hero/build-slider-6.jpg' },
  { name: 'Монтаж кондиционера', desc: 'Установка и обслуживание', price: '5 000', domain: 'build', brand: 'BroBuild', color: '#EA4335', icon: '❄️', time: '2-3 ч', image: '/hero/build-hero.jpg' },
  { name: 'Квартирный переезд', desc: 'Упаковка, погрузка, расстановка', price: '4 000', domain: 'move', brand: 'BroMove', color: '#4285F4', icon: '📦', time: '3-5 ч', image: '/hero/move-hero.jpg' },
  { name: 'Офисный переезд', desc: 'Мебель, техника, документы', price: '6 000', domain: 'move', brand: 'BroMove', color: '#4285F4', icon: '🏢', time: '4-6 ч', image: '/hero/move-slider-0.jpg' },
  { name: 'Сборка мебели IKEA', desc: 'Любая сложность', price: '2 000', domain: 'move', brand: 'BroMove', color: '#4285F4', icon: '🪑', time: '1-3 ч', image: '/hero/move-slider-1.jpg' },
  { name: 'Грузоперевозки', desc: 'Газель, КАМАЗ, манипулятор', price: '3 000', domain: 'move', brand: 'BroMove', color: '#4285F4', icon: '🚛', time: 'По запросу', image: '/hero/move-slider-2.jpg' },
  { name: 'Перетяжка мебели', desc: 'Замена обивки, реставрация', price: '5 000', domain: 'move', brand: 'BroMove', color: '#4285F4', icon: '🪡', time: '2-4 ч', image: '/hero/move-slider-3.jpg' },
  { name: 'Аренда пылесоса Karcher', desc: 'Профессиональный для химчистки', price: '800', domain: 'rent', brand: 'BroRent', color: '#34A853', icon: '🧹', time: 'От 1 дня', image: '/hero/rent-hero.jpg' },
  { name: 'Аренда перфоратора', desc: 'Bosch, Makita, DeWalt', price: '500', domain: 'rent', brand: 'BroRent', color: '#34A853', icon: '🔨', time: 'От 1 дня', image: '/hero/rent-slider-0.jpg' },
  { name: 'Аренда парогенератора', desc: 'Для детейлинга и текстиля', price: '600', domain: 'rent', brand: 'BroRent', color: '#34A853', icon: '♨️', time: 'От 1 дня', image: '/hero/rent-slider-1.jpg' },
  { name: 'Аренда мойки высокого давления', desc: 'Karcher для фасадов', price: '700', domain: 'rent', brand: 'BroRent', color: '#34A853', icon: '💦', time: 'От 1 дня', image: '/hero/rent-slider-2.jpg' },
  { name: 'Аренда шуруповерта', desc: 'Аккумуляторные и сетевые', price: '400', domain: 'rent', brand: 'BroRent', color: '#34A853', icon: '🔩', time: 'От 1 дня', image: '/hero/rent-slider-3.jpg' },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Опишите задачу', desc: 'Выберите услугу из каталога, опишите что нужно', details: ['Фото помогает мастеру оценить объём', 'AI-оценка рассчитает стоимость'], icon: '📝' },
  { step: '02', title: 'Мастер свяжется', desc: 'В течение 5 минут мастер подтвердит детали', details: ['Бесплатный выезд для осмотра', 'Фиксированная стоимость'], icon: '📞' },
  { step: '03', title: 'Работа выполняется', desc: 'Мастер приедет в удобное время', details: ['Фотоотчёт в процессе', 'Соблюдение сроков'], icon: '🔧' },
  { step: '04', title: 'Принимайте и оплачивайте', desc: 'Проверьте результат, оплатите', details: ['Оплата после验收', 'Гарантия до 12 месяцев'], icon: '✅' },
];

function ServiceDetailModal({ service, onOrder, onClose }: { service: OrderServiceItem; onOrder: () => void; onClose: () => void }) {
  const [visible, setVisible] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);

  useEffect(() => { requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true))); }, []);

  useEffect(() => {
    fetch(`/api/images?domainId=${service.domain}`).then(r => r.json()).then(d => setPhotos(d.services?.[service.name] || [])).catch(() => {});
  }, [service.domain, service.name]);

  const handleClose = useCallback(() => { setVisible(false); setTimeout(onClose, 300); }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      <div className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`} onClick={handleClose} />
      <div className={`relative w-full sm:max-w-[420px] mx-4 mb-0 sm:mb-0 bg-white rounded-t-[24px] sm:rounded-[24px] shadow-2xl overflow-hidden transition-all duration-300 ease-out max-h-[90vh] overflow-y-auto ${visible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-full sm:translate-y-8 opacity-0 scale-95'}`}>
        <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100">
          <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <button type="button" onClick={handleClose} className="absolute top-3 right-3 p-2 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-colors"><X size={18} /></button>
          <div className="absolute bottom-3 left-3 right-3">
            <span className="inline-block px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm text-[10px] sm:text-[11px] font-bold text-white mb-2">{service.brand} • {service.time}</span>
            <h2 className="text-lg sm:text-xl font-black text-white leading-tight" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>{service.name}</h2>
          </div>
        </div>
        <div className="p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xl sm:text-2xl font-black text-zinc-900">от {service.price} ₽</span>
            <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-zinc-400"><Clock size={12} />{service.time}</div>
          </div>
          <p className="text-sm sm:text-[15px] text-zinc-600 leading-relaxed mb-5">{service.desc}. Выезд мастера в удобное время, фиксированная стоимость без скрытых доплат. Гарантия на все виды работ.</p>
          {photos.length > 0 && (
            <div className="mb-5">
              <p className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Фото работы</p>
              <div className="grid grid-cols-3 gap-2">{photos.map((p, i) => (<div key={i} className="aspect-square rounded-xl overflow-hidden bg-zinc-100"><img src={p} alt="" className="w-full h-full object-cover" /></div>))}</div>
            </div>
          )}
          <div className="space-y-2.5 mb-6">
            <div className="flex items-center gap-2.5"><CheckCircle2 size={14} className="text-emerald-500 shrink-0" /><span className="text-[12px] sm:text-[13px] text-zinc-600">Бесплатный выезд для осмотра</span></div>
            <div className="flex items-center gap-2.5"><CheckCircle2 size={14} className="text-emerald-500 shrink-0" /><span className="text-[12px] sm:text-[13px] text-zinc-600">Фиксированная стоимость</span></div>
            <div className="flex items-center gap-2.5"><CheckCircle2 size={14} className="text-emerald-500 shrink-0" /><span className="text-[12px] sm:text-[13px] text-zinc-600">Гарантия до 12 месяцев</span></div>
          </div>
        </div>
        <div className="sticky bottom-0 bg-white border-t border-zinc-100 p-4 sm:p-5 space-y-2">
          <button type="button" onClick={() => { handleClose(); setTimeout(onOrder, 300); }} className="w-full py-3.5 rounded-2xl bg-zinc-900 text-white text-sm font-bold hover:bg-zinc-800 transition-all duration-200 active:scale-[0.98]">Заказать от {service.price} ₽</button>
          <div className="flex gap-2">
            <a href="tel:+79001234567" className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-zinc-50 border border-zinc-200 text-[11px] sm:text-xs font-semibold text-zinc-500 hover:bg-zinc-100 transition-colors"><Phone size={12} /> Позвонить</a>
            <a href="https://t.me/" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-zinc-50 border border-zinc-200 text-[11px] sm:text-xs font-semibold text-zinc-500 hover:bg-zinc-100 transition-colors"><MessageCircle size={12} /> Telegram</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DomainGrid() {
  const [selectedService, setSelectedService] = useState<OrderServiceItem | null>(null);
  const [detailService, setDetailService] = useState<OrderServiceItem | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [services, setServices] = useState<OrderServiceItem[]>(ALL_SERVICES);

  useEffect(() => {
    fetch('/api/services').then(r => r.json()).then((data: any[]) => {
      if (data.length > 0) {
        const apiNames = new Set(data.map((s: any) => s.name));
        const merged = [...data, ...ALL_SERVICES.filter(s => !apiNames.has(s.name))];
        setServices(merged);
      }
    }).catch(() => {});
  }, []);

  const filteredServices = filter === 'all' ? services : services.filter((s) => s.domain === filter);

  return (
    <div className="min-h-[100dvh] bg-[#FFFFFF]">
      <Header />
      <main>
        <SmartSearch />

        <section className="mx-auto max-w-5xl px-4 sm:px-5 pb-8 sm:pb-10">
          <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
            {CATEGORY_CARDS.map((card) => (
              <Link key={card.id} href={`/services/${card.id}`} className="group flex flex-col items-center text-center p-4 sm:p-5 rounded-2xl sm:rounded-3xl transition-all duration-300 hover:shadow-lg hover:scale-[1.03] active:scale-[0.97]" style={{ backgroundColor: card.bg }}>
                <div className="mb-3 sm:mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"><BrandLogo brand={card.id} size={44} /></div>
                <span className="text-[11px] sm:text-xs font-bold leading-tight" style={{ color: card.color }}>{card.label}</span>
                <span className="text-[9px] sm:text-[10px] text-zinc-400 mt-0.5 hidden sm:block">{card.desc}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 sm:px-5 pb-8 sm:pb-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {TRUST_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center gap-3 sm:gap-3.5 p-3 sm:p-4 rounded-2xl bg-zinc-50/80 border border-zinc-100/50">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-white flex items-center justify-center shrink-0 shadow-sm"><Icon size={18} className="text-zinc-600" strokeWidth={2} /></div>
                  <div>
                    <p className="text-[11px] sm:text-xs font-bold text-zinc-800">{item.label}</p>
                    <p className="text-[9px] sm:text-[10px] text-zinc-400">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 sm:px-5 pb-10 sm:pb-12 border-t border-zinc-100 pt-10 sm:pt-12">
          <div className="flex items-center gap-3 mb-5 sm:mb-6">
            <BroVerseLogo className="w-9 h-9 sm:w-10 sm:h-10" />
            <div>
              <h2 className="text-base sm:text-lg font-bold text-zinc-900">Все услуги BroVerse</h2>
              <p className="text-[11px] sm:text-xs text-zinc-400">{filteredServices.length} услуг · Нажмите для заказа</p>
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-3 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
            <button type="button" onClick={() => setFilter('all')} className={`flex-shrink-0 px-4 py-2 rounded-full text-[11px] sm:text-xs font-bold transition-all duration-200 ${filter === 'all' ? 'bg-zinc-900 text-white shadow-md' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'}`}>Все ({services.length})</button>
            {CATEGORY_CARDS.map((cat) => {
              const count = services.filter((s) => s.domain === cat.id).length;
              return (
                <button key={cat.id} type="button" onClick={() => setFilter(filter === cat.id ? 'all' : cat.id)} className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-[11px] sm:text-xs font-bold transition-all duration-200 ${filter === cat.id ? 'text-white shadow-md' : 'hover:opacity-80'}`} style={{ backgroundColor: filter === cat.id ? cat.color : cat.bg, color: filter === cat.id ? '#fff' : cat.color }}>
                  <BrandLogo brand={cat.id} size={16} />{cat.label} ({count})
                </button>
              );
            })}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4 mt-4 sm:mt-5">
            {filteredServices.map((service) => (
              <button key={service.name} type="button" onClick={() => setDetailService(service)} className="group text-left rounded-2xl sm:rounded-3xl border border-zinc-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white">
                <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100">
                  <img src={service.image} alt={service.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm text-[9px] sm:text-[10px] font-bold text-white">{service.brand}</span>
                  <span className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm text-[9px] sm:text-[10px] font-bold text-white">{service.time}</span>
                </div>
                <div className="p-3.5 sm:p-4">
                  <p className="text-[12px] sm:text-[13px] font-semibold text-zinc-800 group-hover:text-zinc-950 transition-colors leading-tight line-clamp-1">{service.name}</p>
                  <p className="text-[10px] sm:text-[11px] text-zinc-400 mt-1 line-clamp-1">{service.desc}</p>
                  <div className="flex items-center justify-between mt-2.5">
                    <span className="text-[13px] sm:text-sm font-bold text-zinc-900">от {service.price} ₽</span>
                    <span className="text-[10px] sm:text-[11px] font-semibold text-zinc-400 group-hover:text-zinc-600 transition-colors">Заказать →</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 sm:px-5 pb-12 sm:pb-16 border-t border-zinc-100 pt-10 sm:pt-12">
          <h2 className="text-lg sm:text-xl font-bold text-zinc-900 mb-8 sm:mb-10 text-center">Как это работает</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {HOW_IT_WORKS.map((item) => (
              <div key={item.step} className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl sm:text-4xl">{item.icon}</span>
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-zinc-300">Шаг {item.step}</span>
                </div>
                <h3 className="text-sm sm:text-[15px] font-bold text-zinc-800 mb-2">{item.title}</h3>
                <p className="text-[11px] sm:text-xs text-zinc-500 leading-relaxed mb-3">{item.desc}</p>
                <ul className="space-y-1.5">
                  {item.details.map((d) => (
                    <li key={d} className="flex items-start gap-2">
                      <CheckCircle2 size={12} className="text-emerald-400 mt-0.5 shrink-0" />
                      <span className="text-[10px] sm:text-[11px] text-zinc-400">{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 sm:px-5 pb-12 sm:pb-16">
          <div className="relative overflow-hidden rounded-3xl bg-zinc-900 p-8 sm:p-10 text-center">
            <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-[#4285F4]/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-[#34A853]/20 blur-3xl" />
            <div className="relative">
              <BroVerseLogo className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-4" />
              <h2 className="text-lg sm:text-xl font-bold text-white mb-2">Нужна помощь с выбором?</h2>
              <p className="text-sm text-zinc-400 mb-6 max-w-md mx-auto">Опишите задачу — подберём мастера и рассчитаем стоимость за 5 минут</p>
              <button type="button" className="inline-flex items-center gap-2 bg-white text-zinc-900 text-sm font-bold px-6 sm:px-8 py-3 sm:py-3.5 rounded-full hover:bg-zinc-100 transition-colors shadow-xl shadow-black/20">
                Оставить заявку <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </section>
      </main>
      {detailService && <ServiceDetailModal service={detailService} onOrder={() => setSelectedService(detailService)} onClose={() => setDetailService(null)} />}
      {selectedService && <OrderModal service={selectedService} onClose={() => setSelectedService(null)} />}
    </div>
  );
}
