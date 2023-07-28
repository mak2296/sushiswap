import { FC, useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { IconButton } from '@sushiswap/ui/future/components/IconButton'
import { Layout } from 'components/Layout'
import { ContentBlock } from 'components/ContentBlock'
import TradeInput from 'components/TradeInput'
import { PlusIcon, ArrowLeftIcon } from '@heroicons/react/20/solid'
import { getPoolPairs } from 'utils/utilFunctions'
import { SelectNetworkWidget, SelectTokensWidget } from 'components/NewPositionSection'
import { usePoolActions, usePoolState } from 'app/pool/Pool/PoolProvider'
import { Network, Provider } from 'aptos'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { AddLiquidityButton } from 'app/pool/Pool/AddLiquidityButton'
import { AddSectionReviewModal } from 'app/pool/Pool/AddSectionReviewModel'
import { Button } from '@sushiswap/ui/future/components/button'
import { createToast } from 'components/toast'
import { liquidityArgs } from 'utils/liquidityPayload'
import { getTokensWithoutKey } from 'utils/useTokens'
import { useTokenBalance } from 'utils/useTokenBalance'
import Loading from 'app/loading'
import { useAccount } from 'utils/useAccount'

export function Add() {
  // const router = useRouter()

  const { pairs, poolPairRatio } = usePoolState()

  const { network } = useWallet()
  const { isLoadingAccount } = useAccount()

  getPoolPairs(network?.name)
  console.log(pairs)
  console.log(poolPairRatio)

  return (
    <>
      {isLoadingAccount && <Loading />}
      <Layout className="flex justify-center">
        <div className="flex flex-col gap-2">
          <Link className="flex items-center gap-4 mb-2 group" href="/pool" shallow={true}>
            <IconButton
              icon={ArrowLeftIcon}
              iconProps={{
                width: 24,
                height: 24,
                transparent: true,
              }}
            />
            <span className="group-hover:opacity-[1] transition-all opacity-0 text-sm font-medium">
              Go back to pools list
            </span>
          </Link>
          <h1 className="mt-2 text-3xl font-medium">Add Liquidity</h1>
          <h1 className="text-lg text-gray-600 dark:dark:text-slate-400">
            Create a new pool or create a liquidity position on an existing pool.
          </h1>
        </div>
        <div className="grid grid-cols-1 sm:w-[340px] md:w-[572px] gap-10">
          <div className="hidden md:block">
            <_Add />
          </div>
        </div>
      </Layout>
    </>
  )
}

const _Add: FC = () => {
  const { network, disconnect, account, signAndSubmitTransaction } = useWallet()
  const [error0, setError0] = useState('')
  const [error1, setError1] = useState('')

  type payloadType = {
    type: string
    type_arguments: string[]
    arguments: number[]
    function: string
  }

  const addLiquidity = async (close: () => void) => {
    const networkType = network?.name?.toLocaleLowerCase() == 'testnet' ? Network.TESTNET : Network.MAINNET
    const provider = new Provider(networkType)
    const payload: payloadType = liquidityArgs(
      token0.address,
      token1.address,
      parseInt(String(Number(amount0) * 10 ** token0.decimals)),
      parseInt(String(Number(amount1) * 10 ** token1.decimals)),
      networkType
    )
    setisTransactionPending(true)
    if (!account) return []
    try {
      const response: any = await signAndSubmitTransaction(payload)
      console.log(response)
      await provider.waitForTransaction(response?.hash)
      if (!response?.success) return
      const toastId = `completed:${response?.hash}`
      const summery = pairs
        ? `Successfully added liquidity to the ${token0.symbol}/${token1.symbol} pair`
        : `Created the ${token0.symbol}/${token1.symbol} liquidity pool`
      createToast({
        summery: summery,
        toastId: toastId,
      })
      setisTransactionPending(false)
      close()
      setAmount0('')
      setAmount1('')
    } catch (error) {
      const toastId = `failed:${Math.random()}`
      createToast({ summery: `User rejected request`, toastId: toastId })
      close()
    } finally {
      setisTransactionPending(false)
    }
  }

  const { connected } = useWallet()

  const { setToken0, setToken1, setAmount0, setAmount1, setisTransactionPending } = usePoolActions()
  const { token0, token1, amount0, amount1, isPriceFetching, poolPairRatio, pairs } = usePoolState()
  console.log('poolPairRatio', poolPairRatio)
  const { data: balance0, isLoading: isLoadingBalance0 } = useTokenBalance(
    account?.address as string,
    token0,
    Number(network?.chainId) || 1
  )
  const { data: balance1, isLoading: isLoadingBalance1 } = useTokenBalance(
    account?.address as string,
    token1,
    Number(network?.chainId) || 1
  )
  const tradeVal = useRef<HTMLInputElement>(null)
  const tradeVal1 = useRef<HTMLInputElement>(null)

  const onChangeToken0TypedAmount = useCallback(
    (value: string) => {
      console.log(poolPairRatio)
      PoolInputBalance0(value)
      setAmount0(value)
      console.log(pairs)
      console.log(value, '---', pairs?.data?.reserve_x, pairs?.data?.reserve_y)
      if (pairs?.data) {
        if (value) {
          const reserve_x = pairs?.data?.reserve_x
          const reserve_y = pairs?.data?.reserve_y

          setAmount1(String(parseFloat(String(value)) * poolPairRatio))
          console.log(String(parseFloat(String(value)) * (reserve_y / reserve_x)))
          console.log(pairs)
        } else {
          setAmount1('')
        }
      }
    },
    [poolPairRatio]
  )

  const onChangeToken1TypedAmount = useCallback(
    (value: string) => {
      PoolInputBalance1(value)
      setAmount1(value)
      console.log(pairs)
      console.log(value, '---', pairs?.data?.reserve_x, pairs?.data?.reserve_y)
      if (pairs?.data) {
        if (value) {
          const reserve_x = pairs?.data?.reserve_x
          const reserve_y = pairs?.data?.reserve_y
          setAmount0(String(parseFloat(String(value)) * poolPairRatio))
          console.log(String(parseFloat(String(value)) * (reserve_x / reserve_y)))
          console.log(pairs)
        } else {
          setAmount0('')
        }
      }
    },
    [poolPairRatio]
  )
  const tokensWithoutKey = getTokensWithoutKey(Number(network?.chainId) || 1)
  useEffect(() => {
    if (network?.name === undefined) {
      disconnect()
    }
    setToken0(tokensWithoutKey[0])
    setToken1(tokensWithoutKey[1])
  }, [network])

  const provider = new Provider(Network.TESTNET)

  useEffect(() => {
    onChangeToken0TypedAmount(String(amount0))
  }, [account, connected, network, token0, token1, balance0, poolPairRatio])
  useEffect(() => {
    PoolInputBalance1(String(amount1))
  }, [amount1, token1])
  // useEffect(() => {
  //   onChangeToken1TypedAmount(String(amount1))
  // }, [account, connected, network, amount1, balance1, poolPairRatio])

  const PoolInputBalance0 = (tradeVal: string) => {
    console.log('-==================', tradeVal)
    const regexPattern = /^[0-9]*(\.[0-9]*)?$/
    if (regexPattern.test(tradeVal)) {
      setAmount0(tradeVal)
    }
    if (connected) {
      const priceEst = balance0 / 10 ** token0.decimals < parseFloat(tradeVal)
      if (priceEst) {
        setError0('Exceeds Balance')
      } else {
        setError0('')
      }
    }
  }

  const PoolInputBalance1 = (tradeVal1: string) => {
    console.log(tradeVal1)
    const regexPattern = /^[0-9]*(\.[0-9]*)?$/
    if (regexPattern.test(tradeVal1)) {
      setAmount1(tradeVal1)
    }
    if (connected) {
      const priceEst = balance1 / 10 ** token1.decimals < parseFloat(tradeVal1)
      if (priceEst) {
        setError1('Exceeds Balance')
      } else {
        setError1('')
      }
    }
  }

  const swapTokenIfAlreadySelected = () => {
    setToken0(token1)
    setToken1(token0)
  }

  return (
    <>
      <div className="flex flex-col order-3 gap-[64px] pb-40 sm:order-2">
        <SelectNetworkWidget />
        <SelectTokensWidget handleSwap={swapTokenIfAlreadySelected} />
        <ContentBlock title={<span className="text-gray-900 dark:text-white">Deposit.</span>}>
          <div className="flex flex-col gap-4">
            <TradeInput
              id={`liquidity-from`}
              token={token0}
              alteredSelected={token1}
              value={String(amount0)}
              setToken={setToken0}
              balance={balance0}
              error={error0}
              isLoadingPrice={isLoadingBalance0 || isPriceFetching}
              onUserInput={onChangeToken0TypedAmount}
              tradeVal={tradeVal}
              setAmount={setAmount0}
              type="INPUT"
              handleSwap={swapTokenIfAlreadySelected}
            />
            <div className="left-0 right-0 mt-[-24px] mb-[-24px] flex items-center justify-center">
              <button type="button" className="z-10 p-2 bg-gray-100 rounded-full dark:bg-slate-900">
                <PlusIcon strokeWidth={3} className="w-4 h-4 dark:text-slate-400 text-slate-600" />
              </button>
            </div>
            <TradeInput
              alteredSelected={token0}
              id={`liquidity-to`}
              token={token1}
              value={String(amount1)}
              setToken={setToken1}
              balance={balance1}
              error={error1}
              isLoadingPrice={isLoadingBalance1 || isPriceFetching}
              onUserInput={onChangeToken1TypedAmount}
              tradeVal={tradeVal1}
              setAmount={setAmount1}
              type="INPUT"
              handleSwap={swapTokenIfAlreadySelected}
            />
            <AddLiquidityButton buttonError={error0 || error1} token1Value={String(amount0)} />
          </div>
        </ContentBlock>
        <AddSectionReviewModal>
          {({ close }) => (
            <Button
              size="xl"
              fullWidth
              onClick={() => {
                addLiquidity(close)
              }}
            >
              Add
            </Button>
          )}
        </AddSectionReviewModal>
      </div>
    </>
  )
}
