/**
 * Root Layout Component
 * 
 * This component sets up the root HTML structure for the Next.js application.
 * It includes:
 * - Font configuration (Geist Sans and Geist Mono)
 * - Global CSS styles
 * - Buffer polyfill for browser compatibility (needed for Solana/Web3)
 * - Dark mode enabled by default
 * - Page metadata
 */

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Configure Geist Sans font
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Configure Geist Mono font
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Polyfill Buffer for browser compatibility
// Required for Solana Web3.js and other crypto libraries that expect Node.js Buffer
if (typeof window !== 'undefined') {
    window.Buffer = window.Buffer || require('buffer').Buffer;
}

// Page metadata for SEO and browser display
export const metadata: Metadata = {
  title: "Lazorkit Passkey Auth Flow",
  description: "A simple example of passkey-based authentication using LazorKit on Solana.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
