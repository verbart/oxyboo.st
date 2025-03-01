import type React from 'react';
import { Analytics } from '@vercel/analytics/next';
import { ThemeProvider } from '@/components/theme-provider';
import { ThemeSwitcher } from '@/components/theme-switcher';
import '@/styles/globals.css';

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-title" content="OxyBoost" />
        <meta name="apple-itunes-app" content="app-id=6739809272" />
        <meta
          name="description"
          content="OxyBoost is the apnea training app for freedivers, athletes, and breathing enthusiasts"
        />
        <meta
          name="keywords"
          content="apnea, apnea trainer, freedive, sta, static, freediving, breath, breathing, training"
        />
        <title>OxyBoost - Apnea Trainer</title>
      </head>

      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ThemeSwitcher />

          {children}

          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}

