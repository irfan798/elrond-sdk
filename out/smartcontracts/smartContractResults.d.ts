/// <reference types="node" />
import { Address } from "../address";
import { Balance } from "../balance";
import { Hash } from "../hash";
import { GasLimit, GasPrice } from "../networkParams";
import { Nonce } from "../nonce";
import { EndpointDefinition, TypedValue } from "./typesystem";
import { ReturnCode } from "./returnCode";
export declare class SmartContractResults {
    private readonly items;
    private readonly immediate;
    private readonly resultingCalls;
    constructor(items: SmartContractResultItem[]);
    static empty(): SmartContractResults;
    static fromHttpResponse(smartContractResults: any[]): SmartContractResults;
    private findImmediateResult;
    private findResultingCalls;
    getImmediate(): ImmediateResult;
    getResultingCalls(): ResultingCall[];
}
export declare class SmartContractResultItem {
    hash: Hash;
    nonce: Nonce;
    value: Balance;
    receiver: Address;
    sender: Address;
    data: string;
    previousHash: Hash;
    originalHash: Hash;
    gasLimit: GasLimit;
    gasPrice: GasPrice;
    callType: number;
    returnMessage: string;
    static fromHttpResponse(response: {
        hash: string;
        nonce: number;
        value: string;
        receiver: string;
        sender: string;
        data: string;
        prevTxHash: string;
        originalTxHash: string;
        gasLimit: number;
        gasPrice: number;
        callType: number;
        returnMessage: string;
    }): SmartContractResultItem;
    getDataTokens(): Buffer[];
}
export declare class ImmediateResult extends SmartContractResultItem {
    /**
     * If available, will provide typed output arguments (with typed values).
     */
    private endpointDefinition?;
    constructor(init?: Partial<SmartContractResultItem>);
    assertSuccess(): void;
    isSuccess(): boolean;
    getReturnCode(): ReturnCode;
    outputUntyped(): Buffer[];
    outputTyped(): TypedValue[];
    setEndpointDefinition(endpointDefinition: EndpointDefinition): void;
}
export declare class ResultingCall extends SmartContractResultItem {
    constructor(init?: Partial<ResultingCall>);
}
