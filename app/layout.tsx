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
        {/* Smart App Banner for Safari */}
        <meta name="apple-itunes-app" content="app-id=6739809272, app-argument=https://oxyboo.st" />

        {/* For Android */}
        <meta name="google-play-app" content="app-id=com.verbart.oxyboost" />

        {/* For Universal Links and App Links */}
        <meta property="al:ios:url" content="oxyboost://" />
        <meta property="al:ios:app_store_id" content="6739809272" />
        <meta property="al:ios:app_name" content="OxyBoost" />

        <meta property="al:android:url" content="oxyboost://" />
        <meta property="al:android:package" content="com.verbart.oxyboost" />
        <meta property="al:android:app_name" content="OxyBoost" />

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

      <body suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ThemeSwitcher />

          {children}

          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}

