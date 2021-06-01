import { EndpointDefinition } from "./endpoint";
/**
 * An Interace represents a (sub)set of endpoints (with their signatures included) defined by a contract.
 */
export declare class ContractInterface {
    readonly name: string;
    readonly endpoints: EndpointDefinition[];
    constructor(name: string, endpoints: EndpointDefinition[]);
    static fromJSON(json: {
        name: string;
        endpoints: any[];
    }): ContractInterface;
    getEndpoint(name: string): EndpointDefinition;
}
