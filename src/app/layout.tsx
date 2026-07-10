import type { Metadata, Viewport } from "next";
import { Figtree, Literata } from "next/font/google";
import { AppShell } from "@/components/AppShell";
import "./globals.css";

const ui = Figtree({
  variable: "--font-ui",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const scripture = Literata({
  variable: "--font-scripture",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Bible Study",
  description:
    "Read, search, highlight, and follow daily plans — offline-friendly public-domain Bibles.",
  applicationName: "Bible Study",
  appleWebApp: {
    capable: true,
    title: "Bible Study",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#eef2f6",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${ui.variable} ${scripture.variable} h-full`}>
      <body className="min-h-full antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
