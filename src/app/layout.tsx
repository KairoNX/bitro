import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";

import { Toaster } from "@/components/ui/sonner";
import { TRPCReactProvider } from "@/trpc/client";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bitro - Next Generation Development Platform",
  description: "Experience the future of development with Bitro. Advanced coding, collaboration, and project management tools all in one place.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/logo.svg", type: "image/svg+xml" }
    ]
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#ffffff",
  openGraph: {
    title: "Bitro - Next Generation Development Platform",
    description: "Experience the future of development with Bitro. Advanced coding, collaboration, and project management tools all in one place.",
    type: "website",
    locale: "en_US",
    siteName: "Bitro"
  },
  twitter: {
    card: "summary_large_image",
    title: "Bitro - Next Generation Development Platform",
    description: "Experience the future of development with Bitro. Advanced coding, collaboration, and project management tools all in one place."
  },
  metadataBase: new URL("https://bitro.io")
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#C96342",
        },
      }}
    >
      <TRPCReactProvider>
        <html lang="en" suppressHydrationWarning>
          <head>
            <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
          </head>
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Toaster />
              {children}
              <Analytics />
            </ThemeProvider>
          </body>
        </html>
      </TRPCReactProvider>
    </ClerkProvider>
  );
};
