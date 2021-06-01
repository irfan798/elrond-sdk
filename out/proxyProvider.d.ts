import { IProvider } from "./interface";
import { Transaction, TransactionHash, TransactionOnNetwork, TransactionStatus } from "./transaction";
import { NetworkConfig } from "./networkConfig";
import { Address } from "./address";
import { AccountOnNetwork } from "./account";
import { Query, QueryResponse } from "./smartcontracts/query";
import { NetworkStatus } from "./networkStatus";
/**
 * This will be deprecated once all the endpoints move to ApiProvider
 */
export declare class ProxyProvider implements IProvider {
    private url;
    private timeoutLimit;
    /**
     * Creates a new ProxyProvider.
     * @param url the URL of the Elrond Proxy
     * @param timeout the timeout for any request-response, in milliseconds
     */
    constructor(url: string, timeout?: number);
    /**
     * Fetches the state of an {@link Account}.
     */
    getAccount(address: Address): Promise<AccountOnNetwork>;
    /**
     * Queries a Smart Contract - runs a pure function defined by the contract and returns its results.
     */
    queryContract(query: Query): Promise<QueryResponse>;
    /**
     * Broadcasts an already-signed {@link Transaction}.
     */
    sendTransaction(tx: Transaction): Promise<TransactionHash>;
    /**
     * Simulates the processing of an already-signed {@link Transaction}.
     */
    simulateTransaction(tx: Transaction): Promise<any>;
    /**
     * Fetches the state of a {@link Transaction}.
     */
    getTransaction(txHash: TransactionHash): Promise<TransactionOnNetwork>;
    /**
     * Queries the status of a {@link Transaction}.
     */
    getTransactionStatus(txHash: TransactionHash): Promise<TransactionStatus>;
    /**
     * Fetches the Network configuration.
     */
    getNetworkConfig(): Promise<NetworkConfig>;
    /**
     * Fetches the network status configuration.
     */
    getNetworkStatus(): Promise<NetworkStatus>;
    private doGet;
    private doPost;
}
