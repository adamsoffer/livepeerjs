/** @jsx jsx */
import { jsx } from 'theme-ui'
import Button from '../Button'
import Stake from './Stake'
import Unstake from './Unstake'
import Link from 'next/link'
import { Account, Delegator, Transcoder } from '../../@types'

interface Props {
  action: string
  amount: string
  transcoder: Transcoder
  delegator?: Delegator
  account: Account
}

export default ({ delegator, transcoder, action, amount, account }: Props) => {
  if (!account) {
    return (
      <Link href="/connect-wallet" passHref>
        <a>
          <Button sx={{ width: '100%' }}>Connect Wallet</Button>
        </a>
      </Link>
    )
  }

  const bondedAmount = delegator ? delegator.bondedAmount : 0
  const hasTokenBalance = account && parseInt(account.tokenBalance) == 0
  const canStake = hasTokenBalance && bondedAmount
  const canUnstake = bondedAmount > 0

  if (action == 'stake') {
    return (
      <>
        <Stake disabled={!canStake} transcoder={transcoder} amount={amount} />
        <div
          sx={{
            px: 2,
            pt: 2,
            color: 'muted',
            textAlign: 'center',
            fontSize: 0,
          }}
        >
          {!hasTokenBalance && `You have 0 LPT in your wallet.`}
        </div>
      </>
    )
  }
  return (
    <>
      <Unstake disabled={!canUnstake} transcoder={transcoder} amount={amount} />
      {!canUnstake && (
        <div
          sx={{
            px: 2,
            pt: 2,
            color: 'muted',
            textAlign: 'center',
            fontSize: 0,
          }}
        >
          {`One must stake before one can unstake.`}
        </div>
      )}
    </>
  )
}
