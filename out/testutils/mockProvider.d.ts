import { IProvider } from "../interface";
import { Transaction, TransactionHash, TransactionOnNetwork, TransactionStatus } from "../transaction";
import { NetworkConfig } from "../networkConfig";
import { Address } from "../address";
import { AccountOnNetwork } from "../account";
import { Query, QueryResponse } from "../smartcontracts/query";
import { NetworkStatus } from "../networkStatus";
/**
 * A mock {@link IProvider}, used for tests only.
 */
export declare class MockProvider implements IProvider {
    static AddressOfAlice: Address;
    static AddressOfBob: Address;
    static AddressOfCarol: Address;
    private readonly accounts;
    private readonly transactions;
    constructor();
    mockUpdateAccount(address: Address, mutate: (item: AccountOnNetwork) => void): void;
    mockUpdateTransaction(hash: TransactionHash, mutate: (item: TransactionOnNetwork) => void): void;
    mockPutTransaction(hash: TransactionHash, item: TransactionOnNetwork): void;
    mockTransactionTimeline(transactionOrHash: Transaction | TransactionHash, timelinePoints: any[]): Promise<void>;
    getAccount(address: Address): Promise<AccountOnNetwork>;
    sendTransaction(transaction: Transaction): Promise<TransactionHash>;
    simulateTransaction(_transaction: Transaction): Promise<any>;
    getTransaction(txHash: TransactionHash): Promise<TransactionOnNetwork>;
    getTransactionStatus(txHash: TransactionHash): Promise<TransactionStatus>;
    getNetworkConfig(): Promise<NetworkConfig>;
    getNetworkStatus(): Promise<NetworkStatus>;
    queryContract(_query: Query): Promise<QueryResponse>;
}
export declare class Wait {
    readonly milliseconds: number;
    constructor(milliseconds: number);
}
