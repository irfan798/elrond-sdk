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
exports.Wait = exports.MockProvider = void 0;
const transaction_1 = require("../transaction");
const networkConfig_1 = require("../networkConfig");
const address_1 = require("../address");
const nonce_1 = require("../nonce");
const asyncTimer_1 = require("../asyncTimer");
const account_1 = require("../account");
const balance_1 = require("../balance");
const errors = __importStar(require("../errors"));
const query_1 = require("../smartcontracts/query");
const networkStatus_1 = require("../networkStatus");
/**
 * A mock {@link IProvider}, used for tests only.
 */
class MockProvider {
    constructor() {
        this.accounts = new Map();
        this.transactions = new Map();
        this.accounts.set(MockProvider.AddressOfAlice.bech32(), new account_1.AccountOnNetwork({ nonce: new nonce_1.Nonce(0), balance: balance_1.Balance.eGLD(1000) }));
        this.accounts.set(MockProvider.AddressOfBob.bech32(), new account_1.AccountOnNetwork({ nonce: new nonce_1.Nonce(5), balance: balance_1.Balance.eGLD(500) }));
        this.accounts.set(MockProvider.AddressOfCarol.bech32(), new account_1.AccountOnNetwork({ nonce: new nonce_1.Nonce(42), balance: balance_1.Balance.eGLD(300) }));
    }
    mockUpdateAccount(address, mutate) {
        let account = this.accounts.get(address.bech32());
        if (account) {
            mutate(account);
        }
    }
    mockUpdateTransaction(hash, mutate) {
        let transaction = this.transactions.get(hash.toString());
        if (transaction) {
            mutate(transaction);
        }
    }
    mockPutTransaction(hash, item) {
        this.transactions.set(hash.toString(), item);
    }
    mockTransactionTimeline(transactionOrHash, timelinePoints) {
        return __awaiter(this, void 0, void 0, function* () {
            let hash = transactionOrHash instanceof transaction_1.TransactionHash ? transactionOrHash : transactionOrHash.hash;
            let timeline = new asyncTimer_1.AsyncTimer(`mock timeline of ${hash}`);
            yield timeline.start(0);
            for (const point of timelinePoints) {
                if (point instanceof transaction_1.TransactionStatus) {
                    this.mockUpdateTransaction(hash, (transaction) => {
                        transaction.status = point;
                    });
                }
                else if (point instanceof Wait) {
                    yield timeline.start(point.milliseconds);
                }
            }
        });
    }
    getAccount(address) {
        return __awaiter(this, void 0, void 0, function* () {
            let account = this.accounts.get(address.bech32());
            if (account) {
                return account;
            }
            return new account_1.AccountOnNetwork();
        });
    }
    sendTransaction(transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            this.mockPutTransaction(transaction.hash, new transaction_1.TransactionOnNetwork({
                nonce: transaction.nonce,
                sender: transaction.sender,
                receiver: transaction.receiver,
                data: transaction.data,
                status: new transaction_1.TransactionStatus("pending"),
            }));
            return transaction.hash;
        });
    }
    simulateTransaction(_transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
    getTransaction(txHash) {
        return __awaiter(this, void 0, void 0, function* () {
            let transaction = this.transactions.get(txHash.toString());
            if (transaction) {
                return transaction;
            }
            throw new errors.ErrMock("Transaction not found");
        });
    }
    getTransactionStatus(txHash) {
        return __awaiter(this, void 0, void 0, function* () {
            let transaction = this.transactions.get(txHash.toString());
            if (transaction) {
                return transaction.status;
            }
            throw new errors.ErrMock("Transaction not found");
        });
    }
    getNetworkConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            return new networkConfig_1.NetworkConfig();
        });
    }
    getNetworkStatus() {
        return __awaiter(this, void 0, void 0, function* () {
            return new networkStatus_1.NetworkStatus();
        });
    }
    queryContract(_query) {
        return __awaiter(this, void 0, void 0, function* () {
            return new query_1.QueryResponse();
        });
    }
}
exports.MockProvider = MockProvider;
MockProvider.AddressOfAlice = new address_1.Address("erd1qyu5wthldzr8wx5c9ucg8kjagg0jfs53s8nr3zpz3hypefsdd8ssycr6th");
MockProvider.AddressOfBob = new address_1.Address("erd1spyavw0956vq68xj8y4tenjpq2wd5a9p2c6j8gsz7ztyrnpxrruqzu66jx");
MockProvider.AddressOfCarol = new address_1.Address("erd1k2s324ww2g0yj38qn2ch2jwctdy8mnfxep94q9arncc6xecg3xaq6mjse8");
class Wait {
    constructor(milliseconds) {
        this.milliseconds = milliseconds;
    }
}
exports.Wait = Wait;
//# sourceMappingURL=mockProvider.js.map