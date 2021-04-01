"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionOnNetworkType = exports.TransactionOnNetwork = exports.TransactionStatus = exports.TransactionHash = exports.Transaction = void 0;
const bignumber_js_1 = require("bignumber.js");
const address_1 = require("./address");
const balance_1 = require("./balance");
const networkParams_1 = require("./networkParams");
const networkConfig_1 = require("./networkConfig");
const nonce_1 = require("./nonce");
const signature_1 = require("./signature");
const utils_1 = require("./utils");
const transactionPayload_1 = require("./transactionPayload");
const errors = __importStar(require("./errors"));
const events_1 = require("./events");
const transactionWatcher_1 = require("./transactionWatcher");
const proto_1 = require("./proto");
const createTransactionHasher = require("blake2b");
const DEFAULT_TRANSACTION_VERSION = networkParams_1.TransactionVersion.withDefaultVersion();
const DEFAULT_TRANSACTION_OPTIONS = networkParams_1.TransactionOptions.withDefaultOptions();
const TRANSACTION_HASH_LENGTH = 32;
/**
 * An abstraction for creating, signing and broadcasting Elrond transactions.
 */
class Transaction {
    /**
     * Creates a new Transaction object.
     */
    constructor(init) {
        this.queryResponse = new TransactionOnNetwork();
        this.nonce = new nonce_1.Nonce(0);
        this.value = balance_1.Balance.Zero();
        this.sender = address_1.Address.Zero();
        this.receiver = address_1.Address.Zero();
        this.gasPrice = networkConfig_1.NetworkConfig.getDefault().MinGasPrice;
        this.gasLimit = networkConfig_1.NetworkConfig.getDefault().MinGasLimit;
        this.data = new transactionPayload_1.TransactionPayload();
        this.chainID = networkConfig_1.NetworkConfig.getDefault().ChainID;
        this.version = DEFAULT_TRANSACTION_VERSION;
        this.options = DEFAULT_TRANSACTION_OPTIONS;
        this.signature = new signature_1.Signature();
        this.hash = new TransactionHash("");
        Object.assign(this, init);
        this.onSigned = new events_1.TypedEvent();
        utils_1.guardType("nonce", nonce_1.Nonce, this.nonce);
        utils_1.guardType("gasLimit", networkParams_1.GasLimit, this.gasLimit);
        utils_1.guardType("gasPrice", networkParams_1.GasPrice, this.gasPrice);
    }
    /**
     * Sets the account sequence number of the sender. Must be done prior signing.
     *
     * ```
     * await alice.sync(provider);
     *
     * let tx = new Transaction({
     *      value: Balance.eGLD(1),
     *      receiver: bob.address
     * });
     *
     * tx.setNonce(alice.nonce);
     * await aliceSigner.sign(tx);
     * ```
     */
    setNonce(nonce) {
        this.nonce = nonce;
    }
    /**
     * Serializes a transaction to a sequence of bytes, ready to be signed.
     * This function is called internally, by {@link Signer} objects.
     *
     * @param signedBy The address of the future signer
     */
    serializeForSigning(signedBy) {
        let plain = this.toPlainObject(signedBy);
        let serialized = JSON.stringify(plain);
        return Buffer.from(serialized);
    }
    /**
     * Converts the transaction object into a ready-to-serialize, plain JavaScript object.
     * This function is called internally within the signing procedure.
     *
     * @param sender The address of the sender (will be provided when called within the signing procedure)
     */
    toPlainObject(sender) {
        return {
            nonce: this.nonce.valueOf(),
            value: this.value.toString(),
            receiver: this.receiver.bech32(),
            sender: sender ? sender.bech32() : this.sender.bech32(),
            gasPrice: this.gasPrice.valueOf(),
            gasLimit: this.gasLimit.valueOf(),
            data: this.data.isEmpty() ? undefined : this.data.encoded(),
            chainID: this.chainID.valueOf(),
            version: this.version.valueOf(),
            options: this.options.valueOf() == 0 ? undefined : this.options.valueOf(),
            signature: this.signature.isEmpty() ? undefined : this.signature.hex(),
        };
    }
    /**
     * Applies the signature on the transaction.
     *
     * @param signature The signature, as computed by a {@link ISigner}.
     * @param signedBy The address of the signer.
     */
    applySignature(signature, signedBy) {
        this.signature = signature;
        this.sender = signedBy;
        this.onSigned.emit({ transaction: this, signedBy: signedBy });
        this.hash = TransactionHash.compute(this);
    }
    /**
     * Broadcasts a transaction to the Network, via a {@link IProvider}.
     *
     * ```
     * let provider = new ProxyProvider("https://api.elrond.com");
     * // ... Prepare, sign the transaction, then:
     * await tx.send(provider);
     * await tx.awaitExecuted(provider);
     * ```
     */
    send(provider) {
        return __awaiter(this, void 0, void 0, function* () {
            this.hash = yield provider.sendTransaction(this);
            return this.hash;
        });
    }
    /**
     * Simulates a transaction on the Network, via a {@link IProvider}.
     */
    simulate(provider) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield provider.simulateTransaction(this);
        });
    }
    /**
     * Converts a transaction to a ready-to-broadcast object.
     * Called internally by the {@link IProvider}.
     */
    toSendable() {
        if (this.signature.isEmpty()) {
            throw new errors.ErrTransactionNotSigned();
        }
        return this.toPlainObject();
    }
    /**
     * Fetches a representation of the transaction (whether pending, processed or finalized), as found on the Network.
     *
     * @param provider The provider to use
     * @param cacheLocally Whether to cache the response locally, on the transaction object
     */
    getAsOnNetwork(provider, cacheLocally = true) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.hash.isEmpty()) {
                throw new errors.ErrTransactionHashUnknown();
            }
            let response = yield provider.getTransaction(this.hash);
            if (cacheLocally) {
                this.queryResponse = response;
            }
            return response;
        });
    }
    /**
     * Returns the cached representation of the transaction, as previously fetched using {@link Transaction.getAsOnNetwork}.
     */
    getAsOnNetworkCached() {
        return this.queryResponse;
    }
    /**
     * Not implemented.
     * Use {@link Transaction.getAsOnNetwork} instead.
     */
    queryStatus() {
        return {};
    }
    /**
     * Computes the current transaction fee based on the {@link NetworkConfig} and transaction properties
     * @param networkConfig {@link NetworkConfig}
     */
    computeFee(networkConfig) {
        let moveBalanceGas = networkConfig.MinGasLimit.valueOf() + this.data.length() * networkConfig.GasPerDataByte.valueOf();
        if (moveBalanceGas > this.gasLimit.valueOf()) {
            throw new errors.ErrNotEnoughGas(this.gasLimit.valueOf());
        }
        let gasPrice = new bignumber_js_1.BigNumber(this.gasPrice.valueOf());
        let feeForMove = new bignumber_js_1.BigNumber(moveBalanceGas).multipliedBy(gasPrice);
        if (moveBalanceGas === this.gasLimit.valueOf()) {
            return feeForMove;
        }
        let diff = new bignumber_js_1.BigNumber(this.gasLimit.valueOf() - moveBalanceGas);
        let modifiedGasPrice = gasPrice.multipliedBy(new bignumber_js_1.BigNumber(networkConfig.GasPriceModifier.valueOf()));
        let processingFee = diff.multipliedBy(modifiedGasPrice);
        return feeForMove.plus(processingFee);
    }
    /**
     * Awaits for a transaction to reach its "pending" state - that is, for the transaction to be accepted in the mempool.
     * Performs polling against the provider, via a {@link TransactionWatcher}.
     */
    awaitPending(provider) {
        return __awaiter(this, void 0, void 0, function* () {
            let watcher = new transactionWatcher_1.TransactionWatcher(this.hash, provider);
            yield watcher.awaitPending();
        });
    }
    /**
     * Awaits for a transaction to reach its "executed" state - that is, for the transaction to be processed (whether with success or with errors).
     * Performs polling against the provider, via a {@link TransactionWatcher}.
     */
    awaitExecuted(provider) {
        return __awaiter(this, void 0, void 0, function* () {
            let watcher = new transactionWatcher_1.TransactionWatcher(this.hash, provider);
            yield watcher.awaitExecuted();
        });
    }
}
exports.Transaction = Transaction;
/**
 * An abstraction for handling and computing transaction hashes.
 */
class TransactionHash {
    /**
     * Creates a new TransactionHash object.
     *
     * @param hash The hash, as a hex-encoded string.
     */
    constructor(hash) {
        this.hash = hash;
    }
    /**
     * Returns whether the hash is empty (not computed).
     */
    isEmpty() {
        return !this.hash;
    }
    toString() {
        return this.hash;
    }
    valueOf() {
        return this.hash;
    }
    /**
     * Computes the hash of a transaction.
     * Not yet implemented.
     */
    static compute(transaction) {
        let serializer = new proto_1.ProtoSerializer();
        let buffer = serializer.serializeTransaction(transaction);
        let hash = createTransactionHasher(TRANSACTION_HASH_LENGTH)
            .update(buffer)
            .digest("hex");
        return new TransactionHash(hash);
    }
}
exports.TransactionHash = TransactionHash;
/**
 * An abstraction for handling and interpreting the "status" field of a {@link Transaction}.
 */
class TransactionStatus {
    /**
     * Creates a new TransactionStatus object.
     */
    constructor(status) {
        this.status = (status || "").toLowerCase();
    }
    /**
     * Creates an unknown status.
     */
    static createUnknown() {
        return new TransactionStatus("unknown");
    }
    /**
     * Returns whether the transaction is pending (e.g. in mempool).
     */
    isPending() {
        return this.status == "received" || this.status == "pending" || this.status == "partially-executed";
    }
    /**
     * Returns whether the transaction has been executed (not necessarily with success).
     */
    isExecuted() {
        return this.isSuccessful() || this.isInvalid();
    }
    /**
     * Returns whether the transaction has been executed successfully.
     */
    isSuccessful() {
        return this.status == "executed" || this.status == "success" || this.status == "successful";
    }
    /**
     * Returns whether the transaction has been executed, but with a failure.
     */
    isFailed() {
        return this.status == "fail" || this.status == "failed" || this.status == "unsuccessful" || this.isInvalid();
    }
    /**
     * Returns whether the transaction has been executed, but marked as invalid (e.g. due to "insufficient funds").
     */
    isInvalid() {
        return this.status == "invalid";
    }
    toString() {
        return this.status;
    }
}
exports.TransactionStatus = TransactionStatus;
/**
 * A plain view of a transaction, as queried from the Network.
 */
class TransactionOnNetwork {
    constructor(init) {
        this.type = new TransactionOnNetworkType();
        Object.assign(this, init);
        this.status = TransactionStatus.createUnknown();
    }
    static fromHttpResponse(payload) {
        let result = new TransactionOnNetwork();
        result.type = new TransactionOnNetworkType(payload["type"] || "");
        result.nonce = new nonce_1.Nonce(payload["nonce"] || 0);
        result.round = payload["round"];
        result.epoch = payload["epoch"] || 0;
        result.value = balance_1.Balance.fromString(payload["value"]);
        result.sender = address_1.Address.fromBech32(payload["sender"]);
        result.receiver = address_1.Address.fromBech32(payload["receiver"]);
        result.gasPrice = new networkParams_1.GasPrice(payload["gasPrice"]);
        result.gasLimit = new networkParams_1.GasLimit(payload["gasLimit"]);
        result.data = transactionPayload_1.TransactionPayload.fromEncoded(payload["data"]);
        result.status = new TransactionStatus(payload["status"]);
        return result;
    }
}
exports.TransactionOnNetwork = TransactionOnNetwork;
/**
 * Not yet implemented.
 */
class TransactionOnNetworkType {
    constructor(value) {
        this.value = value || "unknown";
    }
}
exports.TransactionOnNetworkType = TransactionOnNetworkType;
//# sourceMappingURL=transaction.js.map