import { Address } from "@graphprotocol/graph-ts";

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

  // Add delegator to delegate
  let delegators = delegate.delegators;
  let i = delegators.indexOf(delegatorAddress.toHex());
  if (i == -1) {
    delegators.push(delegatorAddress.toHex());
    delegate.delegators = delegators;
  }
  delegator.delegate = delegateAddress.toHex();

  let delegatorData = bondingManager.getDelegator(delegatorAddress);
  let bondedAmount = delegatorData.value0;

  // Update delegator bonded amount
  delegator.bondedAmount = bondedAmount;

  // Update delegate's total stake
  delegate.totalStake = delegateTotalStake;

  delegator.save();
  delegate.save();
}

export function unbond_deprecated(event: Unbond_deprecated): void {
  let bondingManager = BondingManager.bind(event.address);
  let delegatorAddress = event.params.delegator;
  let delegator = Delegator.load(delegatorAddress.toHex());
  // delegate is not emitted in the deprecated event so grab it from delegator
  let delegateAddress = Address.fromString(delegator.delegate);
  let delegate = Transcoder.load(delegateAddress.toHex());
  if (delegate == null) {
    delegate = new Transcoder(delegateAddress.toHex());
  }
  let totalStake = bondingManager.transcoderTotalStake(delegateAddress);
  let delegatorData = bondingManager.getDelegator(delegatorAddress);
  let bondedAmount = delegatorData.value0;

  // Update delegate's total stake
  delegate.totalStake = totalStake;

  // Update delegator's bonded amount
  delegator.bondedAmount = bondedAmount;

  // Remove delegator from delegate
  let delegators = delegate.delegators;
  if (delegators != null) {
    let i = delegators.indexOf(delegatorAddress.toHex());
    delegators.splice(i, 1);
    delegate.delegators = delegators;
  }
  delegator.delegate = null;

  // Apply store updates
  delegator.save();
  delegate.save();
}
