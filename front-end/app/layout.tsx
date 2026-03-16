import React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar, SidebarProvider, Header } from "@/components/sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AgroManage | Enterprise Agriculture Ecosystem",
  description: "Advanced management system for agricultural business operations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="antialiased">
      <body className={`${geistSans.variable} ${geistMono.variable} font-body bg-background text-foreground min-h-screen selection:bg-primary/10 overflow-x-hidden`}>
        <SidebarProvider>
          <div className="relative flex min-h-screen w-full">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 bg-background">
              <Header />
              {children}
            </div>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
