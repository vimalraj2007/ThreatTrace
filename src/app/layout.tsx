import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { GlobalSearchModal } from "@/components/layout/GlobalSearchModal";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "ThreatTrace | AI-Assisted Cyberattack Reconstruction Platform",
  description: "Enterprise SOC & DFIR platform for multi-stage cyberattack reconstruction and lateral movement detection.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans bg-[#080c14] text-slate-100 antialiased min-h-screen flex flex-col selection:bg-cyan-500 selection:text-slate-950`}
      >
        <Providers>
          <Navbar />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#080c14]">
              {children}
            </main>
          </div>
          <GlobalSearchModal />
        </Providers>
      </body>
    </html>
  );
}
