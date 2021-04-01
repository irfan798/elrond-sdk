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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractReturnData = exports.QueryResponse = exports.Query = void 0;
const function_1 = require("./function");
const balance_1 = require("../balance");
const address_1 = require("../address");
const utils_1 = require("../utils");
const networkParams_1 = require("../networkParams");
const errors = __importStar(require("../errors"));
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const MaxUint64 = new bignumber_js_1.default("18446744073709551615");
class Query {
    constructor(init) {
        this.caller = new address_1.Address();
        this.address = new address_1.Address();
        this.func = function_1.ContractFunction.none();
        this.args = [];
        this.value = balance_1.Balance.Zero();
        Object.assign(this, init);
        utils_1.guardValueIsSet("address", this.address);
        utils_1.guardValueIsSet("func", this.func);
        this.address.assertNotEmpty();
        this.args = this.args || [];
        this.caller = this.caller || new address_1.Address();
        this.value = this.value || balance_1.Balance.Zero();
    }
    toHttpRequest() {
        let request = {
            "scAddress": this.address.bech32(),
            "funcName": this.func.toString(),
            "args": this.args.map(arg => arg.valueOf()),
            "value": this.value.toString()
        };
        if (!this.caller.isEmpty()) {
            request["caller"] = this.caller.bech32();
        }
        return request;
    }
}
exports.Query = Query;
class QueryResponse {
    constructor() {
        this.returnData = [];
        this.returnCode = "";
        this.returnMessage = "";
        this.gasUsed = networkParams_1.GasLimit.min();
    }
    /**
     * Constructs a QueryResponse object from a HTTP response (as returned by the provider).
     */
    static fromHttpResponse(payload) {
        let result = new QueryResponse();
        result.vmOutput = payload;
        result.returnData = ContractReturnData.fromArray(payload["returnData"] || payload["ReturnData"] || []);
        result.returnCode = payload["returnCode"] || (payload["ReturnCode"]).toString() || "";
        result.returnMessage = payload["returnMessage"] || payload["ReturnMessage"] || "";
        let gasRemaining = new bignumber_js_1.default(payload["gasRemaining"] || payload["GasRemaining"] || 0);
        let gasUsed = MaxUint64.minus(gasRemaining);
        result.gasUsed = new networkParams_1.GasLimit(Number(gasUsed.toString(10)));
        return result;
    }
    assertSuccess() {
        if (this.isSuccess()) {
            return;
        }
        throw new errors.ErrContract(`${this.returnCode}: ${this.returnMessage}`);
    }
    isSuccess() {
        let ok = this.returnCode == "ok" || this.returnCode == "0";
        return ok;
    }
    firstResult() {
        let first = this.returnData[0];
        return first;
    }
    buffers() {
        return this.returnData.map(data => data.asBuffer);
    }
    /**
     * Converts the object to a pretty, plain JavaScript object.
     */
    toJSON() {
        return {
            success: this.isSuccess(),
            returnData: this.returnData,
            returnCode: this.returnCode,
            returnMessage: this.returnMessage,
            gasUsed: this.gasUsed.valueOf()
        };
    }
}
exports.QueryResponse = QueryResponse;
// TODO: use types & codecs
class ContractReturnData {
    constructor(asBase64) {
        this.asBase64 = asBase64 || "";
        this.asBuffer = Buffer.from(this.asBase64, "base64");
        this.asHex = this.asBuffer.toString("hex");
        this.asNumber = parseInt(this.asHex, 16) || 0;
        this.asBigInt = new bignumber_js_1.default(`0x${this.asHex || "00"}`, 16);
        this.asString = this.asBuffer.toString();
        this.asBool = this.asNumber != 0 &&
            this.asString.toLowerCase() !== "false" &&
            this.asString.toLowerCase() !== "no" &&
            this.asString !== "" &&
            !this.asBigInt.eq(0, 10);
    }
    static fromArray(raw) {
        let result = raw.map(item => new ContractReturnData(item));
        return result;
    }
}
exports.ContractReturnData = ContractReturnData;
//# sourceMappingURL=query.js.map