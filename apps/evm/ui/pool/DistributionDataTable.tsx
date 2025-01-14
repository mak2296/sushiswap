import { CheckIcon } from '@heroicons/react/20/solid'
import { AngleRewardsPool } from '@sushiswap/react-query'
import {
  Currency,
  DataTable,
  SkeletonText,
  TimeAgo,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@sushiswap/ui'
import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { FC, useMemo } from 'react'

import { rewardPerDay } from '../../lib/functions'

interface DistributionDataTableProps {
  isLoading: boolean
  data?: AngleRewardsPool['distributionData']
}

const COLUMNS = [
  {
    id: 'reward',
    header: 'Reward (per day)',
    cell: (props) => {
      const { start, end, amount, token } = props.row.original
      const _reward = rewardPerDay({ start, end, amount, token })
      if (!_reward) return <>n/a</>

      return (
        <div className="whitespace-nowrap flex items-center gap-2">
          <Currency.Icon currency={_reward.currency} width={18} height={18} />
          {_reward.toSignificant(6)} {_reward.currency.symbol}
        </div>
      )
    },
    meta: {
      skeleton: <SkeletonText fontSize="lg" />,
      headerDescription:
        'The amount of tokens that gets distributed per day to everyone that provided liquidity to this pool.',
    },
  },
  {
    id: 'duration',
    header: 'Started',
    cell: (props) => {
      const { start } = props.row.original
      return (
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <TimeAgo
                className="whitespace-nowrap underline decoration-dotted"
                value={new Date(start * 1000)}
              />
            </TooltipTrigger>
            <TooltipContent>
              {format(new Date(start * 1000), 'dd MMM yyyy HH:mm')}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    },
    meta: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
  },
  {
    id: 'end',
    header: 'Ends in',
    cell: (props) => {
      const { end } = props.row.original
      return (
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <TimeAgo
                className="whitespace-nowrap underline decoration-dotted"
                value={new Date(end * 1000)}
              />
            </TooltipTrigger>
            <TooltipContent>
              {format(new Date(end * 1000), 'dd MMM yyyy HH:mm')}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    },
    meta: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
  },
  {
    id: 'oorIncentivized',
    header: 'In-range only',
    cell: (props) => {
      const { isOutOfRangeIncentivized } = props.row.original
      if (isOutOfRangeIncentivized) return <></>
      return <CheckIcon width={20} height={20} className="text-green" />
    },
    meta: {
      skeleton: <SkeletonText fontSize="lg" />,
      headerDescription: 'Only rewards in-range positions',
    },
  },
] satisfies ColumnDef<AngleRewardsPool['distributionData'][0], unknown>[]

export const DistributionDataTable: FC<DistributionDataTableProps> = ({
  isLoading,
  data,
}) => {
  const _data = useMemo(() => {
    return data ?? []
  }, [data])

  return <DataTable loading={isLoading} columns={COLUMNS} data={_data} />
}
