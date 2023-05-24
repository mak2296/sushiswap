import { Pool } from '@sushiswap/v3-sdk'
import { FC, useMemo, useState } from 'react'
import { Transaction, useTransactionsV3 } from './useTransactionsV3'
import {
  PaginationState,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { AMOUNT_COLUMN, AMOUNT_USD_COLUMN, SENDER_COLUMN, TIME_COLUMN, TYPE_COLUMN } from './columns'
import { GenericTable } from '@sushiswap/ui/future/components/table/GenericTable'
import { Chain } from '@sushiswap/chain'
import { Paginator } from '@sushiswap/ui/table/Paginator'

interface PoolTransactionsV3Props {
  pool: Pool | undefined | null
  poolId: string
}

const COLUMNS = [TYPE_COLUMN, SENDER_COLUMN, AMOUNT_COLUMN, AMOUNT_USD_COLUMN, TIME_COLUMN] as any

const PAGE_SIZE = 10

// Query currently hardcoded to 200 transactions, not sure why it's not listening to my args
const PAGE_COUNT = 200 / PAGE_SIZE

export const PoolTransactionsV3: FC<PoolTransactionsV3Props> = ({ pool, poolId }) => {
  const [pageIndex, setPageIndex] = useState<number>(0)

  const { data, isLoading } = useTransactionsV3(pool, poolId, {
    refetchInterval: 60_000,
    first: 200, //PAGE_SIZE * (pageIndex + 1),
  })

  const dataPaged = useMemo(
    () => data?.slice(pageIndex * PAGE_SIZE, (pageIndex + 1) * PAGE_SIZE) || [],
    [data, pageIndex]
  )

  const table = useReactTable<Transaction>({
    data: dataPaged,
    columns: COLUMNS,
    pageCount: pageIndex + 1,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
  })

  return (
    <div className="w-full">
      <GenericTable<Transaction>
        table={table}
        loading={isLoading}
        pageSize={PAGE_SIZE}
        rowHeight={24}
        placeholder="No Transactions Found."
        linkFormatter={(row) => Chain.from(row.pool.chainId).getTxUrl(row.id)}
      />
      <Paginator
        page={pageIndex}
        hasPrev={pageIndex > 0}
        onNext={() => setPageIndex(pageIndex + 1)}
        onPage={() => {}}
        hasNext={pageIndex < PAGE_COUNT - 1}
        onPrev={() => setPageIndex(pageIndex - 1)}
        pageSize={PAGE_SIZE}
      />
    </div>
  )
}
