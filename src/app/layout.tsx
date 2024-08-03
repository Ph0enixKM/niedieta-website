import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@fontsource-variable/playwrite-is";
import "@fontsource/dm-serif-display";
import "@fontsource/lato";
import "@fontsource/lato/300.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NieDieta",
  description: "NieDieta: Jak jeść zdrowo i smacznie bez restrykcji"
};

export const viewport = {
  themeColor: "#eee",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
