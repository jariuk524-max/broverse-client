import type { BroverseLeadPayload } from './domains';
import { createClient } from '@supabase/supabase-js';

const MONOLITH_ORIGIN =
  process.env.NEXT_PUBLIC_MONOLITH_URL ?? 'http://localhost:3000';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

/** Создаёт заказ напрямую в Supabase */
export async function createOrderInSupabase(payload: {
  title: string;
  service?: string;
  address?: string;
  price?: number;
  lat?: number;
  lng?: number;
  client_name?: string;
  client_phone?: string;
  client_comment?: string;
}) {
  const { data, error } = await supabase
    .from('orders')
    .insert({
      title: payload.title,
      service: payload.service || 'cleaning',
      address: payload.address || '',
      price: payload.price || 0,
      lat: payload.lat || 55.7558 + (Math.random() - 0.5) * 0.04,
      lng: payload.lng || 37.6173 + (Math.random() - 0.5) * 0.04,
      client_name: payload.client_name || '',
      client_phone: payload.client_phone || '',
      client_comment: payload.client_comment || '',
      status: 'new',
    })
    .select()
    .single();

  if (error) {
    console.error('[ClientSite] Supabase error:', error);
    return null;
  }

  console.log('[ClientSite] Order created:', data.id);
  return data;
}

const MONOLITH_WINDOW_NAME = 'broverse-monolith';

let monolithWindow: Window | null = null;

function ensureMonolithWindow(): Window | null {
  if (typeof window === 'undefined') return null;

  if (monolithWindow && !monolithWindow.closed) {
    monolithWindow.focus();
    return monolithWindow;
  }

  monolithWindow = window.open(MONOLITH_ORIGIN, MONOLITH_WINDOW_NAME);
  return monolithWindow;
}

function postLead(win: Window, payload: BroverseLeadPayload) {
  win.postMessage({ type: 'BROVERSE_LEAD', payload }, MONOLITH_ORIGIN);
}

/** Отправляет лид в Монолит (:3000) через postMessage */
export function sendLeadToMonolith(payload: BroverseLeadPayload): boolean {
  const win = ensureMonolithWindow();
  if (!win) return false;

  const message = { type: 'BROVERSE_LEAD' as const, payload };

  postLead(win, payload);

  [600, 1500, 3000].forEach((ms) => {
    setTimeout(() => {
      if (win.closed) return;
      win.postMessage(message, MONOLITH_ORIGIN);
    }, ms);
  });

  return true;
}
