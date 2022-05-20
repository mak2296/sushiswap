import { Auction } from 'features/context/Auction'
import { AuctionRepresentation } from 'features/context/representations'
import { getUserAuctions } from 'graph/graph-client'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import { FC, useMemo } from 'react'
import useSWR, { SWRConfig } from 'swr'
import { useNetwork } from 'wagmi'

import Layout from '../../../../components/Layout'

const fetcher = (params: any) =>
  fetch(params)
    .then((res) => res.json())
    .catch((e) => console.log(JSON.stringify(e)))

interface Props {
  fallback?: Record<string, any>
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
  if (typeof query.chainId !== 'string' || typeof query.address !== 'string') return { props: {} }
  return {
    props: {
      fallback: {
        [`/api/user/${query.address}/auctions/${query.chainId}`]: await getUserAuctions(query.address, query.chainId),
      },
    },
  }
}

const _UserAuctionsPage: FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ fallback }) => {
  const router = useRouter()
  const chainId = Number(router.query.chainId)
  const address = router.query.address as string

  return (
    <SWRConfig value={{ fallback }}>
      <UserAuctionsPage chainId={chainId} address={address} />
    </SWRConfig>
  )
}

export const UserAuctionsPage: FC<{ chainId: number; address: string }> = ({ chainId, address }) => {
  const { data: auctionRepresentations, isValidating } = useSWR<AuctionRepresentation[]>(
    `/auction-market/api/user/${address}/auctions/${chainId}`,
    fetcher,
  )
  const { activeChain } = useNetwork()

  const auctions = useMemo(
    () => (activeChain?.id ? auctionRepresentations?.map((auction) => new Auction({ chainId: activeChain.id, auction })) : []),
    [auctionRepresentations, activeChain],
  )
  return (
    <Layout>
      <h1>Auctions</h1>

      {auctions?.length ? (
        auctions.map((auction) => (
          <div key={auction.id}>
            {auction.status} {``}
            {auction.rewardAmount.toExact()} {auction.rewardAmount.currency.symbol} {``}
            {auction.bidAmount.toExact()} {auction.bidAmount.currency.symbol} {``}
            {auction.startDate.toLocaleDateString()} {``}
            {auction.endDate?.toLocaleDateString()} {``}
            {auction.remainingTime?.hours} {'H'} {auction.remainingTime?.minutes} {'M'} {auction.remainingTime?.seconds}{' '}
            {'S'}
          </div>
        ))
      ) : (
        <div>
          <i>No Auctions found..</i>
        </div>
      )}
    </Layout>
  )
}

export default _UserAuctionsPage
