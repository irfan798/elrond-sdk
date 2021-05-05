export declare class ESDTToken {
    token: string;
    name: string;
    owner: string;
    minted: string;
    burnt: string;
    decimals: number;
    isPaused: boolean;
    canUpgrade: boolean;
    canMint: boolean;
    canBurn: boolean;
    canChangeOwner: boolean;
    canPause: boolean;
    canFreeze: boolean;
    canWipe: boolean;
    constructor(init?: Partial<ESDTToken>);
    static fromHttpResponse(response: {
        token: string;
        name: string;
        owner: string;
        minted: string;
        burnt: string;
        decimals: number;
        isPaused: boolean;
        canUpgrade: boolean;
        canMint: boolean;
        canBurn: boolean;
        canChangeOwner: boolean;
        canPause: boolean;
        canFreeze: boolean;
        canWipe: boolean;
    }): ESDTToken;
    getTokenName(): string;
    getTokenIdentifier(): string;
}
