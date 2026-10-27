import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import { Footer } from "@/components/Footer";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Splash · SNAPkids",
  description:
    "Splash keeps SNAPkids instructors and families connected: classes, swimmers, and adaptive swimming resources.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0B63B8",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} flex min-h-dvh flex-col font-sans antialiased`}>
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
