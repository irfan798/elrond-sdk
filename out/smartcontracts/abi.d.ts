import { AbiRegistry, EndpointDefinition } from "./typesystem";
export declare class SmartContractAbi {
    private readonly interfaces;
    constructor(registry: AbiRegistry, implementsInterfaces: string[]);
    getAllEndpoints(): EndpointDefinition[];
    getEndpoint(name: string): EndpointDefinition;
}
