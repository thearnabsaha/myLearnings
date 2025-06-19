"use client"
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient()
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      enableColorScheme
    >
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </NextThemesProvider>
  )
}
