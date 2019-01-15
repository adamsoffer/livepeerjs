// Import event types from the registrar contract ABIs
import {
  BondingManager,
  Bond as Bond_deprecated,
  Unbond as Unbond_deprecated
} from "../types/BondingManager_deprecated/BondingManager";

// Import entity types generated from the GraphQL schema
import { Transcoder, Delegator } from "../types/schema";

export function bond_deprecated(event: Bond_deprecated): void {
  let bondingManager = BondingManager.bind(event.address);
  let delegateAddress = event.params.delegate;
  let delegatorAddress = event.params.delegator;
  let delegateTotalStake = bondingManager.transcoderTotalStake(delegateAddress);

  // Create delegate if it does not yet exist
  let delegate = Transcoder.load(delegateAddress.toHex());
  if (delegate == null) {
    delegate = new Transcoder(delegateAddress.toHex());
  }
  // Create delegator if it does not yet exist
  let delegator = Delegator.load(delegatorAddress.toHex());
  if (delegator == null) {
    delegator = new Delegator(delegatorAddress.toHex());
  }

  if (delegate.delegators == null) {
    delegate.delegators = new Array<string>();
  }

  let delegators = delegate.delegators;
  delegators.push(delegatorAddress.toHex());
  delegate.delegators = delegators;

  let delegatorData = bondingManager.getDelegator(delegatorAddress);
  let bondedAmount = delegatorData.value0;

  delegate.totalStake = delegateTotalStake;

  // Update delegator
  delegator.bondedAmount = bondedAmount;
  delegator.delegate = delegateAddress.toHex();

  delegator.save();
  delegate.save();
}

export function unbond_deprecated(event: Unbond_deprecated): void {
  let bondingManager = BondingManager.bind(event.address);
  let delegateAddress = event.params.delegate;
  let delegatorAddress = event.params.delegator;
  let totalStake = bondingManager.transcoderTotalStake(delegateAddress);
  let delegatorData = bondingManager.getDelegator(delegatorAddress);
  let bondedAmount = delegatorData.value0;

  let delegate = Transcoder.load(delegateAddress.toHex());
  if (delegate == null) {
    delegate = new Transcoder(delegateAddress.toHex());
  }

  let delegator = Delegator.load(delegatorAddress.toHex());

  // Update delegate
  delegate.totalStake = totalStake;

  // Update delegator
  delegator.bondedAmount = bondedAmount;

  // Delegator no longer delegated to anyone
  delegate.delegators = delegate.delegators.splice(
    delegate.delegators.indexOf(delegator.delegate),
    1
  );
  delegator.delegate = null;

  // Apply store updates
  delegator.save();
  delegate.save();
}
