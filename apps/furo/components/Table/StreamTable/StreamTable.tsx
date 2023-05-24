// @ts-nocheck

import { useBreakpoint } from '@sushiswap/hooks'
import { GenericTable } from '@sushiswap/ui/future/components/table/GenericTable'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { FC, ReactNode, useEffect, useMemo, useState } from 'react'
import { FuroStatus, Stream, Vesting } from '../../../lib'
import { AMOUNT_COLUMN, END_DATE_COLUMN, NETWORK_COLUMN, STREAMED_COLUMN, TYPE_COLUMN } from '../constants'

export enum FuroTableType {
  INCOMING,
  OUTGOING,
}

interface FuroTableProps {
  activeOnly: boolean
  streams: (Stream | undefined)[] | null | undefined
  vestings: (Vesting | undefined)[] | null | undefined
  type: FuroTableType
  placeholder: ReactNode
  loading: boolean
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore

export const StreamTable: FC<FuroTableProps> = ({ streams, vestings, placeholder, activeOnly, loading, type }) => {
  const { isSm } = useBreakpoint('sm')
  const { isMd } = useBreakpoint('md')
  const [columnVisibility, setColumnVisibility] = useState({})

  const COLUMNS = useMemo(() => [NETWORK_COLUMN, STREAMED_COLUMN, TYPE_COLUMN, AMOUNT_COLUMN, END_DATE_COLUMN], [])

  const data = useMemo(() => {
    return [
      ...(streams ? streams.filter(Boolean).filter((el) => (activeOnly ? el.status === FuroStatus.ACTIVE : true)) : []),
      ...(vestings
        ? vestings.filter(Boolean).filter((el) => (activeOnly ? el.status === FuroStatus.ACTIVE : true))
        : []),
    ]
  }, [activeOnly, streams, vestings])

  const table = useReactTable<Stream | Vesting>({
    data: data,
    columns: COLUMNS,
    state: {
      columnVisibility,
    },
    getCoreRowModel: getCoreRowModel(),
    debugTable: true,
    debugHeaders: true,
    manualFiltering: true,
  })

  useEffect(() => {
    if (isSm && !isMd) {
      setColumnVisibility({ status: false, from: false, type: false })
    } else if (isSm) {
      setColumnVisibility({})
    } else {
      setColumnVisibility({
        status: false,
        from: false,
        type: false,
        startDate: false,
      })
    }
  }, [isMd, isSm])

  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <GenericTable<Stream | Vesting>
      loading={loading}
      table={table}
      placeholder={placeholder}
      pageSize={Math.max(data.length, 1)}
      linkFormatter={(row) => `/${row instanceof Stream ? 'stream' : 'vesting'}/${row.chainId}:${row.id}`}
    />
  )
}
