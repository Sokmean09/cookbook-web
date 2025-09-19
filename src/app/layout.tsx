import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "./_components/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cookbook",
  description: "Cookbook Web Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full flex flex-col`}
      >
        <main className="flex-1 bg-gray-300">
          <AuthProvider>
            {children}
          </AuthProvider>
        </main>
        <footer className="text-center text-gray-400 bg-indigo-950 py-4">
          © {new Date().getFullYear()} Cookbook Web
        </footer>
      </body>
    </html>
  );
}

