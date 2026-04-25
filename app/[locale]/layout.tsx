import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import ChatbotWrapper from "@/components/ChatbotWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Zemen Co. | Digital Architecture for Habesha Excellence",
  description: "We build premium, high-converting websites and AI systems for Ethiopian and Eritrean businesses. Deep Roots. Limitless Growth.",
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Zemen Co.',
    description: 'Digital Architecture for Habesha Excellence',
    url: 'https://zemenco.com',
    siteName: 'Zemen Co.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default async function RootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir}>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <div className="noise-overlay" />
          {children}
          <ChatbotWrapper />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
