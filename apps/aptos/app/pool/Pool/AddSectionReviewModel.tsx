import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Typography } from '@sushiswap/ui'
import { Modal } from '@sushiswap/ui/future/components/modal/Modal'
import { ModalType } from '@sushiswap/ui/future/components/modal/ModalProvider'
import { FC, ReactNode, useState } from 'react'
import { Rate } from './Rate'
import { usePoolActions, usePoolState } from './PoolProvider'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { Button } from '@sushiswap/ui/future/components/button'
import { Icon } from 'components/Icon'

interface Props {
  children({ close }: { close: () => void }): ReactNode
}

export const AddSectionReviewModal: FC<Props> = ({ children }) => {
  const { token0, token1, amount0, amount1, isPriceFetching } = usePoolState()
  const { account, signAndSubmitTransaction } = useWallet()
  const { setisTransactionPending } = usePoolActions()
  const [open, setOpen] = useState(false)
  return (
    <Modal.Review modalType={ModalType.Regular} variant="transparent" tag="add-liquidity">
      {({ close }) => (
        <>
          <div className="flex justify-between items-center pb-4">
            <h3 className="flex justify-center text-lg font-medium leading-6 text-slate-100">Add Liquidity</h3>
            <Button variant="outlined" color="default" className="!p-2 !rounded-full" onClick={close}>
              <XMarkIcon height={24} width={24} className="hover:text-slate-50 text-slate-100" />
            </Button>
          </div>
          <div className="!my-0 grid grid-cols-12 items-center">
            <div className="relative flex flex-col col-span-12 gap-1 p-2 border sm:p-4 rounded-2xl bg-slate-700/40 border-slate-200/5">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-between w-full gap-2">
                  <Typography variant="h3" weight={500} className="truncate text-slate-50">
                    {amount0}
                  </Typography>
                  <div className="flex items-center justify-end gap-2 text-right">
                    {/* <img src={token0.logoURI} className="rounded-full" width={26} height={56} /> */}
                    <Icon currency={token0} width={26} height={26} />
                    <Typography variant="h3" weight={500} className="text-right text-slate-50">
                      {token0?.symbol}
                    </Typography>
                  </div>
                </div>
              </div>
              <Typography variant="sm" weight={500} className="text-slate-500">
                {/* {amount0 ? `$${amount0}` : '-'} */}
              </Typography>
            </div>
            <div className="flex items-center justify-center col-span-12 -mt-2.5 -mb-2.5">
              <div className="p-0.5 bg-slate-700 border-2 border-slate-800 ring-1 ring-slate-200/5 z-10 rounded-full">
                <PlusIcon width={18} height={18} className="text-slate-200" />
              </div>
            </div>
            <div className="flex flex-col col-span-12 gap-1 p-2 border sm:p-4 rounded-2xl bg-slate-700/40 border-slate-200/5">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-between w-full gap-2">
                  <Typography variant="h3" weight={500} className="truncate text-slate-50">
                    {amount1}
                  </Typography>
                  <div className="flex items-center justify-end gap-2 text-right">
                    <Icon currency={token1} width={26} height={26} />
                    {/* <img src={token1.logoURI} className="rounded-full" width={26} height={56} /> */}
                    <Typography variant="h3" weight={500} className="text-right text-slate-50">
                      {token1?.symbol}
                    </Typography>
                  </div>
                </div>
              </div>
              <Typography variant="sm" weight={500} className="text-slate-500">
                {/* {value1 ? `$${value1.toFixed(2)}` : ''} */}
              </Typography>
            </div>
          </div>
          <div className="flex justify-center p-4">
            <Rate>
              {({ toggleInvert, content }) => (
                <Typography
                  as="button"
                  onClick={() => toggleInvert()}
                  variant="sm"
                  weight={600}
                  className="flex items-center gap-1 text-slate-100"
                >
                  {content} {<span className="font-normal text-slate-300">(${})</span>}
                </Typography>
              )}
            </Rate>
          </div>
          {children({ close })}
        </>
      )}
    </Modal.Review>
  )
}
