/** @jsx jsx */
import React from 'react'
import { jsx, Flex, Styled } from 'theme-ui'
import * as Utils from 'web3-utils'
import { useRouter } from 'next/router'
import AccountLayout from '../../layouts/account'
import PageLayout from '../../layouts/main'
import List from '../../components/List'
import ListItem from '../../components/ListItem'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { withApollo } from '../../lib/apollo'
import CircularProgress from '@material-ui/core/CircularProgress'
import Card from '../../components/Card'
import Unlink from '../../static/img/unlink.svg'
import {
  UnbondingLock,
  Transcoder,
  Delegator,
  Round,
  Protocol,
} from '../../@types'
import { abbreviateNumber } from '../../lib/utils'

const GET_DATA = gql`
  query($account: ID!) {
    delegator(id: $account) {
      id
      pendingStake
      status
      delegate {
        id
      }
      unbondingLocks {
        id
        amount
        withdrawRound
        delegate {
          id
        }
      }
    }
    transcoder(id: $account) {
      id
      rewardCut
      feeShare
      totalStake
      active
      delegators {
        id
      }
    }
    protocol {
      totalTokenSupply
      totalBondedToken
    }
    currentRound: rounds(first: 1, orderBy: timestamp, orderDirection: desc) {
      id
    }
    # The subgraph subgraph and graphql-sdk use different types for the eth
    # address so we have to pass two separate inputs
    # transactions(address: $address) {
    #   id
    # }
  }
`

export default withApollo(() => {
  const router = useRouter()
  const query = router.query
  const account = query.account as string

  const { data, loading, error } = useQuery(GET_DATA, {
    variables: {
      account: account.toLowerCase(),
      address: account.toLowerCase(),
    },
    notifyOnNetworkStatusChange: true,
    ssr: false,
  })

  if (error) {
    console.error(error)
  }

  if (loading) {
    return (
      <PageLayout>
        <Flex
          sx={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div sx={{ color: 'primary' }}>
            <CircularProgress size={24} color="inherit" />
          </div>
        </Flex>
      </PageLayout>
    )
  }

  const transcoder: Transcoder = data.transcoder
  const delegator: Delegator = data.delegator
  const protocol: Protocol = data.protocol
  const unbondingLocks: Array<UnbondingLock> = delegator.unbondingLocks
  const currentRound: Round = data.currentRound[0]
  const pendingStakeTransactions: Array<UnbondingLock> = unbondingLocks.filter(
    (item: UnbondingLock) =>
      item.withdrawRound && item.withdrawRound > parseInt(currentRound.id, 10),
  )
  const completedStakeTransactions: Array<
    UnbondingLock
  > = unbondingLocks.filter(
    (item: UnbondingLock) =>
      item.withdrawRound && item.withdrawRound <= parseInt(currentRound.id, 10),
  )

  const LinkIcon = (
    <Flex
      sx={{
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 1000,
        color: 'primary',
        bg: 'surface',
        width: 30,
        height: 30,
        mr: 2,
        border: '1px solid',
        borderColor: 'border',
      }}
    >
      <Unlink />
    </Flex>
  )

  return (
    <PageLayout>
      <AccountLayout
        transcoder={transcoder}
        delegator={delegator}
        protocol={protocol}
      >
        <Card
          sx={{ mb: 2 }}
          title="Staked Towards"
          subtitle={
            <div
              sx={{
                fontSize: 5,
                fontWeight: 'text',
                color: 'text',
                lineHeight: 'heading',
              }}
            >
              {delegator.delegate.id.replace(
                delegator.delegate.id.slice(7, 37),
                '…',
              )}
            </div>
          }
        />
        <div
          sx={{
            display: 'grid',
            gridGap: 2,
            gridTemplateColumns: `repeat(auto-fit, minmax(128px, 1fr))`,
            mb: 5,
          }}
        >
          <Card
            sx={{ flex: 1, mb: 2 }}
            title="Total Staked"
            subtitle={
              <div
                sx={{
                  fontSize: 5,
                  color: 'text',
                  lineHeight: 'heading',
                  fontFamily: 'monospace',
                }}
              >
                {abbreviateNumber(Utils.fromWei(delegator.pendingStake), 4)}
                <span sx={{ ml: 1, fontSize: 1 }}>LPT</span>
              </div>
            }
          ></Card>
          <Card
            sx={{ flex: 1, mb: 2 }}
            title="Equity"
            subtitle={
              <div
                sx={{
                  fontSize: 5,
                  color: 'text',
                  lineHeight: 'heading',
                  fontFamily: 'monospace',
                }}
              >
                {(
                  (Utils.fromWei(delegator.pendingStake) /
                    Utils.fromWei(protocol.totalBondedToken)) *
                  100
                ).toPrecision(2)}
                %
              </div>
            }
          ></Card>
        </div>
        {!!pendingStakeTransactions.length && (
          <List
            sx={{ mb: 6 }}
            header={<Styled.h4>Pending Unstake Transactions</Styled.h4>}
          >
            {pendingStakeTransactions.map(lock => (
              <ListItem key={lock.id} avatar={LinkIcon}>
                <div>
                  Unstaking from{' '}
                  {lock.delegate.id.replace(lock.delegate.id.slice(7, 37), '…')}
                </div>
                {/* <span sx={{ fontSize: 0, color: 'muted' }}>Subtitle</span> */}
              </ListItem>
            ))}
          </List>
        )}
        <List header={<Styled.h4>Completed Unstake Transactions</Styled.h4>}>
          {!completedStakeTransactions.length && (
            <div sx={{ fontSize: 1, mt: 2 }}>No History</div>
          )}
          {completedStakeTransactions.map(lock => (
            <ListItem key={lock.id} avatar={LinkIcon}>
              <div>
                Unstaked from{' '}
                {lock.delegate.id.replace(lock.delegate.id.slice(7, 37), '…')}
              </div>
            </ListItem>
          ))}
        </List>
      </AccountLayout>
    </PageLayout>
  )
})
