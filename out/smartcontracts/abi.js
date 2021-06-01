"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmartContractAbi = void 0;
const utils_1 = require("../utils");
class SmartContractAbi {
    constructor(registry, implementsInterfaces) {
        this.interfaces = [];
        this.interfaces.push(...registry.getInterfaces(implementsInterfaces));
    }
    getAllEndpoints() {
        let endpoints = [];
        for (const iface of this.interfaces) {
            endpoints.push(...iface.endpoints);
        }
        return endpoints;
    }
    getEndpoint(name) {
        let result = this.getAllEndpoints().find(item => item.name == name);
        utils_1.guardValueIsSet("result", result);
        return result;
    }
}
exports.SmartContractAbi = SmartContractAbi;
//# sourceMappingURL=abi.js.map