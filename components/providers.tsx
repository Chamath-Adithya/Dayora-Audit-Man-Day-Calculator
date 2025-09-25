'use client'

import React from 'react'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from '@/components/theme-provider'
import { ConfigProvider } from '@/components/config-provider'
import { Toaster } from '@/components/ui/sonner'

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <ConfigProvider>
          {children}
          <Toaster />
        </ConfigProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}
