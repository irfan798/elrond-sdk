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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProxyProvider = void 0;
const axios_1 = __importDefault(require("axios"));
const transaction_1 = require("./transaction");
const networkConfig_1 = require("./networkConfig");
const errors = __importStar(require("./errors"));
const account_1 = require("./account");
const query_1 = require("./smartcontracts/query");
const logger_1 = require("./logger");
const networkStatus_1 = require("./networkStatus");
const JSONbig = require("json-bigint");
/**
 * This will be deprecated once all the endpoints move to ApiProvider
 */
class ProxyProvider {
    /**
     * Creates a new ProxyProvider.
     * @param url the URL of the Elrond Proxy
     * @param timeout the timeout for any request-response, in milliseconds
     */
    constructor(url, timeout) {
        this.url = url;
        this.timeoutLimit = timeout || 1000;
    }
    /**
     * Fetches the state of an {@link Account}.
     */
    getAccount(address) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield this.doGet(`address/${address.bech32()}`);
            let payload = response.account;
            return account_1.AccountOnNetwork.fromHttpResponse(payload);
        });
    }
    /**
     * Queries a Smart Contract - runs a pure function defined by the contract and returns its results.
     */
    queryContract(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = query.toHttpRequest();
                let response = yield this.doPost("vm-values/query", data);
                let payload = response.data || response.vmOutput;
                return query_1.QueryResponse.fromHttpResponse(payload);
            }
            catch (err) {
                throw errors.ErrContractQuery.increaseSpecificity(err);
            }
        });
    }
    /**
     * Broadcasts an already-signed {@link Transaction}.
     */
    sendTransaction(tx) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield this.doPost("transaction/send", tx.toSendable());
            let txHash = response.txHash;
            return new transaction_1.TransactionHash(txHash);
        });
    }
    /**
     * Simulates the processing of an already-signed {@link Transaction}.
     */
    simulateTransaction(tx) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield this.doPost("transaction/simulate", tx.toSendable());
            return response;
        });
    }
    /**
     * Fetches the state of a {@link Transaction}.
     */
    getTransaction(txHash) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield this.doGet(`transaction/${txHash.toString()}`);
            let payload = response.transaction;
            return transaction_1.TransactionOnNetwork.fromHttpResponse(payload);
        });
    }
    /**
     * Queries the status of a {@link Transaction}.
     */
    getTransactionStatus(txHash) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield this.doGet(`transaction/${txHash.toString()}/status`);
            return new transaction_1.TransactionStatus(response.status);
        });
    }
    /**
     * Fetches the Network configuration.
     */
    getNetworkConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield this.doGet("network/config");
            let payload = response.config;
            return networkConfig_1.NetworkConfig.fromHttpResponse(payload);
        });
    }
    /**
     * Fetches the network status configuration.
     */
    getNetworkStatus() {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield this.doGet("network/status/4294967295");
            let payload = response.status;
            return networkStatus_1.NetworkStatus.fromHttpResponse(payload);
        });
    }
    doGet(resourceUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let url = `${this.url}/${resourceUrl}`;
                let response = yield axios.get(url, { timeout: this.timeoutLimit });
                let payload = response.data.data;
                return payload;
            }
            catch (error) {
                if (!error.response) {
                    logger_1.Logger.warn(error);
                    throw new errors.ErrApiProviderGet(resourceUrl, error.toString(), error);
                }
                let errorData = error.response.data;
                let originalErrorMessage = errorData.error || errorData.message || JSON.stringify(errorData);
                throw new errors.ErrApiProviderGet(resourceUrl, originalErrorMessage, error);
            }
        });
    }
    doPost(resourceUrl, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let url = `${this.url}/${resourceUrl}`;
                let response = yield axios.post(url, payload, {
                    timeout: this.timeoutLimit,
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                let responsePayload = response.data.data;
                return responsePayload;
            }
            catch (error) {
                if (!error.response) {
                    logger_1.Logger.warn(error);
                    throw new errors.ErrApiProviderPost(resourceUrl, error.toString(), error);
                }
                let errorData = error.response.data;
                let originalErrorMessage = errorData.error || errorData.message || JSON.stringify(errorData);
                throw new errors.ErrApiProviderPost(resourceUrl, originalErrorMessage, error);
            }
        });
    }
}
exports.ProxyProvider = ProxyProvider;
// See: https://github.com/axios/axios/issues/983
const bigIntTransformer = (data) => {
    if (typeof data === 'string') {
        try {
            data = JSONbig.parse(data);
        }
        catch (e) { /* Ignore */ }
    }
    return data;
};
const axios = axios_1.default.create({
    // First try to parse data with bigInt parse, then run execute default parsers
    transformResponse: [].concat(bigIntTransformer, axios_1.default.defaults.transformResponse)
});
//# sourceMappingURL=proxyProvider.js.map