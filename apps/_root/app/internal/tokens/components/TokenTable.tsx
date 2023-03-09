'use client'

import { GenericTable } from '@sushiswap/ui/table/GenericTable'
import { Token } from '../lib'
import { FC } from 'react'
import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { CheckIcon, Loader, NetworkIcon } from '@sushiswap/ui'
import { CHAIN_NAME } from '@sushiswap/graph-config'
import { ChainId } from '@sushiswap/chain'
import { formatUSD } from '@sushiswap/format'
import { XIcon } from '@heroicons/react/outline'
import { TokenAdder } from './TokenAdder'

interface TokenTable {
  tokens: Token[]
}

const columnHelper = createColumnHelper<Token>()
function useColumns() {
  return [
    columnHelper.accessor('chainId', {
      header: 'Chain',
      cell: (info) => {
        const chainId = info.getValue()
        return (
          <div className="flex space-x-2">
            <NetworkIcon type="circle" chainId={chainId} width={20} height={20} />
            <div>{CHAIN_NAME[chainId] ?? ChainId[chainId]}</div>
          </div>
        )
      },
      enableHiding: true,
    }),
    columnHelper.accessor('symbol', {
      header: 'Symbol',
      cell: (info) => info.getValue(),
      enableHiding: true,
    }),
    columnHelper.accessor('name', {
      header: 'Name',
      // cell: (info) => info.getValue(),
      cell: (info) => {
        const name = info.getValue()
        return <div className="flex justify-start w-full max-w-[150px]">{name}</div>
      },
      enableHiding: true,
    }),
    columnHelper.accessor('liquidityUSD', {
      header: 'Liquidity',
      cell: (info) => formatUSD(info.getValue()),
      enableHiding: true,
    }),
    columnHelper.accessor('volumeUSD', {
      header: 'Total Volume',
      cell: (info) => formatUSD(info.getValue()),
      enableHiding: true,
    }),
    columnHelper.accessor('listEntry', {
      header: 'Default List',
      cell: (info) => (
        <div className="flex justify-center max-w-[50px]">
          {info.getValue() ? (
            <CheckIcon width={24} height={24} className="text-green" />
          ) : (
            <XIcon width={24} height={24} className="text-red" />
          )}
        </div>
      ),
      enableHiding: true,
    }),
    columnHelper.display({
      id: 'addToDefaultList',
      header: 'Adder',
      cell: ({ row }) => (
        <div
          className="flex justify-center max-w-[50px]"
          onClick={(e) => {
            e.preventDefault()
          }}
        >
          <TokenAdder token={row.original} hasIcon={Boolean(row.original.listEntry?.logoURI)} />
        </div>
      ),
    }),
  ]
}

export const TokenTable: FC<TokenTable> = ({ tokens }) => {
  const columns = useColumns()

  const table = useReactTable<Token>({
    data: tokens,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <GenericTable<Token>
      table={table}
      // @ts-ignore
      columns={columns}
      pageSize={20}
      placeholder={<Loader />}
      // getLink={(row) => chains[row.chainId].getTokenUrl(row.id.split(':')[1])}
    />
  )
}
