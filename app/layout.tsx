import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Arcana · 私人約會",
  description: "夢角約會行程與站內日程。",
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
