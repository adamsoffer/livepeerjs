import {
  EthereumEvent,
  SmartContract,
  EthereumValue,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class SetContractInfo extends EthereumEvent {
  get params(): SetContractInfoParams {
    return new SetContractInfoParams(this);
  }
}

export class SetContractInfoParams {
  _event: SetContractInfo;

  constructor(event: SetContractInfo) {
    this._event = event;
  }

  get id(): Bytes {
    return this._event.parameters[0].value.toBytes();
  }

  get contractAddress(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get gitCommitHash(): Bytes {
    return this._event.parameters[2].value.toBytes();
  }
}

export class Pause extends EthereumEvent {
  get params(): PauseParams {
    return new PauseParams(this);
  }
}

export class PauseParams {
  _event: Pause;

  constructor(event: Pause) {
    this._event = event;
  }
}

export class Unpause extends EthereumEvent {
  get params(): UnpauseParams {
    return new UnpauseParams(this);
  }
}

export class UnpauseParams {
  _event: Unpause;

  constructor(event: Unpause) {
    this._event = event;
  }
}

export class OwnershipTransferred extends EthereumEvent {
  get params(): OwnershipTransferredParams {
    return new OwnershipTransferredParams(this);
  }
}

export class OwnershipTransferredParams {
  _event: OwnershipTransferred;

  constructor(event: OwnershipTransferred) {
    this._event = event;
  }

  get previousOwner(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get newOwner(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class Controller__getContractInfoResult {
  value0: Address;
  value1: Bytes;

  constructor(value0: Address, value1: Bytes) {
    this.value0 = value0;
    this.value1 = value1;
  }

  toMap(): TypedMap<string, EthereumValue> {
    let map = new TypedMap<string, EthereumValue>();
    map.set("value0", EthereumValue.fromAddress(this.value0));
    map.set("value1", EthereumValue.fromFixedBytes(this.value1));
    return map;
  }
}

export class Controller extends SmartContract {
  static bind(address: Address): Controller {
    return new Controller("Controller", address);
  }

  paused(): boolean {
    let result = super.call("paused", []);
    return result[0].toBoolean();
  }

  owner(): Address {
    let result = super.call("owner", []);
    return result[0].toAddress();
  }

  getContractInfo(_id: Bytes): Controller__getContractInfoResult {
    let result = super.call("getContractInfo", [
      EthereumValue.fromFixedBytes(_id)
    ]);
    return new Controller__getContractInfoResult(
      result[0].toAddress(),
      result[1].toBytes()
    );
  }

  getContract(_id: Bytes): Address {
    let result = super.call("getContract", [EthereumValue.fromFixedBytes(_id)]);
    return result[0].toAddress();
  }
}
