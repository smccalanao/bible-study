import type { Metadata, Viewport } from "next";
import { Figtree, Literata } from "next/font/google";
import { AppShell } from "@/components/AppShell";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import { withBase } from "@/lib/basePath";
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
    "Read Scripture offline with highlights, notes, and stories.",
  applicationName: "Bible Study",
  manifest: withBase("/manifest.webmanifest"),
  appleWebApp: {
    capable: true,
    title: "Bible Study",
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
  icons: {
    icon: [
      { url: withBase("/icons/icon-192.png"), sizes: "192x192", type: "image/png" },
      { url: withBase("/icons/icon-512.png"), sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: withBase("/icons/icon-192.png"), sizes: "192x192", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#1f6f6a",
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
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
