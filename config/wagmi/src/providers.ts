import type { ChainProviderFn } from '@wagmi/core'
import { alchemyProvider } from '@wagmi/core/providers/alchemy'
import { jsonRpcProvider } from '@wagmi/core/providers/jsonRpc'
import { publicProvider } from '@wagmi/core/providers/public'
import { rpcUrls } from './rpc-urls'

export const allProviders: ChainProviderFn[] = [
  jsonRpcProvider({
    rpc: (chain) => {
      if (!rpcUrls[chain.id as keyof typeof rpcUrls]) {
        return null
      }
      return {
        http: rpcUrls[chain.id as keyof typeof rpcUrls][0] as string,
      }
    },
  }),
  alchemyProvider({
    apiKey: (process.env['ALCHEMY_ID'] ||
      process.env['NEXT_PUBLIC_ALCHEMY_ID']) as string,
  }),
  // infuraProvider({ infuraId }),
  publicProvider(),
]
