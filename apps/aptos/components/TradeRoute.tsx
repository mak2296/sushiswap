import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { Modal } from '@sushiswap/ui/future/components/modal/Modal'
import React, { CSSProperties, ReactElement } from 'react'
import { useTokens } from 'utils/useTokens'
import { Icon } from './Icon'
interface Props {
  trade: string[]
}
export const TradeRoute = ({ trade }: Props) => {
  const rows: JSX.Element[] = []
  for (let i = 0; i < trade.length - 1; i++) {
    rows.push(<ComplexRoutePath key={i} fromTokenAddress={trade[i]} toTokenAddress={trade[i + 1]} />)
  }
  return (
    <Modal.Review variant="transparent" tag="trade-state-modal">
      {({}) => (
        <>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2">
              <h3 className="font-medium flex justify-center text-xl leading-6 text-gray-900 dark:text-slate-100">
                Optimized route
              </h3>
            </div>
            {rows}
          </div>
        </>
      )}
    </Modal.Review>
  )
}

interface ComplexRoutePathProps {
  fromTokenAddress: string
  toTokenAddress: string
}

const ComplexRoutePath = ({ fromTokenAddress, toTokenAddress }: ComplexRoutePathProps) => {
  const { network } = useWallet()
  const { data: tokens } = useTokens(Number(network?.chainId))
  const fromToken = tokens && tokens[fromTokenAddress]
  const toToken = tokens && tokens[toTokenAddress]
  return (
    <div className="relative grid grid-cols-12 gap-3 rounded-full border-gray-200 dark:border-black/[0.12] bg-gray-200 dark:bg-black/[0.12] border-2 p-2">
      <div
        className="absolute z-[0] inset-0 rounded-full pointer-events-none bg-white dark:bg-slate-700/[0.6]"
        style={{ width: `100px)` }}
      />
      <div className="z-[1] col-span-3 text-xs font-semibold text-gray-900 dark:text-slate-200 flex items-center gap-2">
        <Icon currency={fromToken} width={16} height={16} />
        <span className="truncate">{fromToken?.symbol}</span>
      </div>
      <div className="z-[1] col-span-2 text-xs font-semibold text-gray-500 dark:text-slate-500 truncate text-right">
        100.00%
      </div>
      <div className="z-[1] col-span-4 text-xs font-semibold text-gray-900 dark:text-slate-200 truncate"></div>
      <div className="z-[1] col-span-3 text-xs font-semibold text-gray-900 dark:text-slate-200 flex items-center justify-end gap-2">
        <Icon currency={toToken} width={16} height={16} />
        <span className="text-xs font-semibold text-gray-900 dark:text-slate-200 truncate">{toToken?.symbol}</span>
      </div>
    </div>
  )
}
