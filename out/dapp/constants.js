"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LEDGER_TX_HASH_SIGN_MIN_VERSION = exports.DAPP_MESSAGE_SEND_TRANSACTION_URL = exports.DAPP_MESSAGE_LOG_OUT = exports.DAPP_MESSAGE_CONNECT_URL = exports.DAPP_MESSAGE_GET_ADDRESS = exports.DAPP_MESSAGE_IS_CONNECTED = exports.DAPP_MESSAGE_INIT = exports.DAPP_DEFAULT_TIMEOUT = exports.WALLET_PROVIDER_TESTNET = exports.WALLET_PROVIDER_MAINNET = void 0;
exports.WALLET_PROVIDER_MAINNET = 'https://wallet.elrond.com/dapp/init';
exports.WALLET_PROVIDER_TESTNET = 'https://testnet-wallet.elrond.com/dapp/init';
// Wallet intercom messages
exports.DAPP_DEFAULT_TIMEOUT = 5000;
exports.DAPP_MESSAGE_INIT = 'dapp_message_init';
exports.DAPP_MESSAGE_IS_CONNECTED = 'dapp_message_is_connected';
exports.DAPP_MESSAGE_GET_ADDRESS = 'dapp_message_get_address';
exports.DAPP_MESSAGE_CONNECT_URL = 'dapp_message_connect_url';
exports.DAPP_MESSAGE_LOG_OUT = 'dapp_message_log_out';
exports.DAPP_MESSAGE_SEND_TRANSACTION_URL = 'dapp_message_send_transaction_url';
// This constant represents the minimum version in which the Elrond Ledger App doesn't support anymore regular
// transactions' signing, and uses transaction's hash signing instead
exports.LEDGER_TX_HASH_SIGN_MIN_VERSION = '1.0.11';
//# sourceMappingURL=constants.js.map