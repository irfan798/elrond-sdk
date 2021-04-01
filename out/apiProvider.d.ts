import { IApiProvider } from "./interface";
import { NetworkStake } from "./networkStake";
import { Stats } from "./stats";
import { TransactionHash, TransactionOnNetwork } from ".";
/**
 * This is a temporary change, this will be the only provider used, ProxyProvider will be deprecated
 */
export declare class ApiProvider implements IApiProvider {
    private url;
    private timeoutLimit;
    /**
     * Creates a new ApiProvider.
     * @param url the URL of the Elrond Api
     * @param timeout the timeout for any request-response, in milliseconds
     */
    constructor(url: string, timeout?: number);
    /**
     * Fetches the Network Stake.
     */
    getNetworkStake(): Promise<NetworkStake>;
    /**
     * Fetches the Network Stats.
     */
    getNetworkStats(): Promise<Stats>;
    /**
     * Fetches the state of a {@link Transaction}.
     */
    getTransaction(txHash: TransactionHash): Promise<TransactionOnNetwork>;
    private doGet;
    private handleApiError;
}
