import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import Navbar from "@/components/layout/Navbar";
import BackButton from "@/components/layout/BackButton";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

import CustomCursor from "@/components/CustomCursor";

export const metadata: Metadata = {
  title: "AegisAI - Your Intelligent Medical Guardian",
  description: "Futuristic AI-driven emergency health assistant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased overflow-x-hidden bg-background text-foreground`}>
        <SmoothScrollProvider>
          <CustomCursor />
          <BackButton />
          <Navbar />
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
