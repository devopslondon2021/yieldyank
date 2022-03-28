import { Deposit, Withdraw } from "../generated/Contract/vault";
import { BigInt, ethereum } from "@graphprotocol/graph-ts";
import { Deposit as DepositTransaction } from "../generated/schema"
import { Withdraw as WithdrawTransaction } from "../generated/schema"
import * as constants from "./common/constants";

export function getTimestampInMillis(block: ethereum.Block): BigInt {
  return block.timestamp.times(BigInt.fromI32(1000));
}

export function handleDeposit(event: Deposit): void {
  let id = "deposit-"+event.transaction.hash.toHexString()

  let transaction = DepositTransaction.load(id);
  if (transaction == null) {
    transaction = new DepositTransaction(id);
    transaction.logIndex = event.transaction.index.toI32();
    transaction.to = event.address.toHexString();
    transaction.from = event.transaction.from.toHexString();
    transaction.hash = event.transaction.hash.toHexString();

    transaction.timestamp = getTimestampInMillis(event.block);
    transaction.blockNumber = event.block.number;
    transaction.vault = event.address.toHexString();

    // const vault = VaultStore.load(event.address.toHexString());
    // if (vault) {
    //   transaction.asset = vault.inputTokens[0];
    // }
    // transaction.amount = _amount;
    // transaction.amountUSD = _amountUSD;
    transaction.save();
  }
}

export function handleWithdraw(event: Withdraw): void {
  let id = "withdraw-"+event.transaction.hash.toHexString()
  let transaction = WithdrawTransaction.load(id)

  if (transaction == null) {
    transaction = new WithdrawTransaction(id);
    transaction.logIndex = event.transaction.index.toI32();
    transaction.to = event.address.toHexString();
    transaction.from = event.transaction.from.toHexString();
    transaction.hash = event.transaction.hash.toHexString();
    transaction.timestamp = getTimestampInMillis(event.block);
    transaction.blockNumber = event.block.number;
    transaction.protocol = constants.ETHEREUM_PROTOCOL_ID;
    transaction.vault = event.address.toHexString();

    // const vault = VaultStore.load(call.to.toHexString());
    // if (vault) {
    //   transaction.asset = vault.inputTokens[0];
    // }
    // transaction.amount = _amount;
    // transaction.amountUSD = _amountUSD;
    transaction.save();
  }
}
