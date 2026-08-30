import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileBottomNav from '@/components/MobileBottomNav';
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  title: 'NABRIJAN MARKET — Modern Anime Pink Cyber Marketplace',
  description: 'Bangladesh-first multi-vendor marketplace with anime girl mascot NABI and nationwide delivery network.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="max-w-full overflow-x-hidden">
      <body className="font-sans bg-slate-950 text-slate-100 antialiased pb-16 md:pb-0 max-w-full overflow-x-hidden">
        <div className="flex flex-col min-h-screen max-w-full overflow-x-hidden">
          <Header />
          <main className="flex-grow max-w-full overflow-x-hidden">{children}</main>
          <Footer />
          <MobileBottomNav />
        </div>
        <Analytics />
      </body>
    </html>
  );
}
