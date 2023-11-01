import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { Token } from './tokenType'
import { FETCH_URL_PREFIX } from 'lib/constants'

export interface coinType {
  type: string
  data: any
}

export async function getTokenData(token: Token) {
  const { account } = useWallet()
  let tokenData: any
  if (account?.address && token) {
    const res = await fetch(`${FETCH_URL_PREFIX}/v1/accounts/${account?.address}/resources`)
    const data = await res.json()
    if (!data.error_code) {
      tokenData = data?.filter((coin: coinType) => {
        return coin?.type.includes(token.address)
      })
    }
  }
  if (tokenData && tokenData[0]?.data?.coin) return tokenData[0]?.data?.coin?.value
  return 0
}
