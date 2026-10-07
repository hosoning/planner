import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Arcana · 私人约会",
  description: "私人约会行程与日历。",
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
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
