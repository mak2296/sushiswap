import { useQuery } from '@tanstack/react-query'
import { Token } from './tokenType'
import { useCustomTokens } from './useCustomTokens'
interface GetTokenWithQueryCacheFn {
  address: string | undefined
  hasToken: (currency: string | Token) => boolean
  customTokens: Record<string, Token>
}
export const getTokenDetails = async ({ address, hasToken, customTokens }: GetTokenWithQueryCacheFn) => {
  if (hasToken(`${address}`)) {
    const { address: tokenAddress, name, symbol, decimals } = customTokens[`${address}`]
    return {
      address: tokenAddress,
      name,
      symbol,
      decimals,
    } as Token
  }
  if (!address) return {} as Token
  const tokenAddress = address.split(':')
  const response = await fetch(
    `https://fullnode.testnet.aptoslabs.com/v1/accounts/${tokenAddress[0]}/resource/0x1::coin::CoinInfo<${address}>`
  )
  if (response.status == 200) {
    const data = await response.json()
    const tokenAddress = data?.type.slice(20).slice(0, -1)
    return {
      address: tokenAddress,
      decimals: data.data.decimals,
      name: data.data.name,
      symbol: data.data.symbol,
    } as Token
  }
  return {} as Token
}

interface UseTokenParams {
  address: string
  enabled?: boolean
  keepPreviousData?: boolean
}

export default function useTokenWithCache({ address, enabled = true, keepPreviousData = true }: UseTokenParams) {
  const { data: customTokens, hasToken } = useCustomTokens()
  return useQuery({
    queryKey: ['token', { address }],
    queryFn: async () => address && getTokenDetails({ address, hasToken, customTokens }),
    enabled: Boolean(enabled && address),
    refetchOnWindowFocus: false,
    keepPreviousData,
    retry: false,
  })
}
