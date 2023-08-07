import React, { useEffect, useRef } from 'react'
import TradeInput from './TradeInput'
import { useSwapActions, useSwapState } from 'app/swap/trade/TradeProvider'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { useTokenBalance } from 'utils/useTokenBalance'
import { useSwapRouter } from 'useSwapRouter'

interface Props {
  handleSwap: () => void
}

export const SwapTradeInput = ({ handleSwap }: Props) => {
  const { connected, account, network } = useWallet()
  const tradeVal = useRef<HTMLInputElement>(null)
  const { amount, token0, token1, error } = useSwapState()
  const { data: balance, isLoading } = useTokenBalance({
    account: account?.address as string,
    currency: token0.address,
    chainId: Number(network?.chainId) || 1,
    refetchInterval: 2000,
  })
  const {
    setAmount,
    setError,
    setToken0,
    setOutputAmount,
    setPriceFetching,
    setSlippageAmount,
    setBestRoutes,
    setNoRouteFound,
  } = useSwapActions()

  const { data: routes, isFetching: isPriceFetching } = useSwapRouter({
    network: network?.name?.toLowerCase() || 'mainnet',
    balance,
  })
  useEffect(() => {
    setOutputAmount('')
    setSlippageAmount(0)
    setNoRouteFound('')
    setPriceFetching(isPriceFetching)
    if (Number(amount) > 0) {
      if (routes?.amountOut) {
        setOutputAmount(String(routes?.amountOut))
        setSlippageAmount(routes?.amountOut)
      }
      if (routes?.route) {
        setBestRoutes(routes?.route)
        setNoRouteFound('')
      } else {
        setBestRoutes([])
        setNoRouteFound('Price Impact High')
      }
    }
  }, [amount, routes, isPriceFetching])

  const checkBalance = (value: string) => {
    setAmount(value)
    if (connected && balance) {
      const priceEst = balance / 10 ** token0?.decimals < parseFloat(value)
      if (priceEst) {
        setError('Exceeds Balance')
      } else {
        setError('')
      }
    } else {
      setError('')
    }
  }
  return (
    <TradeInput
      id="swap-from"
      type="INPUT"
      setToken={setToken0}
      token={token0}
      alteredSelected={token1}
      value={String(amount)}
      balance={balance}
      error={error}
      isLoadingPrice={isLoading}
      onUserInput={checkBalance}
      tradeVal={tradeVal}
      setAmount={setAmount}
      handleSwap={handleSwap}
    />
  )
}
