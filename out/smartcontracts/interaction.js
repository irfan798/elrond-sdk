"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Interaction = void 0;
const balance_1 = require("../balance");
const networkParams_1 = require("../networkParams");
const query_1 = require("./query");
const address_1 = require("../address");
const nonce_1 = require("../nonce");
/**
 * Interactions can be seen as mutable transaction & query builders.
 *
 * Aside from building transactions and queries, the interactors are also responsible for interpreting
 * the execution outcome for the objects they've built.
 */
class Interaction {
    constructor(contract, func, args) {
        this.nonce = new nonce_1.Nonce(0);
        this.value = balance_1.Balance.Zero();
        this.gasLimit = networkParams_1.GasLimit.min();
        this.contract = contract;
        this.func = func;
        this.args = args;
    }
    getContract() {
        return this.contract;
    }
    getFunction() {
        return this.func;
    }
    getArguments() {
        return this.args;
    }
    getValue() {
        return this.value;
    }
    getGasLimit() {
        return this.gasLimit;
    }
    buildTransaction() {
        // TODO: create as "deploy" transaction if the function is "init" (or find a better pattern for deployments).
        let transaction = this.contract.call({
            func: this.func,
            // GasLimit will be set using "withGasLimit()".
            gasLimit: this.gasLimit,
            args: this.args,
            // Value will be set using "withValue()".
            value: this.value
        });
        transaction.setNonce(this.nonce);
        return transaction;
    }
    buildQuery() {
        return new query_1.Query({
            address: this.contract.getAddress(),
            func: this.func,
            args: this.args,
            // Value will be set using "withValue()".
            value: this.value,
            // Caller will be set by the InteractionRunner.
            caller: new address_1.Address()
        });
    }
    /**
     * Interprets the results of a previously broadcasted (and fully executed) smart contract transaction.
     * The outcome is structured such that it allows quick access to each level of detail.
     */
    interpretExecutionResults(transactionOnNetwork) {
        let smartContractResults = transactionOnNetwork.getSmartContractResults();
        let immediateResult = smartContractResults.getImmediate();
        let endpoint = this.getEndpointDefinition();
        immediateResult.setEndpointDefinition(endpoint);
        let values = immediateResult.outputTyped();
        let returnCode = immediateResult.getReturnCode();
        return {
            transactionOnNetwork: transactionOnNetwork,
            smartContractResults: smartContractResults,
            immediateResult: immediateResult,
            values: values,
            firstValue: values[0],
            returnCode: returnCode
        };
    }
    /**
     * Interprets the raw outcome of a Smart Contract query.
     * The outcome is structured such that it allows quick access to each level of detail.
     */
    interpretQueryResponse(queryResponse) {
        let endpoint = this.getEndpointDefinition();
        queryResponse.setEndpointDefinition(endpoint);
        let values = queryResponse.outputTyped();
        let returnCode = queryResponse.returnCode;
        return {
            queryResponse: queryResponse,
            values: values,
            firstValue: values[0],
            returnCode: returnCode
        };
    }
    withValue(value) {
        this.value = value;
        return this;
    }
    withGasLimit(gasLimit) {
        this.gasLimit = gasLimit;
        return this;
    }
    withNonce(nonce) {
        this.nonce = nonce;
        return this;
    }
    getEndpointDefinition() {
        let abi = this.getContract().getAbi();
        let name = this.getFunction().toString();
        let endpoint = abi.getEndpoint(name);
        return endpoint;
    }
}
exports.Interaction = Interaction;
//# sourceMappingURL=interaction.js.map