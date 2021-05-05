import Axios, { AxiosTransformer } from "axios";
import { IApiProvider } from "./interface";
import * as errors from "./errors";
import { Logger } from "./logger";
import { NetworkStake } from "./networkStake";
import { Stats } from "./stats";
import { TransactionHash, TransactionOnNetwork } from ".";
const JSONbig = require("json-bigint");

/**
 * This is a temporary change, this will be the only provider used, ProxyProvider will be deprecated
 */
export class ApiProvider implements IApiProvider {
    private url: string;
    private timeoutLimit: number;

    /**
     * Creates a new ApiProvider.
     * @param url the URL of the Elrond Api
     * @param timeout the timeout for any request-response, in milliseconds
     */
    constructor(url: string, timeout?: number) {
        this.url = url;
        this.timeoutLimit = timeout || 1000;
    }

    /**
     * Fetches the Network Stake.
     */
    async getNetworkStake(): Promise<NetworkStake> {
        let response = await this.doGet("stake");
        return NetworkStake.fromHttpResponse(response);
    }

    /**
     * Fetches the Network Stats.
     */
    async getNetworkStats(): Promise<Stats> {
        let response = await this.doGet("stats");
        return Stats.fromHttpResponse(response);
    }

    /**
     * Fetches the state of a {@link Transaction}.
     */
    async getTransaction(txHash: TransactionHash): Promise<TransactionOnNetwork> {
        let response = await this.doGet(`transactions/${txHash.toString()}`);
        return TransactionOnNetwork.fromHttpResponse(response);
    }

    private async doGet(resourceUrl: string): Promise<any> {
        try {
            let url = `${this.url}/${resourceUrl}`;
            let response = await axios.get(url, { timeout: this.timeoutLimit });

            return response.data;
        } catch (error) {
            this.handleApiError(error, resourceUrl);
        }
    }

    private handleApiError(error: any, resourceUrl: string) {
        if (!error.response) {
            Logger.warn(error);
            throw new errors.ErrApiProviderGet(resourceUrl, error.toString(), error);
        }

        let errorData = error.response.data;
        let originalErrorMessage = errorData.error || errorData.message || JSON.stringify(errorData);
        throw new errors.ErrApiProviderGet(resourceUrl, originalErrorMessage, error);
    }
}

// See: https://github.com/axios/axios/issues/983
const bigIntTransformer: AxiosTransformer = (data: any) => {
  if (typeof data === 'string') {
    try {
      data = JSONbig.parse(data);
    } catch (e) { /* Ignore */ }
  }
  return data;
}

const axios = Axios.create({
  // First try to parse data with bigInt parse, then run execute default parsers
  transformResponse: ([] as any).concat(
    bigIntTransformer,
    Axios.defaults.transformResponse,
  )
});
