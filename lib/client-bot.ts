const CLIENT_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const CLIENT_WEBAPP_URL = 'https://broverse-client.vercel.app';

const STATUS_LABELS: Record<string, { text: string; emoji: string }> = {
  new: { text: 'Новый', emoji: '🆕' },
  pending: { text: 'Новый', emoji: '🆕' },
  accepted: { text: 'В работе', emoji: '🔧' },
  completed: { text: 'Выполнен', emoji: '✅' },
  cancelled: { text: 'Отменён', emoji: '❌' },
};

export async function sendClientWelcome(chatId: number) {
  if (!CLIENT_BOT_TOKEN) return;

  try {
    await fetch(`https://api.telegram.org/bot${CLIENT_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: '🔧 BroVerse\n\nЭкосистема профессионального братства.\n\nВыберите услугу и оставьте заявку — мастер свяжется с вами.',
        reply_markup: {
          inline_keyboard: [
            [{ text: '🏠 Открыть BroVerse', web_app: { url: CLIENT_WEBAPP_URL } }],
          ],
        },
      }),
    });
  } catch (err) {
    console.error('[client-bot] Failed to send welcome:', err);
  }
}

export async function notifyClientOrderUpdate(
  clientChatId: number,
  orderId: string,
  serviceName: string,
  status: string,
) {
  if (!CLIENT_BOT_TOKEN) return;

  const statusInfo = STATUS_LABELS[status] || { text: status, emoji: '📋' };

  const text = [
    `${statusInfo.emoji} *Обновление заказа*`,
    ``,
    `📋 *${serviceName}*`,
    `Статус: ${statusInfo.text}`,
    ``,
    `Заказ #${orderId.slice(0, 8)}`,
  ].join('\n');

  try {
    const res = await fetch(`https://api.telegram.org/bot${CLIENT_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: clientChatId,
        text,
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [{ text: '🏠 Открыть BroVerse', web_app: { url: CLIENT_WEBAPP_URL } }],
          ],
        },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('[client-bot] Telegram API error:', err);
    } else {
      console.log(`[client-bot] Notification sent to client ${clientChatId} for order ${orderId}`);
    }
  } catch (err) {
    console.error('[client-bot] Failed to send notification:', err);
  }
}

export async function setClientBotMenu() {
  if (!CLIENT_BOT_TOKEN) return;

  try {
    const res = await fetch(`https://api.telegram.org/bot${CLIENT_BOT_TOKEN}/setChatMenuButton`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        menu_button: {
          type: 'web_app',
          text: '🏠 Услуги',
          web_app: { url: CLIENT_WEBAPP_URL },
        },
      }),
    });

    const data = await res.json();
    console.log('[client-bot] Menu button set:', data);
    return data;
  } catch (err) {
    console.error('[client-bot] Failed to set menu button:', err);
  }
}

export async function setClientBotWebhook(baseUrl: string) {
  if (!CLIENT_BOT_TOKEN) return;

  const webhookUrl = `${baseUrl}/api/client-webhook`;

  try {
    const res = await fetch(`https://api.telegram.org/bot${CLIENT_BOT_TOKEN}/setWebhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: webhookUrl,
        allowed_updates: ['message', 'callback_query'],
      }),
    });

    const data = await res.json();
    console.log('[client-bot] Webhook set:', data);
    return data;
  } catch (err) {
    console.error('[client-bot] Failed to set webhook:', err);
  }
}
