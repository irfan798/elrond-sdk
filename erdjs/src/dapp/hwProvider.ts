//import TransportU2f from "@ledgerhq/hw-transport-u2f";
//import TransportWebUSB from "@ledgerhq/hw-transport-webusb";
// @ts-ignore
// import AppElrond from "@elrondnetwork/hw-app-elrond";

// import platform from "platform";

// import {IDappProvider, IHWElrondApp} from "./interface";
// import {IProvider} from "../interface";
// import {Transaction} from "../transaction";
// import {Address} from "../address";
// import {Signature} from "../signature";

export class HWProvider {
    constructor(httpProvider: any) {
        throw new Error("HWProvider is disabled");
        console.log(httpProvider)
    }
}

// export class HWProvider implements IDappProvider {
//     provider: IProvider;
//     hwApp?: IHWElrondApp;

//     constructor(httpProvider: IProvider) {
//         this.provider = httpProvider;
//     }

//     /**
//      * Creates transport and initialises ledger app.
//      */
//     async init(): Promise<boolean> {
//         throw new Error("HWProvider is disabled");
//         // let webUSBSupported = await TransportWebUSB.isSupported();
//         // webUSBSupported =
//         //     webUSBSupported && !!platform.os && platform.os.family !== "Windows" && platform.name !== "Opera";

//         // const transport = webUSBSupported ? await TransportWebUSB.create() : await TransportU2f.create();
//         // this.hwApp = new AppElrond(transport);

//         // return true;
//     }

//     /**
//      * Returns true if init() was previously called succesfully
//      */
//     isInitialized(): boolean {
//         throw new Error("HWProvider is disabled");
//         // return !!this.hwApp;
//     }

//     /**
//      * Mocked function, returns isInitialized as an async function
//      */
//     isConnected(): Promise<boolean> {
//         throw new Error("HWProvider is disabled");
//         // return new Promise((resolve, _) => resolve(this.isInitialized()));
//     }

//     /**
//      * Mocks a login request by returning the ledger selected address
//      */
//     async login(): Promise<string> {
//         throw new Error("HWProvider is disabled");
//         // if (!this.hwApp) {
//         //     throw new Error("HWApp not initialised, call init() first");
//         // }

//         // const config = await this.hwApp.getAppConfiguration();
//         // const { address } =  await this.hwApp.getAddress(config.accountIndex, config.addressIndex);

//         // return address;
//     }

//     /**
//      * Mocks a logout request by returning true
//      */
//     async logout(): Promise<boolean> {
//         throw new Error("HWProvider is disabled");
//         // if (!this.hwApp) {
//         //     throw new Error("HWApp not initialised, call init() first");
//         // }

//         // return true;
//     }

//     /**
//      * Fetches current selected ledger address
//      */
//     async getAddress(): Promise<string> {
//         throw new Error("HWProvider is disabled");
//         // return this.getCurrentAddress();
//     }

//     /**
//      * Signs and sends a transaction. Returns the transaction hash
//      * @param transaction
//      */
//     async sendTransaction(transaction: Transaction): Promise<Transaction> {
//         throw new Error("HWProvider is disabled");
//         // if (!this.hwApp) {
//         //     throw new Error("HWApp not initialised, call init() first");
//         // }

//         // const address = await this.getCurrentAddress();
//         // transaction.sender = new Address(address);

//         // const sig = await this.hwApp.signTransaction(transaction.serializeForSigning(new Address(address)));
//         // transaction.signature = new Signature(sig);

//         // await transaction.send(this.provider);

//         // return transaction;
//     }

//     private async getCurrentAddress(): Promise<string> {
//         throw new Error("HWProvider is disabled");
//         // if (!this.hwApp) {
//         //     throw new Error("HWApp not initialised, call init() first");
//         // }

//         // const config = await this.hwApp.getAppConfiguration();
//         // const { address } =  await this.hwApp.getAddress(config.accountIndex, config.addressIndex);

//         // return address;
//     }
// }
