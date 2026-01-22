import type { Metadata, Viewport } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
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
      <body className={`${spaceGrotesk.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
