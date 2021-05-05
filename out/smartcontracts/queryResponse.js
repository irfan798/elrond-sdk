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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryResponse = void 0;
const networkParams_1 = require("../networkParams");
const errors = __importStar(require("../errors"));
const query_1 = require("./query");
const returnCode_1 = require("./returnCode");
const utils_1 = require("../utils");
const argSerializer_1 = require("./argSerializer");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
class QueryResponse {
    constructor(init) {
        this.returnData = (init === null || init === void 0 ? void 0 : init.returnData) || [];
        this.returnCode = (init === null || init === void 0 ? void 0 : init.returnCode) || returnCode_1.ReturnCode.Unknown;
        this.returnMessage = (init === null || init === void 0 ? void 0 : init.returnMessage) || "";
        this.gasUsed = (init === null || init === void 0 ? void 0 : init.gasUsed) || networkParams_1.GasLimit.min();
    }
    /**
     * Constructs a QueryResponse object from a HTTP response (as returned by the provider).
     */
    static fromHttpResponse(payload) {
        let returnData = payload["returnData"] || payload["ReturnData"];
        let returnCode = payload["returnCode"] || payload["ReturnCode"];
        let returnMessage = payload["returnMessage"] || payload["ReturnMessage"];
        let gasRemaining = new bignumber_js_1.default(payload["gasRemaining"] || payload["GasRemaining"] || 0);
        let gasUsed = new networkParams_1.GasLimit(query_1.MaxUint64.minus(gasRemaining).toNumber());
        return new QueryResponse({
            returnData: returnData,
            returnCode: new returnCode_1.ReturnCode(returnCode),
            returnMessage: returnMessage,
            gasUsed: gasUsed,
        });
    }
    assertSuccess() {
        if (this.isSuccess()) {
            return;
        }
        throw new errors.ErrContract(`${this.returnCode}: ${this.returnMessage}`);
    }
    isSuccess() {
        return this.returnCode.equals(returnCode_1.ReturnCode.Ok);
    }
    setEndpointDefinition(endpointDefinition) {
        this.endpointDefinition = endpointDefinition;
    }
    outputUntyped() {
        this.assertSuccess();
        let buffers = this.returnData.map((item) => Buffer.from(item || "", "base64"));
        return buffers;
    }
    outputTyped() {
        this.assertSuccess();
        utils_1.guardValueIsSet("endpointDefinition", this.endpointDefinition);
        let buffers = this.outputUntyped();
        let values = new argSerializer_1.ArgSerializer().buffersToValues(buffers, this.endpointDefinition.output);
        return values;
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
            gasUsed: this.gasUsed.valueOf(),
        };
    }
}
exports.QueryResponse = QueryResponse;
//# sourceMappingURL=queryResponse.js.map