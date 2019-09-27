/** @jsx jsx */
import { jsx } from 'theme-ui'
import Button from '../Button'
import Stake from './Stake'
import Unstake from './Unstake'
import Link from 'next/link'

export default ({ transcoder, action, amount, context, canStake, account }) => {
  if (!context.active) {
    return (
      <Link href="/connect-wallet" passHref>
        <a>
          <Button sx={{ width: '100%' }}>Connect Wallet</Button>
        </a>
      </Link>
    )
  }

  console.log(account)

  if (action == 'stake') {
    return (
      <>
        <Stake
          disabled={!canStake}
          transcoder={transcoder}
          amount={amount}
          context={context}
        />
      </>
    )
  }
  return (
    <Unstake
      disabled={!canStake}
      transcoder={transcoder}
      amount={amount}
      context={context}
    />
  )
}
