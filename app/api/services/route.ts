import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

const CONFIG_FILE = path.join(process.cwd(), 'data', 'services.json');

export async function GET() {
  try {
    const raw = await readFile(CONFIG_FILE, 'utf-8');
    return NextResponse.json(JSON.parse(raw));
  } catch {
    return NextResponse.json([]);
  }
}
