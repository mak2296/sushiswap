import { Type, Type as Currency } from '@sushiswap/currency'
import { getBentoBoxContractConfig } from '@sushiswap/wagmi-config'
import { Address, readContracts } from 'wagmi'
import { ChainId } from '@sushiswap/chain'

export const getBentoboxTotals = async (chainId: ChainId | undefined, currencies: (Currency | undefined)[]) => {
  const addresses = currencies
    .filter((currency): currency is Currency => Boolean(currency && currency.wrapped))
    .map((token) => token.wrapped.address)

  const contracts = addresses.map(
    (address) =>
      ({
        chainId,
        address: getBentoBoxContractConfig(chainId).address,
        abi: [
          {
            inputs: [
              {
                internalType: 'contract IERC20',
                name: '',
                type: 'address',
              },
            ],
            name: 'totals',
            outputs: [
              {
                internalType: 'uint128',
                name: 'elastic',
                type: 'uint128',
              },
              {
                internalType: 'uint128',
                name: 'base',
                type: 'uint128',
              },
            ],
            stateMutability: 'view',
            type: 'function',
          },
        ] as const,
        functionName: 'totals',
        args: [address as Address],
      } as const)
  )

  const totals = await readContracts({
    allowFailure: false,
    contracts,
  })

  const result: { base: string; elastic: string }[] = []
  let allResolved = true
  currencies.forEach((currency, index) => {
    if (totals?.[index]) {
      const { base, elastic } = totals[index]
      result[index] = {
        base: base.toHexString(),
        elastic: elastic.toHexString(),
      }
    } else {
      allResolved = false
    }
  })

  if (allResolved) return result
  return null
}

export const getBentoboxTotal = async ({ chainId, currency }: { chainId: ChainId; currency: Type }) => {
  const totals = await getBentoboxTotals(chainId, [currency])

  if (!totals || !currency) {
    return undefined
  }

  return totals[0]
}
