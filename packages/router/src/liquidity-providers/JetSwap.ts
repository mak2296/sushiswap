import { ChainId } from '@sushiswap/chain'
import type { ethers } from 'ethers'

import type { Limited } from '../Limited'
import { MultiCallProvider } from '../MulticallProvider'
import { LiquidityProviders } from './LiquidityProvider'
import { UniswapV2BaseProvider } from './UniswapV2Base'

export class JetSwapProvider extends UniswapV2BaseProvider {
  factory = {
    [ChainId.POLYGON]: '0x668ad0ed2622C62E24f0d5ab6B6Ac1b9D2cD4AC7',
    [ChainId.BSC]: '0x0eb58E5c8aA63314ff5547289185cC4583DfCBD5',
    [ChainId.FANTOM]: '0xf6488205957f0b4497053d6422F49e27944eE3Dd',
  } as const
  initCodeHash = {
    [ChainId.POLYGON]: '0x505c843b83f01afef714149e8b174427d552e1aca4834b4f9b4b525f426ff3c6',
    [ChainId.BSC]: '0x3125d0a15fa7af49ce234ba1cf5f931bad0504242e0e1ee9fcd7d1d7aa88c651',
    [ChainId.FANTOM]: '0xa5e6089ea250dac750e4867fc4ce7f2a864bd94446564351fe9329f378963974',
  } as const
  constructor(
    chainDataProvider: ethers.providers.BaseProvider,
    multiCallProvider: MultiCallProvider,
    chainId: ChainId,
    l: Limited
  ) {
    super(chainDataProvider, multiCallProvider, chainId, l)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.JetSwap
  }
  getPoolProviderName(): string {
    return 'JetSwap'
  }
}