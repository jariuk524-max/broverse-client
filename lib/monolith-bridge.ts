import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

/** Создаёт заказ напрямую в Supabase (реальная схема orders) */
export async function createOrderInSupabase(payload: {
  service_name: string;
  client_name?: string;
  client_phone?: string;
  address?: string;
  lat?: number;
  lng?: number;
  metadata?: Record<string, unknown>;
}) {
  const { data, error } = await supabase
    .from('orders')
    .insert({
      service_name: payload.service_name,
      client_name: payload.client_name || '',
      client_phone: payload.client_phone || '',
      address: payload.address || '',
      lat: payload.lat || 55.7558 + (Math.random() - 0.5) * 0.04,
      lng: payload.lng || 37.6173 + (Math.random() - 0.5) * 0.04,
      metadata: payload.metadata || null,
      status: 'new',
    })
    .select()
    .single();

  if (error) {
    console.error('[ClientSite] Supabase error:', error);
    return null;
  }

  console.log('[ClientSite] Order created:', data.id);

  // Send Telegram notification
  try {
    await fetch('/api/telegram-notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order: data }),
    });
  } catch (e) {
    console.error('[ClientSite] Telegram notify failed:', e);
  }

  return data;
}

/** Fetches orders from Supabase for display */
export async function fetchOrdersFromSupabase() {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error || !data) {
    console.error('[ClientSite] Fetch error:', error);
    return [];
  }

  return data;
}
