import { NextResponse } from 'next/server';
import { sendClientWelcome } from '@/lib/client-bot';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.callback_query) {
      const { id } = body.callback_query;
      // Acknowledge callback to prevent retry
      const CLIENT_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
      if (CLIENT_BOT_TOKEN) {
        await fetch(`https://api.telegram.org/bot${CLIENT_BOT_TOKEN}/answerCallbackQuery`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ callback_query_id: id }),
        });
      }
      return NextResponse.json({ ok: true });
    }

    if (body.message) {
      const chatId = body.message.chat.id;
      await sendClientWelcome(chatId);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[client-webhook] Error:', error);
    return NextResponse.json({ ok: true });
  }
}

export async function GET() {
  return NextResponse.json({
    usage: 'POST webhook endpoint for BroVerse Client Bot',
    bot: 'BroVerse Client Bot',
    webapp: 'https://broverse-client.vercel.app',
  });
}
