'use client'

import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react'
import { PetraWallet } from 'petra-plugin-wallet-adapter'
import { PontemWallet } from '@pontem/wallet-adapter-plugin'
import { FewchaWallet } from 'fewcha-plugin-wallet-adapter'
import { MartianWallet } from '@martianwallet/aptos-wallet-adapter'
import { RiseWallet } from '@rise-wallet/wallet-adapter'
import { ThemeProvider } from '@sushiswap/ui'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
const wallets = [new PetraWallet(), new PontemWallet(), new FewchaWallet(), new MartianWallet(), new RiseWallet()]

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient()
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AptosWalletAdapterProvider plugins={wallets} autoConnect={true}>
          <ThemeProvider>{children}</ThemeProvider>
        </AptosWalletAdapterProvider>
      </QueryClientProvider>
    </>
  )
}
