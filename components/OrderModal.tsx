'use client';

import { useState, useCallback, useEffect } from 'react';
import { CheckCircle2, X, Phone, MessageCircle, Zap } from 'lucide-react';
import { createOrderInSupabase } from '@/lib/monolith-bridge';

export type OrderServiceItem = {
  name: string;
  desc: string;
  price: string;
  domain: string;
  brand: string;
  color: string;
  icon: string;
  time: string;
  image: string;
};

interface OrderModalProps {
  service: OrderServiceItem;
  onClose: () => void;
}

function getClientChatId(): number | null {
  try {
    // @ts-expect-error Telegram WebApp SDK
    const tg = window.Telegram?.WebApp;
    if (tg?.initDataUnsafe?.user?.id) {
      return tg.initDataUnsafe.user.id;
    }
  } catch {}
  return null;
}

export default function OrderModal({ service, onClose }: OrderModalProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [comment, setComment] = useState('');
  const [dateOption, setDateOption] = useState('');
  const [customDate, setCustomDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
  }, []);

  const handleClose = useCallback(() => {
    setVisible(false);
    setTimeout(onClose, 300);
  }, [onClose]);

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date(today);
  dayAfter.setDate(dayAfter.getDate() + 2);

  const dateOptions = [
    { id: 'today', label: 'Сегодня', sub: `${today.getDate()} ${today.toLocaleString('ru', { month: 'short' })}` },
    { id: 'tomorrow', label: 'Завтра', sub: `${tomorrow.getDate()} ${tomorrow.toLocaleString('ru', { month: 'short' })}` },
    { id: 'dayafter', label: dayAfter.toLocaleString('ru', { weekday: 'short' }), sub: `${dayAfter.getDate()} ${dayAfter.toLocaleString('ru', { month: 'short' })}` },
    { id: 'custom', label: 'Выбрать дату', sub: 'Календарь' },
  ];

  const timeSlots = [
    { id: 'morning', label: '09:00 — 12:00', sub: 'Утро' },
    { id: 'day', label: '12:00 — 15:00', sub: 'День' },
    { id: 'evening', label: '15:00 — 18:00', sub: 'Вечер' },
    { id: 'late', label: '18:00 — 21:00', sub: 'Поздно' },
  ];

  const handleSubmit = useCallback(async () => {
    const price = parseInt(service.price.replace(/\s/g, ''));
    await createOrderInSupabase({
      title: `${service.brand} — ${service.name}`,
      service: service.domain === 'wash' ? 'cleaning' : service.domain === 'build' ? 'assembly' : 'plumbing',
      address: address || `Москва, ${service.name}`,
      price,
      client_name: name,
      client_phone: phone,
      client_comment: `${dateOption === 'custom' ? customDate : dateOption} ${timeSlot} — ${comment}`,
      client_chat_id: getClientChatId() ?? undefined,
    });
    setSubmitted(true);
  }, [service, address, dateOption, customDate, timeSlot, name, phone, comment]);

  if (submitted) {
    return (
      <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
        <div className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`} onClick={handleClose} />
        <div className={`relative w-full sm:max-w-[400px] mx-4 mb-4 sm:mb-0 bg-white rounded-[24px] p-8 text-center shadow-2xl transition-all duration-300 ease-out ${visible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'}`}>
          <div className="mx-auto w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-4 animate-bounce">
            <CheckCircle2 size={32} className="text-emerald-500" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900 mb-2">Заявка отправлена!</h3>
          <p className="text-sm text-zinc-400 mb-2">{service.name}</p>
          <p className="text-xs text-zinc-300 mb-6">{dateOption === 'custom' ? customDate : dateOptions.find(d => d.id === dateOption)?.label} • {timeSlots.find(t => t.id === timeSlot)?.label}</p>
          <button type="button" onClick={handleClose} className="w-full py-3 rounded-2xl bg-zinc-900 text-white text-sm font-bold hover:bg-zinc-800 transition-colors">
            Закрыть
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      <div className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`} onClick={handleClose} />
      <div className={`relative w-full sm:max-w-[420px] mx-4 mb-0 sm:mb-0 bg-white rounded-t-[24px] sm:rounded-[24px] shadow-2xl overflow-hidden transition-all duration-300 ease-out max-h-[90vh] overflow-y-auto ${visible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-full sm:translate-y-8 opacity-0 scale-95'}`}>
        <div className="sticky top-0 z-10 bg-white border-b border-zinc-100 p-4 sm:p-5">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{service.icon}</span>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-zinc-900">{service.name}</h3>
                <p className="text-[10px] sm:text-[11px] text-zinc-400">{service.brand} • {service.time}</p>
              </div>
            </div>
            <button type="button" onClick={handleClose} className="p-1.5 rounded-full hover:bg-zinc-100 transition-colors">
              <X size={18} className="text-zinc-400" />
            </button>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-base sm:text-lg font-bold text-zinc-900">от {service.price} ₽</span>
            <div className="flex-1" />
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <div key={s} className={`h-1 flex-1 rounded-full transition-all duration-300 ${step >= s ? 'bg-zinc-900' : 'bg-zinc-200'}`} />
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5">
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">Когда нужен мастер?</h4>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {dateOptions.map((d) => (
                  <button key={d.id} type="button" onClick={() => { setDateOption(d.id); if (d.id !== 'custom') setStep(2); }}
                    className={`p-3 rounded-2xl border text-left transition-all duration-200 ${dateOption === d.id ? 'border-zinc-900 bg-zinc-50 shadow-sm' : 'border-zinc-200 hover:border-zinc-300'}`}>
                    <p className="text-sm font-bold text-zinc-800">{d.label}</p>
                    <p className="text-[10px] sm:text-[11px] text-zinc-400 mt-0.5">{d.sub}</p>
                  </button>
                ))}
              </div>
              {dateOption === 'custom' && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-200">
                  <input type="date" value={customDate} onChange={(e) => setCustomDate(e.target.value)}
                    min={today.toISOString().split('T')[0]}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-zinc-400 transition-colors mb-3" />
                  {customDate && (
                    <button type="button" onClick={() => setStep(2)}
                      className="w-full py-3 rounded-2xl bg-zinc-900 text-white text-sm font-bold hover:bg-zinc-800 transition-colors">
                      Далее
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">Удобное время</h4>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {timeSlots.map((t) => (
                  <button key={t.id} type="button" onClick={() => { setTimeSlot(t.id); setStep(3); }}
                    className={`p-3 rounded-2xl border text-left transition-all duration-200 ${timeSlot === t.id ? 'border-zinc-900 bg-zinc-50 shadow-sm' : 'border-zinc-200 hover:border-zinc-300'}`}>
                    <p className="text-sm font-bold text-zinc-800">{t.label}</p>
                    <p className="text-[10px] sm:text-[11px] text-zinc-400 mt-0.5">{t.sub}</p>
                  </button>
                ))}
              </div>
              <button type="button" onClick={() => setStep(1)} className="text-xs font-semibold text-zinc-400 hover:text-zinc-600 transition-colors">
                ← Назад к дате
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">Ваши данные</h4>
              <div className="space-y-3">
                <input type="text" placeholder="Ваше имя" value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-zinc-400 transition-colors" />
                <input type="tel" placeholder="+7 (___) ___-__-__" value={phone} onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-zinc-400 transition-colors" />
                <input type="text" placeholder="Адрес (улица, дом)" value={address} onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-zinc-400 transition-colors" />
                <textarea placeholder="Комментарий к заказу" value={comment} onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-zinc-400 transition-colors resize-none h-20" />
              </div>
              <button type="button" onClick={() => setStep(2)} className="text-xs font-semibold text-zinc-400 hover:text-zinc-600 transition-colors mt-3">
                ← Назад ко времени
              </button>
            </div>
          )}

          {step === 4 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">Подтвердите заказ</h4>
              <div className="bg-zinc-50 rounded-2xl p-4 mb-4 space-y-2">
                <div className="flex justify-between text-sm"><span className="text-zinc-400">Услуга</span><span className="font-semibold text-zinc-800">{service.name}</span></div>
                <div className="flex justify-between text-sm"><span className="text-zinc-400">Дата</span><span className="font-semibold text-zinc-800">{dateOption === 'custom' ? customDate : dateOptions.find(d => d.id === dateOption)?.label}</span></div>
                <div className="flex justify-between text-sm"><span className="text-zinc-400">Время</span><span className="font-semibold text-zinc-800">{timeSlots.find(t => t.id === timeSlot)?.label}</span></div>
                <div className="flex justify-between text-sm"><span className="text-zinc-400">Имя</span><span className="font-semibold text-zinc-800">{name}</span></div>
                <div className="flex justify-between text-sm"><span className="text-zinc-400">Телефон</span><span className="font-semibold text-zinc-800">{phone}</span></div>
                {address && <div className="flex justify-between text-sm"><span className="text-zinc-400">Адрес</span><span className="font-semibold text-zinc-800">{address}</span></div>}
                <div className="border-t border-zinc-200 pt-2 mt-2 flex justify-between"><span className="text-sm font-bold text-zinc-800">Итого</span><span className="text-lg font-bold text-zinc-900">от {service.price} ₽</span></div>
              </div>
              <button type="button" onClick={() => setStep(3)} className="text-xs font-semibold text-zinc-400 hover:text-zinc-600 mb-3">
                ← Изменить данные
              </button>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-white border-t border-zinc-100 p-4 sm:p-5 space-y-2">
          {step < 4 ? (
            <button type="button" onClick={() => {
              if (step === 1 && dateOption && dateOption !== 'custom') setStep(2);
              else if (step === 2 && timeSlot) setStep(3);
              else if (step === 3 && name && phone) setStep(4);
            }} disabled={(step === 1 && !dateOption) || (step === 2 && !timeSlot) || (step === 3 && (!name || !phone))}
              className="w-full py-3.5 rounded-2xl bg-zinc-900 text-white text-sm font-bold disabled:opacity-30 hover:bg-zinc-800 transition-all duration-200 active:scale-[0.98]">
              {step === 1 ? 'Выбрать время →' : step === 2 ? 'Ввести данные →' : 'Проверить заказ →'}
            </button>
          ) : (
            <button type="button" onClick={handleSubmit}
              className="w-full py-3.5 rounded-2xl bg-zinc-900 text-white text-sm font-bold hover:bg-zinc-800 transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2">
              <Zap size={14} /> Подтвердить заказ
            </button>
          )}
          <div className="flex gap-2">
            <a href="tel:+79001234567" className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-zinc-50 border border-zinc-200 text-[11px] sm:text-xs font-semibold text-zinc-500 hover:bg-zinc-100 transition-colors">
              <Phone size={12} /> Позвонить
            </a>
            <a href="https://t.me/" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-zinc-50 border border-zinc-200 text-[11px] sm:text-xs font-semibold text-zinc-500 hover:bg-zinc-100 transition-colors">
              <MessageCircle size={12} /> Telegram
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
