import { Type, CustomType } from "./types";
export declare class TypeMapper {
    private readonly openTypesConstructors;
    private readonly closedTypesMap;
    constructor(customTypes?: CustomType[]);
    mapType(type: Type): Type;
    private mapStructType;
    private mapGenericType;
}
