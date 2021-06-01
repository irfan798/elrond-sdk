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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResultingCall = exports.ImmediateResult = exports.SmartContractResultItem = exports.SmartContractResults = void 0;
const errors = __importStar(require("../errors"));
const address_1 = require("../address");
const balance_1 = require("../balance");
const hash_1 = require("../hash");
const networkParams_1 = require("../networkParams");
const nonce_1 = require("../nonce");
const transaction_1 = require("../transaction");
const argSerializer_1 = require("./argSerializer");
const utils_1 = require("../utils");
const returnCode_1 = require("./returnCode");
class SmartContractResults {
    constructor(items) {
        this.items = [];
        this.immediate = new ImmediateResult();
        this.resultingCalls = [];
        this.items = items;
        if (this.items.length > 0) {
            this.immediate = this.findImmediateResult();
            this.resultingCalls = this.findResultingCalls();
        }
    }
    static empty() {
        return new SmartContractResults([]);
    }
    static fromHttpResponse(smartContractResults) {
        let items = (smartContractResults || []).map((item) => SmartContractResultItem.fromHttpResponse(item));
        return new SmartContractResults(items);
    }
    findImmediateResult() {
        let immediateItem = this.items[0];
        utils_1.guardValueIsSet("immediateItem", immediateItem);
        return new ImmediateResult(immediateItem);
    }
    findResultingCalls() {
        let otherItems = this.items.slice(1);
        let resultingCalls = otherItems.map(item => new ResultingCall(item));
        return resultingCalls;
    }
    getImmediate() {
        return this.immediate;
    }
    getResultingCalls() {
        return this.resultingCalls;
    }
}
exports.SmartContractResults = SmartContractResults;
class SmartContractResultItem {
    constructor() {
        this.hash = hash_1.Hash.empty();
        this.nonce = new nonce_1.Nonce(0);
        this.value = balance_1.Balance.Zero();
        this.receiver = new address_1.Address();
        this.sender = new address_1.Address();
        this.data = "";
        this.previousHash = hash_1.Hash.empty();
        this.originalHash = hash_1.Hash.empty();
        this.gasLimit = new networkParams_1.GasLimit(0);
        this.gasPrice = new networkParams_1.GasPrice(0);
        this.callType = 0;
        this.returnMessage = "";
    }
    static fromHttpResponse(response) {
        let item = new SmartContractResultItem();
        item.hash = new transaction_1.TransactionHash(response.hash);
        item.nonce = new nonce_1.Nonce(response.nonce || 0);
        item.value = balance_1.Balance.fromString(response.value);
        item.receiver = new address_1.Address(response.receiver);
        item.sender = new address_1.Address(response.sender);
        item.data = response.data || "";
        item.previousHash = new transaction_1.TransactionHash(response.prevTxHash);
        item.originalHash = new transaction_1.TransactionHash(response.originalTxHash);
        item.gasLimit = new networkParams_1.GasLimit(response.gasLimit);
        item.gasPrice = new networkParams_1.GasPrice(response.gasPrice);
        item.callType = response.callType;
        item.returnMessage = response.returnMessage;
        return item;
    }
    getDataTokens() {
        let serializer = new argSerializer_1.ArgSerializer();
        return serializer.stringToBuffers(this.data);
    }
}
exports.SmartContractResultItem = SmartContractResultItem;
class ImmediateResult extends SmartContractResultItem {
    constructor(init) {
        super();
        Object.assign(this, init);
    }
    assertSuccess() {
        if (this.isSuccess()) {
            return;
        }
        throw new errors.ErrContract(`${this.getReturnCode()}: ${this.returnMessage}`);
    }
    isSuccess() {
        return this.getReturnCode().equals(returnCode_1.ReturnCode.Ok);
    }
    getReturnCode() {
        // Question for review: is this correct? Is the first parameter of a SCR always void and unused? E.g.: @6f6b@2b.
        let returnCodeToken = this.getDataTokens()[1];
        return returnCode_1.ReturnCode.fromBuffer(returnCodeToken);
    }
    outputUntyped() {
        this.assertSuccess();
        // Question for review: is this correct? Is the first parameter of a SCR always void and unused? E.g.: @6f6b@2b.
        return this.getDataTokens().slice(2);
    }
    outputTyped() {
        this.assertSuccess();
        utils_1.guardValueIsSet("endpointDefinition", this.endpointDefinition);
        let buffers = this.outputUntyped();
        let values = new argSerializer_1.ArgSerializer().buffersToValues(buffers, this.endpointDefinition.output);
        return values;
    }
    setEndpointDefinition(endpointDefinition) {
        this.endpointDefinition = endpointDefinition;
    }
}
exports.ImmediateResult = ImmediateResult;
class ResultingCall extends SmartContractResultItem {
    constructor(init) {
        super();
        Object.assign(this, init);
    }
}
exports.ResultingCall = ResultingCall;
//# sourceMappingURL=smartContractResults.js.map