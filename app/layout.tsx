import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const spacer = localFont({
  src: "./fonts/Spacer36.otf",
  variable: "--font-spacer",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spacer.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}