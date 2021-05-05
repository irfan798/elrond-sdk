import WalletClient from "@walletconnect/client";
import { IProvider } from "../interface";
import { Transaction } from "../transaction";
import { IDappProvider } from "./interface";
export declare class WalletConnectProvider extends EventTarget implements IDappProvider {
    provider: IProvider;
    walletConnectBridge: string;
    address: string;
    walletConnector: WalletClient | undefined;
    private onWalletConnectLogin;
    private onWalletConnectDisconect;
    constructor(httpProvider: IProvider, walletConnectBridge?: string);
    /**
     * Initiates wallet connect client.
     */
    init(): Promise<boolean>;
    /**
     * Returns true if init() was previously called successfully
     */
    isInitialized(): boolean;
    /**
     * Mocked function, returns isInitialized as an async function
     */
    isConnected(): Promise<boolean>;
    /**
     *
     */
    login(): Promise<string>;
    /**
     * Mocks a logout request by returning true
     */
    logout(): Promise<boolean>;
    /**
     * Fetches current selected ledger address
     */
    getAddress(): Promise<string>;
    /**
     * Signs and sends a transaction. Returns the transaction hash
     * @param transaction
     */
    sendTransaction(transaction: Transaction): Promise<Transaction>;
    private onConnect;
    private onDisconnect;
    private loginAccount;
    private signTransaction;
    private prepareWalletConnectMessage;
    private addressIsValid;
}
