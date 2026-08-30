import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileBottomNav from '@/components/MobileBottomNav';
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  title: 'NABRIJAN MARKET — Buy. Sell. Earn. Grow.',
  description: 'Bangladesh-first multi-vendor marketplace and commerce ecosystem.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans bg-slate-50 text-slate-900 antialiased pb-16 md:pb-0">
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
          <MobileBottomNav />
        </div>
        <Analytics />
      </body>
    </html>
  );
}
