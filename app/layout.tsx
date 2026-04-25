import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import ChatbotWrapper from "@/components/ChatbotWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Zemen Co. | Deep Roots. Limitless Growth.",
  description: "We build high-converting websites and integrate smart AI systems that help Habesha businesses scale, automate operations, and dominate local markets.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="noise-overlay" />
        {children}
        <ChatbotWrapper />
      </body>
    </html>
  );
}
