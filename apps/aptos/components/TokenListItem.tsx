import { CheckCircleIcon } from '@heroicons/react/20/solid'
import { Badge } from '@sushiswap/ui/future/components/Badge'
import { Modal } from '@sushiswap/ui/future/components/modal/Modal'
import React, { CSSProperties } from 'react'
import { Token } from 'utils/tokenType'
import { Icon } from './Icon'
type PropType = {
  id: string
  style: CSSProperties
  token: Token
  selected: Token
  handleChangeToken: (token: Token) => void
}
export default function TokenListItem({ id, style, token, selected, handleChangeToken }: PropType) {
  return (
    <div className="py-0.5 h-[64px]" style={style}>
      <Modal.Trigger tag={`${id}-token-selector-modal`}>
        {({ close }) => (
          <div
            className={`group flex items-center w-full active:bg-black/[0.06] dark:active:bg-white/[0.06] hover:bg-black/[0.04] dark:hover:bg-white/[0.04] h-full rounded-lg px-3 token-$TRDL cursor-pointer`}
            onClick={() => {
              handleChangeToken(token)
              close()
            }}
          >
            <div className="flex items-center justify-between flex-grow gap-2 rounded">
              <div className="flex flex-row items-center flex-grow gap-4">
                {selected == token ? (
                  <Badge
                    position="bottom-right"
                    badgeContent={
                      <div className="bg-white dark:bg-slate-800 rounded-full">
                        <CheckCircleIcon width={20} height={20} className="text-blue rounded-full" />
                      </div>
                    }
                  >
                    <div className="w-10 h-10">
                      <Icon currency={token} />
                    </div>
                  </Badge>
                ) : (
                  <div className="w-10 h-10">
                    <Icon currency={token} />
                  </div>
                )}
                <div className="flex flex-col items-start">
                  <span className="font-semibold text-gray-900 group-hover:text-gray-900 dark:text-slate-50 group-hover:dark:text-white">
                    {token?.symbol}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-slate-400 group-hover:dark:text-blue-100">
                    {token?.name}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal.Trigger>
    </div>
  )
}
