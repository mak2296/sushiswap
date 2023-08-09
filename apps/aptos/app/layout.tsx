import type { Metadata } from 'next'

import '@sushiswap/ui/index.css'
import './../app/swap/css/swap.css'

import React from 'react'
import { Providers } from './providers'
import { Header } from './header'

export const metadata: Metadata = {
  title: {
    default: 'Sushi 🍣',
    template: '%s | Sushi 🍣',
  },
  description:
    'A Decentralised Finance (DeFi) app with features such as swap and permissionless market making for liquidity providers.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=1" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=1" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png?v=1" />
      <link rel="manifest" href="/site.webmanifest?v=1" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg?v=1" color="#fa52a0" />
      <link rel="shortcut icon" href="/favicon.ico?v=1" />
      <body className="h-screen">
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  )
}
