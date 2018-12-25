// Import types and APIs from graph-ts
import { Address, BigInt } from "@graphprotocol/graph-ts";

// Import event types from the registrar contract ABIs
import {
  BondingManager__getDelegatorResult,
  BondingManager,
  TranscoderUpdate,
  TranscoderResigned,
  TranscoderEvicted,
  TranscoderSlashed,
  Bond,
  Unbond,
  Rebond,
  Reward as RewardEvent // alias Reward event to avoid name collision with entity type
} from "../types/BondingManager/BondingManager";
import {
  Bond as Bond_deprecated,
  Unbond as Unbond_deprecated
} from "../types/BondingManager_deprecated/BondingManager";
import { RoundsManager } from "../types/RoundsManager/RoundsManager";

// Import entity types generated from the GraphQL schema
import { Transcoder, Reward, Delegator } from "../types/schema";

// Bind RoundsManager contract
let roundsManager = RoundsManager.bind(
  Address.fromString("3984fc4ceeef1739135476f625d36d6c35c40dc3")
);

// Handler for TranscoderUpdate events
export function transcoderUpdated(event: TranscoderUpdate): void {
  // Bind BondingManager contract
  let bondingManager = BondingManager.bind(event.address);
  let currentRound = roundsManager.currentRound();
  let transcoderAddress = event.params.transcoder;
  let transcoder = Transcoder.load(transcoderAddress.toHex());

  // Create transcoder if it does not yet exist
  if (transcoder == null) {
    transcoder = new Transcoder(transcoderAddress.toHex());
  }

  let active = bondingManager.isActiveTranscoder(
    transcoderAddress,
    currentRound
  );
  let registered = event.params.registered;
  let pendingRewardCut = event.params.pendingRewardCut;
  let pendingFeeShare = event.params.pendingFeeShare;
  let pendingPricePerSegment = event.params.pendingPricePerSegment;

  // Get more transcoder fields from contract
  let transcoderData = bondingManager.getTranscoder(transcoderAddress);
  let lastRewardRound = transcoderData.value0;
  let rewardCut = transcoderData.value1;
  let feeShare = transcoderData.value2;
  let pricePerSegment = transcoderData.value3;

  // Update transcoder
  transcoder.pendingRewardCut = pendingRewardCut;
  transcoder.pendingFeeShare = pendingFeeShare;
  transcoder.pendingPricePerSegment = pendingPricePerSegment;
  transcoder.rewardCut = rewardCut;
  transcoder.feeShare = feeShare;
  transcoder.pricePerSegment = pricePerSegment;
  transcoder.lastRewardRound = lastRewardRound;
  transcoder.active = active;
  transcoder.status = registered ? "Registered" : "NotRegistered";

  // Apply store updates
  transcoder.save();
}

// Handler for TranscoderResigned events
export function transcoderResigned(event: TranscoderResigned): void {
  let transcoderAddress = event.params.transcoder;
  let transcoder = new Transcoder(transcoderAddress.toHex());

  // Update transcoder
  transcoder.active = false;
  transcoder.status = "NotRegistered";

  // Apply store updates
  transcoder.save();
}

// Handler for TranscoderEvicted events
export function transcoderEvicted(event: TranscoderEvicted): void {
  let transcoderAddress = event.params.transcoder;
  let transcoder = new Transcoder(transcoderAddress.toHex());

  // Update transcoder
  transcoder.active = false;
  transcoder.status = "NotRegistered";

  // Apply store updates
  transcoder.save();
}

// Handler for TranscoderSlashed events
export function transcoderSlashed(event: TranscoderSlashed): void {
  let transcoderAddress = event.params.transcoder;
  let transcoder = new Transcoder(transcoderAddress.toHex());
  let bondingManager = BondingManager.bind(event.address);
  let totalStake = bondingManager.transcoderTotalStake(transcoderAddress);

  // Update transcoder total stake
  transcoder.totalStake = totalStake;

  // Apply store updates
  transcoder.save();
}

// Handler for Bond events
export function bond(event: Bond): void {
  let bondingManager = BondingManager.bind(event.address);
  let newDelegateAddress = event.params.newDelegate;
  let oldDelegateAddress = event.params.oldDelegate;
  let bondedAmount = event.params.bondedAmount;
  let delegatorAddress = event.params.delegator;
  let delegator = Delegator.load(delegatorAddress.toHex());

  // Create delegator if it does not yet exist
  if (delegator == null) {
    delegator = new Delegator(delegatorAddress.toHex());
  }

  let newDelegate = new Transcoder(newDelegateAddress.toHex());
  let oldDelegate = new Transcoder(oldDelegateAddress.toHex());
  let newDelegateTotalStake = bondingManager.transcoderTotalStake(
    newDelegateAddress
  );
  let oldDelegateTotalStake = bondingManager.transcoderTotalStake(
    oldDelegateAddress
  );

  if (delegator.delegateAddress) {
    // remove delegator from old delegate
    oldDelegate.delegators.splice(
      oldDelegate.delegators.indexOf(delegator.delegateAddress),
      1
    );
  }
  // Add delegator to new delegate
  newDelegate.delegators.push(delegatorAddress.toHex());

  // Update delegate stakes
  newDelegate.totalStake = newDelegateTotalStake;
  oldDelegate.totalStake = oldDelegateTotalStake;

  // Update delegator
  delegator.bondedAmount = bondedAmount;
  delegator.status = "Bonded";
  delegator.delegateAddress = newDelegateAddress.toHex();

  // Apply store updates
  delegator.save();
  newDelegate.save();
  oldDelegate.save();
}

export function bond_deprecated(event: Bond_deprecated): void {
  let bondingManager = BondingManager.bind(event.address);
  let delegateAddress = event.params.delegate;
  let delegatorAddress = event.params.delegator;
  let delegate = new Transcoder(delegateAddress.toHex());
  let delegateTotalStake = bondingManager.transcoderTotalStake(delegateAddress);

  let delegator = Delegator.load(delegatorAddress.toHex());

  // Create delegator if it does not yet exist
  if (delegator == null) {
    delegator = new Delegator(delegatorAddress.toHex());
  }

  let delegatorData = bondingManager.getDelegator(delegatorAddress);
  let bondedAmount = delegatorData.value0;

  // Update delegate
  // if (delegator.delegateAddress) {
  //   let oldDelegate = new Transcoder(delegator.delegateAddress)
  //   // remove delegator from old delegate
  //   oldDelegate.delegators.splice(
  //     oldDelegate.delegators.indexOf(delegator.delegateAddress),
  //     1
  //   )
  // }
  // Add delegator to new delegate
  delegate.delegators.push(delegatorAddress.toHex());
  delegate.totalStake = delegateTotalStake;

  // Update delegator
  delegator.status = "Bonded";
  delegator.bondedAmount = bondedAmount;
  delegator.delegateAddress = delegateAddress.toHex();

  delegator.save();
  delegate.save();
}

export function unbond_deprecated(event: Unbond_deprecated): void {
  let bondingManager = BondingManager.bind(event.address);
  let delegateAddress = event.params.delegate;
  let delegatorAddress = event.params.delegator;
  let delegate = new Transcoder(delegateAddress.toHex());
  let delegator = new Delegator(delegatorAddress.toHex());
  let totalStake = bondingManager.transcoderTotalStake(delegateAddress);
  let delegatorData = bondingManager.getDelegator(delegatorAddress);
  let bondedAmount = delegatorData.value0;

  // Update delegate
  delegate.totalStake = totalStake;

  // Update delegator
  delegator.bondedAmount = bondedAmount;

  // Delegator no longer delegated to anyone if it does not have a bonded amount
  // if (!bondedAmount) {
  //   // remove delegator from old delegate
  //   delegate.delegators.splice(
  //     delegate.delegators.indexOf(delegator.delegateAddress),
  //     1
  //   )
  //   delegator.delegateAddress = null
  // }

  // Apply store updates
  delegator.save();
  delegate.save();
}

// Handler for Unbond events
export function unbond(event: Unbond): void {
  let bondingManager = BondingManager.bind(event.address);
  let delegateAddress = event.params.delegate;
  let delegatorAddress = event.params.delegator;
  let amount = event.params.amount;
  let delegate = new Transcoder(delegateAddress.toHex());
  let delegator = new Delegator(delegatorAddress.toHex());
  let totalStake = bondingManager.transcoderTotalStake(delegateAddress);

  // Update transcoder
  delegate.totalStake = totalStake;

  // Update delegator
  delegator.bondedAmount = delegator.bondedAmount.minus(amount);
  // Delegator no longer delegated to anyone if it does not have a bonded amount
  if (!delegator.bondedAmount) {
    // remove delegator from old delegate
    delegate.delegators.splice(
      delegate.delegators.indexOf(delegator.delegateAddress),
      1
    );
    delegator.delegateAddress = null;
  }

  // Apply store updates
  delegator.save();
  delegate.save();
}

// Handler for Rebond events
export function rebond(event: Rebond): void {
  let bondingManager = BondingManager.bind(event.address);
  let delegateAddress = event.params.delegate;
  let delegatorAddress = event.params.delegator;
  let amount = event.params.amount;
  let delegator = new Delegator(delegatorAddress.toHex());
  let delegate = new Transcoder(delegateAddress.toHex());
  let totalStake = bondingManager.transcoderTotalStake(delegateAddress);

  // Update delegator
  delegator.bondedAmount = delegator.bondedAmount.plus(amount);
  delegator.status = "Bonded";
  delegator.delegateAddress = delegateAddress.toHex();

  // Update transcoder
  delegate.totalStake = totalStake;

  // Apply store updates
  delegate.save();
  delegator.save();
}

// Handler for Reward events
export function reward(event: RewardEvent): void {
  var bondingManager = BondingManager.bind(event.address);
  let transcoderAddress = event.params.transcoder;
  let transcoder = new Transcoder(transcoderAddress.toHex());
  let totalStake = bondingManager.transcoderTotalStake(transcoderAddress);
  let currentRound = roundsManager.currentRound();

  // Recreate unique id from transcoder address and round
  // We use this to keep track of a transcoder's rewards for each round
  let rewardId = transcoderAddress.toHex() + "-" + currentRound.toString();

  // Get reward
  let reward = new Reward(rewardId);

  // Update transcoder total stake
  transcoder.totalStake = totalStake;

  // Update reward tokens
  reward.rewardTokens = event.params.amount;

  let delegatorAddress: Address;
  let pendingStake: BigInt;
  let pendingFees: BigInt;
  let bondedAmount: BigInt;
  let delegators: Array<string> = transcoder.delegators as Array<string>;
  let delegator: Delegator;
  let delegatorData: BondingManager__getDelegatorResult;

  for (let i = 0; i < delegators.length; i++) {
    delegatorAddress = Address.fromString(delegators[i]);
    delegator = new Delegator(delegatorAddress.toHex());
    delegatorData = bondingManager.getDelegator(delegatorAddress);
    bondedAmount = delegatorData.value0;
    pendingStake = bondingManager.pendingStake(delegatorAddress, currentRound);
    pendingFees = bondingManager.pendingFees(delegatorAddress, currentRound);
    delegator.pendingStake = pendingStake;
    delegator.pendingFees = pendingFees;
    delegator.bondedAmount = bondedAmount;
    delegator.save();
  }

  // Apply store updates
  transcoder.save();
  reward.save();
}
