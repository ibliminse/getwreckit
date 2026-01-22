import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Press_Start_2P, Inter, Space_Mono } from "next/font/google";

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0a0a0f",
};

export const metadata: Metadata = {
  title: "WRECKIT | The AI Coding Revolution",
  description: "Free AI coding tools. Built by AI. Powered by $WRECKIT. Join the waitlist for early access.",
  metadataBase: new URL("https://getwreckit.xyz"),
  openGraph: {
    title: "WRECKIT | The AI Coding Revolution",
    description: "Free AI coding tools. Built by AI. Powered by $WRECKIT.",
    url: "https://getwreckit.xyz",
    siteName: "WRECKIT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WRECKIT | The AI Coding Revolution",
    description: "Free AI coding tools. Built by AI. Powered by $WRECKIT.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${pressStart2P.variable} ${inter.variable} ${spaceMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
