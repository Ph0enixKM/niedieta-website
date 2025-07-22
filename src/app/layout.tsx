import type { Metadata } from "next";
import "./globals.css";
import "@fontsource-variable/playwrite-is";
import "@fontsource/dm-serif-display";
import "@fontsource/lato";
import "@fontsource/lato/300.css";
import "@fontsource/inter";

export const metadata: Metadata = {
  title: "NieDieta",
  description: "NieDieta: Jak jeść zdrowo i smacznie bez restrykcji",
  openGraph: {
    title: "NieDieta",
    siteName: "Czyli jak jeść zdrowo i smacznie bez restrykcji",
    type: 'website',
    images: [
      {
          url: 'https://niedieta.pl/og.jpg'
      }
    ]
  }
};

export const viewport = {
  themeColor: "#FFEBE1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
        <body>
          {children}
        </body>
    </html>
  );
}
