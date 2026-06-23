import { NextResponse } from 'next/server';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const MASTER_CHAT_ID = process.env.NEXT_PUBLIC_MASTER_CHAT_ID;

async function sendTelegramMessage(chatId: string, text: string): Promise<boolean> {
  if (!BOT_TOKEN) {
    console.error('[Telegram] TELEGRAM_BOT_TOKEN not set');
    return false;
  }

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: 'HTML',
        }),
      }
    );
    const data = await res.json();
    if (!data.ok) {
      console.error('[Telegram] API error:', data.description);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[Telegram] fetch failed:', err);
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const { order } = await request.json();

    if (!order || !order.service_name) {
      return NextResponse.json({ error: 'Invalid order data' }, { status: 400 });
    }

    const chatId = MASTER_CHAT_ID;
    if (!chatId) {
      return NextResponse.json({ error: 'MASTER_CHAT_ID not configured' }, { status: 400 });
    }

    const time = new Date(order.created_at || Date.now()).toLocaleString('ru-RU', {
      timeZone: 'Europe/Moscow',
    });

    const desc = order.metadata?.description || '';
    const text = [
      `📦 <b>Новый заказ!</b>`,
      ``,
      `🔧 Услуга: <b>${order.service_name}</b>`,
      `👤 Клиент: ${order.client_name || 'Не указан'}`,
      `📞 Телефон: ${order.client_phone || 'Не указан'}`,
      `📍 Адрес: ${order.address || 'Не указан'}`,
      desc ? `📝 ${desc}` : ``,
      ``,
      `🕐 ${time}`,
      order.lat && order.lng
        ? `🗺 <a href="https://www.google.com/maps?q=${order.lat},${order.lng}">Открыть на карте</a>`
        : ``,
    ]
      .filter(Boolean)
      .join('\n');

    const sent = await sendTelegramMessage(chatId, text);

    if (!sent) {
      return NextResponse.json({ error: 'Failed to send Telegram message' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[Telegram Notify] Error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
