import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: 'BroVerse — Экосистема профессионального братства',
  description: 'BroWash • BroBuild • BroMove • BroRent • BroBrew • BroCare',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="overflow-x-hidden bg-[#FFFFFF] text-zinc-900 antialiased">{children}</body>
    </html>
  );
}
