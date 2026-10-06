import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Arcana — A day drawn for you",
  description: "Private tarot itinerary studio. Chance sets the direction; reality sets the limits.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <body className="antialiased">{children}</body>
    </html>
  );
}
