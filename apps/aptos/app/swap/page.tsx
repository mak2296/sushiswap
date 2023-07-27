'use client'
import { Widget as UIWidget } from '@sushiswap/ui/future/components/widget'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { Drawer } from '@sushiswap/ui'
import SwapTrade from 'components/SwapTrade'
import { SwapButton } from 'components/SwapButton'
import React, { useEffect, useState } from 'react'
import { SwitchAppType } from 'widget/SwitchAppType'
import { WidgetTitleV2 } from 'widget/WidgetTitleV2'
import { SettingsModule, SettingsOverlay } from '@sushiswap/ui/future/components/settings'
import Container from '@sushiswap/ui/future/components/Container'
import Loading from 'app/loading'
import { useSlippageTolerance } from '@sushiswap/hooks'
import { TradeReviewDialog } from 'components/TradeReviewDialog'
import { useSwapActions, useSwapState } from './trade/TradeProvider'
import { SwapTradeInput } from 'components/SwapTradeInput'
import { coinType } from 'utils/tokenData'
import { SwapTradeOutput } from 'components/SwapTradeOutput'
import { getTokensWithoutKey, useTokens } from 'utils/useTokens'
import { TradeStats } from 'components/TradeStats'
import { useAccount } from 'utils/useAccount'

export default function SwapPage() {
  const { disconnect, network } = useWallet()
  const { setToken0, setToken1 } = useSwapActions()
  const { token0, token1, isTransactionPending } = useSwapState()
  const { isLoadingAccount } = useAccount()
  const tokensWithoutKey = getTokensWithoutKey(Number(network?.chainId) || 1)

  useEffect(() => {
    if (network?.name === undefined) {
      disconnect()
    }
    if (network?.name?.toLowerCase() === 'devnet') {
      disconnect()
      alert('Devnet chain is not supported, please select to mainnet or testnet')
    }
    setToken0(tokensWithoutKey[0])
    setToken1(tokensWithoutKey[1])
  }, [network])

  const swapTokenIfAlreadySelected = () => {
    setToken0(token1)
    setToken1(token0)
  }
  return (
    <>
      {isLoadingAccount && <Loading />}
      <Container maxWidth={520} className="p-4 mx-auto mt-16 mb-[86px] flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <Drawer.Root>
            <WidgetTitleV2 />
            <div className="flex items-center justify-between">
              <SwitchAppType />
              <SettingsOverlay modules={[SettingsModule.SlippageTolerance, SettingsModule.CarbonOffset]} />
            </div>
            <UIWidget.Content>
              <SwapTradeInput handleSwap={swapTokenIfAlreadySelected} />
              <SwapTrade />
              <SwapTradeOutput handleSwap={swapTokenIfAlreadySelected} />
              <SwapButton />
            </UIWidget.Content>
          </Drawer.Root>
          {/*spacer for fixed positioned swap button */}
        </div>
        <TradeStats />
        <TradeReviewDialog isTransactionPending={isTransactionPending} />
        <div className="h-[68px] w-full" />
        {/* <button onClick={() => testData()}>click</button> */}
      </Container>
    </>
  )
}
