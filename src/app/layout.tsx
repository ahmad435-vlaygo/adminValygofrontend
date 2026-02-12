import type { Metadata } from "next";
import { Fira_Sans } from 'next/font/google';
import "./globals.css";
import ReduxProvider from "@/providers/ReduxProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";

const firaSans = Fira_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "VALYGO Admin Dashboard",
  description: "Admin dashboard for VALYGO platform",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
        />
      </head>
      <body className={firaSans.className} suppressHydrationWarning>
        <ReduxProvider>
          <ThemeProvider>
            <LanguageProvider>
              {children}
            </LanguageProvider>
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
