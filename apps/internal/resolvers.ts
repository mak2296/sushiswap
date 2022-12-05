import { BENTOBOX_SUBGRAPH_NAME, SUBGRAPH_HOST } from '@sushiswap/graph-config'

import { Resolvers, SubgraphStatus, SubgraphWithNode } from '.graphclient'
import { getBuiltGraphSDK } from '.graphclient'

export const resolvers: Resolvers = {
  BentoBoxKpi: {
    chainId: (root, args, context) => root.chainId || context.chainId || 137,
  },
  StrategyKpi: {
    chainId: (root, args, context) => root.chainId || context.chainId || 137,
  },
  Query: {
    crossChainBentoBoxKpis: async (root, args, context, info) =>
      Promise.all(
        args.chainIds.map((chainId) =>
          context.BentoBox.Query.bentoBoxKpis({
            root,
            args,
            context: {
              ...context,
              chainId,
              name: BENTOBOX_SUBGRAPH_NAME[chainId],
              host: SUBGRAPH_HOST[chainId],
            },
            info,
          }).then((kpis) =>
            // We send chainId here so we can take it in the resolver above
            kpis.map((kpi) => ({
              ...kpi,
              chainId,
            }))
          )
        )
      ).then((kpis) => kpis.flat()),
    crossChainStrategyKpis: async (root, args, context, info) =>
      Promise.all(
        args.chainIds.map((chainId) =>
          context.BentoBox.Query.strategyKpis({
            root,
            args,
            context: {
              ...context,
              chainId,
              name: BENTOBOX_SUBGRAPH_NAME[chainId],
              host: SUBGRAPH_HOST[chainId],
            },
            info,
          }).then((kpis) =>
            kpis.map((kpi) => ({
              ...kpi,
              chainId,
            }))
          )
        )
      ).then((kpis) => kpis.flat()),
    subgraphs: async (root, args) => {
      const fetch = async ({ subgraphName, nodeUrl }: SubgraphWithNode) => {
        const sdk = getBuiltGraphSDK({ node: nodeUrl })

        switch (args.type) {
          case 'Current': {
            return sdk.CurrentSubgraphIndexingStatus({ subgraphName })
          }
          case 'Pending': {
            return sdk.PendingSubgraphIndexingStatus({ subgraphName })
          }
        }
      }

      return (
        await Promise.all(
          args.subgraphs.map(async (subgraph, i) => {
            // artificial delay to prevent 429s, probably helps
            await new Promise((resolve) => setTimeout(resolve, i * 10))

            return fetch(subgraph).then((statusObject) => {
              const data = Object.values(statusObject)[0]

              if (!data) return undefined
              const hasFailed = data.fatalError?.message ? true : false
              const status: SubgraphStatus = hasFailed
                ? 'Failed'
                : data.chains[0].chainHeadBlock.number - data.chains[0].latestBlock.number <= 50
                ? 'Synced'
                : 'Syncing'

              return {
                subgraphName: subgraph.subgraphName,
                subgraphId: data.subgraph,
                type: args.type,
                status,
                startBlock: data.chains[0].earliestBlock.number as number,
                lastSyncedBlock: data.chains[0].latestBlock.number as number,
                chainHeadBlock: data.chains[0].chainHeadBlock.number as number,
                hasFailed,
                nonFatalErrorCount: data.nonFatalErrors.length,
                entityCount: data.entityCount as number,
              }
            })
          })
        )
      ).filter(Boolean)
    },
  },
}
