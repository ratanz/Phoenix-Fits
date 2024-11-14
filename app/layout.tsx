import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./providers";
import dynamic from 'next/dynamic';

 dynamic(() => import('@/components/ToastManger'), { ssr: false });

const spacer = localFont({
  src: "./fonts/Spacer36.otf",
  variable: "--font-spacer",
});

const glorich = localFont({
  src: "./fonts/Glorich-Bold.otf",
  variable: "--font-glorich",
});

export const metadata: Metadata = {
  title: "Phoenix Fits",
  description: "Not your average clothing store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${spacer.variable} ${glorich.variable} antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}