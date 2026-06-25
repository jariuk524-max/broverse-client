import { NextResponse } from 'next/server';

const CLIENT_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const CLIENT_WEBAPP_URL = 'https://broverse-client.vercel.app';

async function tg(method: string, body: Record<string, unknown>) {
  const res = await fetch(`https://api.telegram.org/bot${CLIENT_BOT_TOKEN}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function POST(request: Request) {
  try {
    const { action } = await request.json();

    if (action === 'set-webhook') {
      const data = await tg('setWebhook', {
        url: `${CLIENT_WEBAPP_URL}/api/client-webhook`,
        allowed_updates: ['message'],
      });
      return NextResponse.json({ webhook: data });
    }

    if (action === 'delete-webhook') {
      const data = await tg('deleteWebhook', {});
      return NextResponse.json({ webhook: data });
    }

    if (action === 'set-menu') {
      const data = await tg('setChatMenuButton', {
        menu_button: {
          type: 'web_app',
          text: '🏠 Услуги',
          web_app: { url: CLIENT_WEBAPP_URL },
        },
      });
      return NextResponse.json({ menu: data });
    }

    if (action === 'reset') {
      const del = await tg('deleteWebhook', {});
      const menu = await tg('setChatMenuButton', {
        menu_button: {
          type: 'web_app',
          text: '🏠 Услуги',
          web_app: { url: CLIENT_WEBAPP_URL },
        },
      });
      const hook = await tg('setWebhook', {
        url: `${CLIENT_WEBAPP_URL}/api/client-webhook`,
        allowed_updates: ['message'],
      });
      return NextResponse.json({ deleteWebhook: del, menu, webhook: hook });
    }

    if (action === 'get-info') {
      const me = await tg('getMe', {});
      const menu = await tg('getChatMenuButton', { chat_id: 0 });
      const hook = await tg('getWebhookInfo', {});
      return NextResponse.json({ bot: me, menu, webhook: hook });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    console.error('[client-setup] Error:', error);
    return NextResponse.json({ error: 'Setup failed' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    usage: 'POST with { action: "set-webhook" | "delete-webhook" | "set-menu" | "reset" | "get-info" }',
  });
}
