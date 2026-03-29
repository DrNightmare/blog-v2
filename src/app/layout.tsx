import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";

import CommandPalette from "@/components/CommandPalette";

import Providers from "@/components/Providers";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  // Subset of variable axis: skip hairline–200; keep light (300) through black (900) for Tailwind utilities.
  weight: "300 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "300 900",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  title: {
    default: "Arvind Prakash",
    template: "%s | Arvind Prakash",
  },
  description:
    "Staff engineer building elegant systems. Essays, notes, projects, and experiments.",
  openGraph: {
    title: "Arvind Prakash",
    description:
      "Staff engineer building elegant systems. Essays, notes, projects, and experiments.",
    type: "website",
    url: "/",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Arvind Prakash",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Arvind Prakash",
    description:
      "Staff engineer building elegant systems. Essays, notes, projects, and experiments.",
    images: ["/twitter-image"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex flex-col min-h-screen overflow-y-scroll antialiased`}
      >
        <Providers>
          <CommandPalette />
          <Navbar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
