import proto from "@hashgraph/proto";
import Channel from "../Channel";
import Transaction from "../Transaction";
import { _toProtoKey } from "../util";
import { AccountId } from "..";

export default class AccountDeleteTransaction extends Transaction {
    /**
     * @param {object} props
     * @param {AccountId} [props.accountId]
     * @param {AccountId} [props.transferAccountId]
     */
    constructor(props = {}) {
        super();

        /**
         * @private
         * @type {?AccountId}
         */
        this._accountId = null;

        /**
         * @private
         * @type {?AccountId}
         */
        this._transferAccountId = null;

        if (props.accountId != null) {
            this.setAccountId(props.accountId);
        }

        if (props.transferAccountId != null) {
            this.setTransferAccountId(props.transferAccountId);
        }
    }

    /**
     * @returns {?AccountId}
     */
    getAccountId() {
        return this._accountId;
    }

    /**
     * Sets the account ID which is being deleted in this transaction.
     *
     * @param {AccountId | string} accountId
     * @returns {AccountDeleteTransaction}
     */
    setAccountId(accountId) {
        this._requireNotFrozen();
        this._accountId =
            accountId instanceof AccountId
                ? accountId
                : AccountId.fromString(accountId);

        return this;
    }

    /**
     * @returns {?AccountId}
     */
    getTransferAccountId() {
        return this._transferAccountId;
    }

    /**
     * Sets the account ID which will receive all remaining hbars.
     *
     * @param {AccountId | string} transferAccountId
     * @returns {AccountDeleteTransaction}
     */
    setTransferAccountId(transferAccountId) {
        this._requireNotFrozen();
        this._transferAccountId =
            transferAccountId instanceof AccountId
                ? transferAccountId
                : AccountId.fromString(transferAccountId);

        return this;
    }

    /**
     * @override
     * @protected
     * @param {Channel} channel
     * @returns {(transaction: proto.ITransaction) => Promise<proto.TransactionResponse>}
     */
    _getTransactionMethod(channel) {
        return (transaction) => channel.crypto.cryptoDelete(transaction);
    }

    /**
     * @override
     * @protected
     * @returns {proto.TransactionBody["data"]}
     */
    _getTransactionDataCase() {
        return "cryptoDelete";
    }

    /**
     * @override
     * @protected
     * @returns {proto.ICryptoDeleteTransactionBody}
     */
    _makeTransactionData() {
        return {
            deleteAccountID: this._accountId?._toProtobuf(),
            transferAccountID: this._transferAccountId?._toProtobuf(),
        };
    }
}