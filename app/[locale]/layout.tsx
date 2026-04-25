import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import ChatbotWrapper from "@/components/ChatbotWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Zemen Co. | Deep Roots. Limitless Growth.",
  description: "We build high-converting websites and integrate smart AI systems that help Habesha businesses scale, automate operations, and dominate local markets.",
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
