"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractInterface = void 0;
const utils_1 = require("../../utils");
const endpoint_1 = require("./endpoint");
const NamePlaceholder = "?";
/**
 * An Interace represents a (sub)set of endpoints (with their signatures included) defined by a contract.
 */
class ContractInterface {
    constructor(name, endpoints) {
        this.endpoints = [];
        this.name = name;
        this.endpoints = endpoints;
    }
    static fromJSON(json) {
        json.name = json.name || NamePlaceholder;
        json.endpoints = json.endpoints || [];
        let endpoints = json.endpoints.map(item => endpoint_1.EndpointDefinition.fromJSON(item));
        return new ContractInterface(json.name, endpoints);
    }
    getEndpoint(name) {
        let result = this.endpoints.find(e => e.name == name);
        utils_1.guardValueIsSet("result", result);
        return result;
    }
}
exports.ContractInterface = ContractInterface;
//# sourceMappingURL=contractInterface.js.map