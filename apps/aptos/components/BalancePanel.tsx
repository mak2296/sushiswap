import { WalletIcon } from '@sushiswap/ui/future/components/icons'
import { Skeleton } from '@sushiswap/ui/future/components/skeleton'
import React from 'react'

interface Props {
  coinData: number
  isLoading: boolean
  isLoadingLower?: boolean
  decimals: number
}

export const BalancePanel = ({ coinData, isLoading, isLoadingLower, decimals }: Props) => {
  let [big, portion] = (coinData ? `${coinData / 10 ** decimals}` : '0.00').split('.')
  portion = portion ? portion.substring(0, 2) : '00'
  return (
    <button
      id="swap-from-balance-button"
      testdata-id="swap-from-balance-button"
      type="button"
      disabled={true}
      className="text-gray-500 dark:text-slate-500 font-medium flex gap-1.5 items-center py-1 dark:text-slate-400 px-2 rounded-md"
    >
      <WalletIcon width={18} height={18} />
      {isLoading || isLoadingLower ? (
        <div className="w-[60px] flex items-center">
          <Skeleton.Text fontSize="text-lg" className="w-full" />
        </div>
      ) : (
        <span className="text-lg">
          {big}.<span className="text-sm font-semibold">{portion}</span>
        </span>
      )}
    </button>
  )
}
