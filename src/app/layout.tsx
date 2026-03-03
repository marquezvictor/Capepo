import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { BottomNav } from "@/components/BottomNav";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CaPickle",
  description:
    "Your mobile first pickleball companion for live scores and tournaments",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} bg-background text-foreground antialiased`}
      >
        <div className="min-h-dvh pb-24">{children}</div>
        <BottomNav />
      </body>
    </html>
  );
}
