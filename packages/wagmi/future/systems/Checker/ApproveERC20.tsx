import React, { FC, Fragment, useCallback, useState, MouseEvent } from 'react'
import { Button, ButtonProps } from '@sushiswap/ui/future/components/button'
import { Amount, Type } from '@sushiswap/currency'
import { Menu, Popover, Transition } from '@headlessui/react'
import { ChevronRightIcon, InformationCircleIcon } from '@heroicons/react/24/solid'
import { ApprovalState, useTokenApproval } from '../../hooks'
import { Address } from 'wagmi'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { classNames } from '@sushiswap/ui'
import { List } from '@sushiswap/ui/future/components/list/List'

export interface ApproveERC20Props extends ButtonProps<'button'> {
  id: string
  amount: Amount<Type> | undefined
  contract: Address | undefined
  enabled?: boolean
}

export const ApproveERC20: FC<ApproveERC20Props> = ({
  id,
  amount,
  contract,
  children,
  className,
  variant,
  fullWidth,
  as,
  size,
  enabled = true,
}) => {
  const [max, setMax] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [state, { write }] = useTokenApproval({
    amount,
    spender: contract,
    enabled,
    approveMax: max,
  })

  const onMenuItemClick = useCallback((e: MouseEvent<HTMLButtonElement>, isMax: boolean, cb: () => void) => {
    e.stopPropagation()

    if (isMax) {
      setMax(true)
    } else {
      setMax(false)
    }

    cb()
  }, [])

  if (state === ApprovalState.APPROVED || !enabled) {
    return <>{children}</>
  }

  return (
    <Button
      as={as}
      disabled={state !== ApprovalState.NOT_APPROVED}
      loading={[ApprovalState.LOADING, ApprovalState.PENDING].includes(state)}
      testdata-id={id}
      variant={variant}
      size={size}
      className={classNames(className, 'group relative')}
      fullWidth={fullWidth}
      onClick={() => write?.()}
    >
      Approve {amount?.currency.symbol} {max ? 'Permanently' : ''}
      <Menu
        as="div"
        className="relative flex justify-center"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <Menu.Button as="div" role="button" className="text-center text-xs text-blue cursor-pointer">
          <InformationCircleIcon width={18} height={18} className="text-white" />
        </Menu.Button>
        <Transition
          as={Fragment}
          show={showTooltip}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <div className="z-10 absolute pb-2 w-[max-content] bottom-4">
            <Menu.Items className="text-left w-[240px] text-gray-700  border-gray-300 dark:border-slate-700 dark:text-slate-200 flex flex-col gap-3 bg-white dark:bg-slate-800 rounded-lg shadow-hover-card shadow-black/30 px-4 py-3 text-xs mt-0.5">
              <span className="text-gray-500 dark:text-slate-400">Token Approval</span>
              We need your approval to execute this transaction on your behalf. You will only have to approve the{' '}
              {amount?.currency.symbol} contract once.
              <a
                target="_blank"
                className="text-blue dark:text-blue dark:font-semibold flex gap-1 items-center hover:text-blue-700"
                href="https://www.sushi.com/academy/articles/what-is-token-approval"
                rel="noreferrer"
              >
                Learn more <ChevronRightIcon width={12} height={12} />
              </a>
            </Menu.Items>
          </div>
        </Transition>
      </Menu>
      <div className="absolute right-1 top-1 bottom-1 w-[52px]">
        <div className="relative z-[100] w-full h-full">
          <Popover as={Fragment}>
            {({ open, close }) => (
              <>
                <Popover.Button
                  as="button"
                  className={classNames(
                    open ? 'bg-black/[0.12]' : '',
                    'hover:bg-black/[0.12] h-full w-full flex items-center justify-center rounded-lg'
                  )}
                >
                  <ChevronDownIcon width={24} height={24} />
                </Popover.Button>
                <Transition
                  show={open}
                  enter="sm:transition duration-300 ease-out"
                  enterFrom="sm:transform sm:translate-y-[-16px] opacity-0"
                  enterTo="sm:transform sm:translate-y-0 opacity-100"
                  leave="sm:transition duration-300 ease-out"
                  leaveFrom="sm:transform sm:translate-y-0 opacity-100"
                  leaveTo="sm:transform sm:translate-y-[-16px] opacity-0"
                >
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="fixed inset-0 bg-black/50 backdrop-blur transform-gpu"
                    />
                  </Transition.Child>
                  <div className={classNames('right-0 absolute pt-3 -top-[-1] sm:w-[320px]')}>
                    <div className="p-2 flex flex-col w-full fixed bottom-0 left-0 right-0 sm:absolute sm:bottom-[unset] sm:left-[unset] rounded-2xl rounded-b-none sm:rounded-b-xl shadow-md bg-white dark:bg-slate-800">
                      <Popover.Panel>
                        <List.MenuItem
                          as="button"
                          onClick={(e: MouseEvent<HTMLButtonElement>) => onMenuItemClick(e, false, close)}
                          title="Approve one-time only"
                          subtitle={`You'll give your approval to spend ${amount?.toSignificant(6)} ${
                            amount?.currency?.symbol
                          } on your behalf`}
                        />
                        <List.MenuItem
                          onClick={(e: MouseEvent<HTMLButtonElement>) => onMenuItemClick(e, true, close)}
                          as="button"
                          title="Approve unlimited amount"
                          subtitle={`You won't need to approve again next time you want to spend ${amount?.currency?.symbol}.`}
                        />
                      </Popover.Panel>
                    </div>
                  </div>
                </Transition>
              </>
            )}
          </Popover>
        </div>
      </div>
    </Button>
  )
}
