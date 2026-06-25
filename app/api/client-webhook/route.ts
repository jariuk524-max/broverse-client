import { NextResponse } from 'next/server';
import { sendClientWelcome } from '@/lib/client-bot';

export async function POST(request: Request) {
  try {
    const body = await request.json();

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
