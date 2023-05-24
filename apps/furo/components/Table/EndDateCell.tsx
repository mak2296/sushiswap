import { Typography } from '@sushiswap/ui'
import React, { FC } from 'react'

import { CellProps } from './types'

export const EndDateCell: FC<CellProps> = ({ row }) => {
  return (
    <div className="flex flex-col gap-0.5 justify-end">
      <Typography variant="sm" className="whitespace-nowrap text-right">
        {row.endTime.toLocaleString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          timeZone: 'UTC',
        })}
      </Typography>
    </div>
  )
}
