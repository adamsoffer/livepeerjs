import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Address,
  Bytes,
  BigInt
} from "@graphprotocol/graph-ts";

export class Transcoder extends Entity {
  constructor(id: string) {
    this.entries = new Array(0);
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Transcoder entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Transcoder entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Transcoder", id.toString(), this);
  }

  static load(id: string): Transcoder | null {
    return store.get("Transcoder", id) as Transcoder | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get active(): boolean {
    let value = this.get("active");
    return value.toBoolean();
  }

  set active(value: boolean) {
    this.set("active", Value.fromBoolean(value));
  }

  get ensName(): string | null {
    let value = this.get("ensName");
    if (value === null) {
      return null;
    } else {
      return value.toString();
    }
  }

  set ensName(value: string | null) {
    if (value === null) {
      this.unset("ensName");
    } else {
      this.set("ensName", Value.fromString(value as string));
    }
  }

  get status(): string | null {
    let value = this.get("status");
    if (value === null) {
      return null;
    } else {
      return value.toString();
    }
  }

  set status(value: string | null) {
    if (value === null) {
      this.unset("status");
    } else {
      this.set("status", Value.fromString(value as string));
    }
  }

  get lastRewardRound(): BigInt | null {
    let value = this.get("lastRewardRound");
    if (value === null) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set lastRewardRound(value: BigInt | null) {
    if (value === null) {
      this.unset("lastRewardRound");
    } else {
      this.set("lastRewardRound", Value.fromBigInt(value as BigInt));
    }
  }

  get rewardCut(): BigInt | null {
    let value = this.get("rewardCut");
    if (value === null) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set rewardCut(value: BigInt | null) {
    if (value === null) {
      this.unset("rewardCut");
    } else {
      this.set("rewardCut", Value.fromBigInt(value as BigInt));
    }
  }

  get feeShare(): BigInt | null {
    let value = this.get("feeShare");
    if (value === null) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set feeShare(value: BigInt | null) {
    if (value === null) {
      this.unset("feeShare");
    } else {
      this.set("feeShare", Value.fromBigInt(value as BigInt));
    }
  }

  get pricePerSegment(): BigInt | null {
    let value = this.get("pricePerSegment");
    if (value === null) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set pricePerSegment(value: BigInt | null) {
    if (value === null) {
      this.unset("pricePerSegment");
    } else {
      this.set("pricePerSegment", Value.fromBigInt(value as BigInt));
    }
  }

  get pendingRewardCut(): BigInt | null {
    let value = this.get("pendingRewardCut");
    if (value === null) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set pendingRewardCut(value: BigInt | null) {
    if (value === null) {
      this.unset("pendingRewardCut");
    } else {
      this.set("pendingRewardCut", Value.fromBigInt(value as BigInt));
    }
  }

  get pendingFeeShare(): BigInt | null {
    let value = this.get("pendingFeeShare");
    if (value === null) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set pendingFeeShare(value: BigInt | null) {
    if (value === null) {
      this.unset("pendingFeeShare");
    } else {
      this.set("pendingFeeShare", Value.fromBigInt(value as BigInt));
    }
  }

  get pendingPricePerSegment(): BigInt | null {
    let value = this.get("pendingPricePerSegment");
    if (value === null) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set pendingPricePerSegment(value: BigInt | null) {
    if (value === null) {
      this.unset("pendingPricePerSegment");
    } else {
      this.set("pendingPricePerSegment", Value.fromBigInt(value as BigInt));
    }
  }

  get totalStake(): BigInt | null {
    let value = this.get("totalStake");
    if (value === null) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set totalStake(value: BigInt | null) {
    if (value === null) {
      this.unset("totalStake");
    } else {
      this.set("totalStake", Value.fromBigInt(value as BigInt));
    }
  }

  get rewards(): Array<string> | null {
    let value = this.get("rewards");
    if (value === null) {
      return null;
    } else {
      return value.toStringArray();
    }
  }

  set rewards(value: Array<string> | null) {
    if (value === null) {
      this.unset("rewards");
    } else {
      this.set("rewards", Value.fromStringArray(value as Array<string>));
    }
  }

  get delegators(): Array<string> | null {
    let value = this.get("delegators");
    if (value === null) {
      return null;
    } else {
      return value.toStringArray();
    }
  }

  set delegators(value: Array<string> | null) {
    if (value === null) {
      this.unset("delegators");
    } else {
      this.set("delegators", Value.fromStringArray(value as Array<string>));
    }
  }
}

export class Reward extends Entity {
  constructor(id: string) {
    this.entries = new Array(0);
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Reward entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Reward entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Reward", id.toString(), this);
  }

  static load(id: string): Reward | null {
    return store.get("Reward", id) as Reward | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get round(): string | null {
    let value = this.get("round");
    if (value === null) {
      return null;
    } else {
      return value.toString();
    }
  }

  set round(value: string | null) {
    if (value === null) {
      this.unset("round");
    } else {
      this.set("round", Value.fromString(value as string));
    }
  }

  get transcoder(): string | null {
    let value = this.get("transcoder");
    if (value === null) {
      return null;
    } else {
      return value.toString();
    }
  }

  set transcoder(value: string | null) {
    if (value === null) {
      this.unset("transcoder");
    } else {
      this.set("transcoder", Value.fromString(value as string));
    }
  }

  get rewardTokens(): BigInt | null {
    let value = this.get("rewardTokens");
    if (value === null) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set rewardTokens(value: BigInt | null) {
    if (value === null) {
      this.unset("rewardTokens");
    } else {
      this.set("rewardTokens", Value.fromBigInt(value as BigInt));
    }
  }
}

export class Share extends Entity {
  constructor(id: string) {
    this.entries = new Array(0);
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Share entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Share entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Share", id.toString(), this);
  }

  static load(id: string): Share | null {
    return store.get("Share", id) as Share | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get timestamp(): BigInt | null {
    let value = this.get("timestamp");
    if (value === null) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set timestamp(value: BigInt | null) {
    if (value === null) {
      this.unset("timestamp");
    } else {
      this.set("timestamp", Value.fromBigInt(value as BigInt));
    }
  }

  get rewardTokens(): BigInt | null {
    let value = this.get("rewardTokens");
    if (value === null) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set rewardTokens(value: BigInt | null) {
    if (value === null) {
      this.unset("rewardTokens");
    } else {
      this.set("rewardTokens", Value.fromBigInt(value as BigInt));
    }
  }

  get fees(): BigInt | null {
    let value = this.get("fees");
    if (value === null) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set fees(value: BigInt | null) {
    if (value === null) {
      this.unset("fees");
    } else {
      this.set("fees", Value.fromBigInt(value as BigInt));
    }
  }

  get delegator(): string | null {
    let value = this.get("delegator");
    if (value === null) {
      return null;
    } else {
      return value.toString();
    }
  }

  set delegator(value: string | null) {
    if (value === null) {
      this.unset("delegator");
    } else {
      this.set("delegator", Value.fromString(value as string));
    }
  }

  get round(): string | null {
    let value = this.get("round");
    if (value === null) {
      return null;
    } else {
      return value.toString();
    }
  }

  set round(value: string | null) {
    if (value === null) {
      this.unset("round");
    } else {
      this.set("round", Value.fromString(value as string));
    }
  }
}

export class Round extends Entity {
  constructor(id: string) {
    this.entries = new Array(0);
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Round entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Round entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Round", id.toString(), this);
  }

  static load(id: string): Round | null {
    return store.get("Round", id) as Round | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get initialized(): boolean {
    let value = this.get("initialized");
    return value.toBoolean();
  }

  set initialized(value: boolean) {
    this.set("initialized", Value.fromBoolean(value));
  }

  get length(): BigInt | null {
    let value = this.get("length");
    if (value === null) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set length(value: BigInt | null) {
    if (value === null) {
      this.unset("length");
    } else {
      this.set("length", Value.fromBigInt(value as BigInt));
    }
  }

  get lastInitializedRound(): BigInt | null {
    let value = this.get("lastInitializedRound");
    if (value === null) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set lastInitializedRound(value: BigInt | null) {
    if (value === null) {
      this.unset("lastInitializedRound");
    } else {
      this.set("lastInitializedRound", Value.fromBigInt(value as BigInt));
    }
  }

  get startBlock(): BigInt | null {
    let value = this.get("startBlock");
    if (value === null) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set startBlock(value: BigInt | null) {
    if (value === null) {
      this.unset("startBlock");
    } else {
      this.set("startBlock", Value.fromBigInt(value as BigInt));
    }
  }

  get rewards(): Array<string> | null {
    let value = this.get("rewards");
    if (value === null) {
      return null;
    } else {
      return value.toStringArray();
    }
  }

  set rewards(value: Array<string> | null) {
    if (value === null) {
      this.unset("rewards");
    } else {
      this.set("rewards", Value.fromStringArray(value as Array<string>));
    }
  }

  get delegatorShares(): Array<string> | null {
    let value = this.get("delegatorShares");
    if (value === null) {
      return null;
    } else {
      return value.toStringArray();
    }
  }

  set delegatorShares(value: Array<string> | null) {
    if (value === null) {
      this.unset("delegatorShares");
    } else {
      this.set(
        "delegatorShares",
        Value.fromStringArray(value as Array<string>)
      );
    }
  }
}

export class Delegator extends Entity {
  constructor(id: string) {
    this.entries = new Array(0);
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Delegator entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Delegator entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Delegator", id.toString(), this);
  }

  static load(id: string): Delegator | null {
    return store.get("Delegator", id) as Delegator | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get bondedAmount(): BigInt | null {
    let value = this.get("bondedAmount");
    if (value === null) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set bondedAmount(value: BigInt | null) {
    if (value === null) {
      this.unset("bondedAmount");
    } else {
      this.set("bondedAmount", Value.fromBigInt(value as BigInt));
    }
  }

  get fees(): BigInt | null {
    let value = this.get("fees");
    if (value === null) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set fees(value: BigInt | null) {
    if (value === null) {
      this.unset("fees");
    } else {
      this.set("fees", Value.fromBigInt(value as BigInt));
    }
  }

  get delegate(): string | null {
    let value = this.get("delegate");
    if (value === null) {
      return null;
    } else {
      return value.toString();
    }
  }

  set delegate(value: string | null) {
    if (value === null) {
      this.unset("delegate");
    } else {
      this.set("delegate", Value.fromString(value as string));
    }
  }

  get pendingFees(): BigInt | null {
    let value = this.get("pendingFees");
    if (value === null) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set pendingFees(value: BigInt | null) {
    if (value === null) {
      this.unset("pendingFees");
    } else {
      this.set("pendingFees", Value.fromBigInt(value as BigInt));
    }
  }

  get pendingStake(): BigInt | null {
    let value = this.get("pendingStake");
    if (value === null) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set pendingStake(value: BigInt | null) {
    if (value === null) {
      this.unset("pendingStake");
    } else {
      this.set("pendingStake", Value.fromBigInt(value as BigInt));
    }
  }

  get shares(): Array<string> | null {
    let value = this.get("shares");
    if (value === null) {
      return null;
    } else {
      return value.toStringArray();
    }
  }

  set shares(value: Array<string> | null) {
    if (value === null) {
      this.unset("shares");
    } else {
      this.set("shares", Value.fromStringArray(value as Array<string>));
    }
  }
}
