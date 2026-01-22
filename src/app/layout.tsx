import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Press_Start_2P, Inter, Bangers } from "next/font/google";

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

const bangers = Bangers({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0f0f1a",
};

export const metadata: Metadata = {
  title: "WRECKIT | The AI Coding Revolution",
  description: "AI coding tools that ship. Built by AI. Powered by $WRECKIT. Join the waitlist for early access.",
  metadataBase: new URL("https://getwreckit.xyz"),
  openGraph: {
    title: "WRECKIT | The AI Coding Revolution",
    description: "AI coding tools that ship. Built by AI. Powered by $WRECKIT.",
    url: "https://getwreckit.xyz",
    siteName: "WRECKIT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WRECKIT | The AI Coding Revolution",
    description: "AI coding tools that ship. Built by AI. Powered by $WRECKIT.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${pressStart2P.variable} ${inter.variable} ${bangers.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
