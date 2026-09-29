import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'FARO | AI-Powered Capital Allocation OS',
  description: 'Understand your capital. Research opportunities. Allocate with evidence. Institutional investment terminal and autonomous financial agents.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#F5F4F5] text-[#141618] font-sans">
        {children}
      </body>
    </html>
  );
}
