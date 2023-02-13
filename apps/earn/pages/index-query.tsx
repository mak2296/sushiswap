import { PoolType } from '@sushiswap/client'
import { useRouter } from 'next/router'
import { FC, useMemo } from 'react'
import { z } from 'zod'
import { _Pools } from '.'

const schema = z.object({
  chainIds: z
    .string()
    .transform((chainIds) => chainIds.split(',').map((chainId) => Number(chainId)))
    .optional(),
  poolTypes: z
    .string()
    .optional()
    .transform((poolTypes) => poolTypes?.split(',') as PoolType[]),
  incentivizedOnly: z.string().optional().transform(Boolean),
})

const Pools: FC = () => {
  const { query } = useRouter()
  const filters = useMemo(() => (query ? schema.parse(query) : undefined), [query])

  return <_Pools filters={filters} />
}

export default Pools