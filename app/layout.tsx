import type React from 'react';
import '@/styles/globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { ThemeSwitcher } from '@/components/theme-switcher';

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ThemeSwitcher />

          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

