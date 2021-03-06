import { MAX_EARNINGS_CLAIMS_ROUNDS } from '../../lib/utils'

/**
 * Approve an amount for an ERC20 token transfer
 * @param obj
 * @param {string} type - The approval type
 * @param {string} amount - The approval amount
 * @return {Promise}
 */
export async function approve(_obj, _args, _ctx) {
  const { type, amount } = _args

  switch (type) {
    case 'bond':
      const gas = await _ctx.livepeer.rpc.estimateGas(
        'LivepeerToken',
        'approve',
        [_ctx.livepeer.config.contracts.BondingManager.address, amount],
      )
      return await _ctx.livepeer.rpc.approveTokenBondAmount(amount, {
        gas,
        returnTxHash: true,
      })
    default:
      throw new Error(`Approval type "${type}" is not supported.`)
  }
}

/**
 * Submits a bond transaction for a previously approved amount
 * @param obj
 * @param {string} to - The ETH address of the delegate to bond to
 * @param {string} amount - The approval amount
 * @return {Promise}
 */
export async function bond(_obj, _args, _ctx) {
  const { to, amount } = _args
  const gas = await _ctx.livepeer.rpc.estimateGas('BondingManager', 'bond', [
    amount,
    to,
  ])

  return await _ctx.livepeer.rpc.bondApprovedTokenAmount(to, amount, {
    gas: gas,
    returnTxHash: true,
  })
}

/**
 * Batch submits claimEarnings transactions
 * @param obj
 * @param {string} lastClaimRound - The delegator's last claim round
 * @param {string} endRound - The round to claim earnings until
 * @return {Promise}
 */
export async function batchClaimEarnings(_obj, _args, _ctx) {
  const Web3 = require('web3') // use web3 lib for batching transactions
  const web3 = new Web3(_ctx.provider)
  const { lastClaimRound, endRound } = _args
  const { abi, address } = _ctx.livepeer.config.contracts.BondingManager
  const bondingManager = new web3.eth.Contract(abi, address)
  const totalRoundsToClaim = parseInt(endRound) - parseInt(lastClaimRound)
  const quotient = Math.floor(totalRoundsToClaim / MAX_EARNINGS_CLAIMS_ROUNDS)
  const remainder = totalRoundsToClaim % MAX_EARNINGS_CLAIMS_ROUNDS
  const calls = []

  for (let i = 1; i <= quotient; i++) {
    calls.push(
      bondingManager.methods.claimEarnings(
        (parseInt(lastClaimRound) + i * MAX_EARNINGS_CLAIMS_ROUNDS).toString(),
      ).send,
    )
  }

  if (remainder) {
    calls.push(bondingManager.methods.claimEarnings(endRound).send)
  }

  function makeBatchRequest(calls) {
    let batch = new web3.BatchRequest()
    let promises = calls.map(call => {
      return new Promise((res, rej) => {
        let req = call.request({ from: _ctx.account }, (err, txHash) => {
          if (err) {
            rej(err)
          }
          res(txHash)
        })
        batch.add(req)
      })
    })
    batch.execute()
    return Promise.all(promises)
  }

  const txns = await makeBatchRequest(calls)
  const lastTransactionInBatch = txns[calls.length - 1]
  return lastTransactionInBatch
}

/**
 * Submits an unbond transaction
 * @param obj
 * @return {Promise}
 */
export async function unbond(_obj, _args, _ctx) {
  const { amount } = _args
  const gas = await _ctx.livepeer.rpc.estimateGas('BondingManager', 'unbond', [
    amount,
  ])

  return await _ctx.livepeer.rpc.unbond(amount, {
    ..._ctx.livepeer.config.defaultTx,
    gas,
    returnTxHash: true,
  })
}

/**
 * Submits a rebond transaction
 * @param obj
 * @return {Promise}
 */
export async function rebond(_obj, _args, _ctx) {
  const { unbondingLockId } = _args
  const gas = await _ctx.livepeer.rpc.estimateGas('BondingManager', 'rebond', [
    unbondingLockId,
  ])

  return await _ctx.livepeer.rpc.rebond(unbondingLockId, {
    ..._ctx.livepeer.config.defaultTx,
    gas: gas,
    returnTxHash: true,
  })
}

/**
 * Submits a withdrawStake transaction
 * @param obj
 * @return {Promise}
 */
export async function withdrawStake(_obj, _args, _ctx) {
  const { unbondingLockId } = _args

  const gas = await _ctx.livepeer.rpc.estimateGas(
    'BondingManager',
    'withdrawStake',
    [unbondingLockId],
  )

  return await _ctx.livepeer.rpc.withdrawStake(unbondingLockId, {
    ..._ctx.livepeer.config.defaultTx,
    gas: gas,
    returnTxHash: true,
  })
}

/**
 * Submits a withdrawFees transaction
 * @param obj
 * @return {Promise}
 */
export async function withdrawFees(_obj, _args, _ctx) {
  const gas = await _ctx.livepeer.rpc.estimateGas(
    'BondingManager',
    'withdrawFees',
    [],
  )

  return await _ctx.livepeer.rpc.withdrawFees({
    ..._ctx.livepeer.config.defaultTx,
    gas: gas,
    returnTxHash: true,
  })
}

/**
 * Submits a rebondFromUnbonded transaction
 * @param obj
 * @return {Promise}
 */
export async function rebondFromUnbonded(_obj, _args, _ctx) {
  const { delegate, unbondingLockId } = _args

  const gas = await _ctx.livepeer.rpc.estimateGas(
    'BondingManager',
    'rebondFromUnbonded',
    [delegate, unbondingLockId],
  )

  return await _ctx.livepeer.rpc.rebondFromUnbonded(delegate, unbondingLockId, {
    gas: gas,
    returnTxHash: true,
  })
}

/**
 * Submits a round initialization transaction
 * @param obj
 * @return {Promise}
 */
export async function initializeRound(_obj, _args, _ctx) {
  const gas = await _ctx.livepeer.rpc.estimateGas(
    'RoundsManager',
    'initializeRound',
    [],
  )
  return await _ctx.livepeer.rpc.initializeRound({
    gas,
    returnTxHash: true,
  })
}

/**
 * Update's a user's 3box space
 * @param obj
 * @return {Promise}
 */
export async function updateProfile(_obj, _args, _ctx) {
  const address = _ctx.address.toLowerCase()
  const box = _ctx.box

  try {
    const space = await box.openSpace('livepeer')

    if (_args.proof) {
      await box.linkAddress({
        proof: _args.proof,
      })
    }

    const allowed = [
      'name',
      'website',
      'description',
      'image',
      'defaultProfile',
    ]
    const filtered = Object.keys(_args)
      .filter(key => allowed.includes(key))
      .reduce((obj, key) => {
        obj[key] = _args[key]
        return obj
      }, {})

    await space.public.setMultiple(
      Object.keys(filtered),
      Object.values(filtered),
    )

    return {
      id: address,
      ...filtered,
    }
  } catch (e) {
    console.error(e)
  }
}

/**
 * Unlink an external account from a user's 3box
 * @param obj
 * @return {Promise}
 */
export async function removeAddressLink(_obj, _args, _ctx) {
  const address = _args.address.toLowerCase()
  const box = _ctx.box
  try {
    await box.removeAddressLink(address)
  } catch (e) {
    console.error(e)
  }
}
