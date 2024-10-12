import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./providers";
import dynamic from 'next/dynamic';

const ToastManager = dynamic(() => import('@/components/ToastManger'), { ssr: false });

const spacer = localFont({
  src: "./fonts/Spacer36.otf",
  variable: "--font-spacer",
});

const judas = localFont({
  src: "./fonts/judasc__.otf",
  variable: "--font-judas",
});

export const metadata: Metadata = {
  title: "gorbastore",
  description: "Not your average clothing store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${spacer.variable} ${judas.variable} antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}