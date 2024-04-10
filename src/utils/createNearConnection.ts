import { connect, keyStores, Near } from "near-api-js";
import os from "node:os";
import { join } from "node:path";
import process from "node:process";

import { CREDENTIALS_DIRECTORY } from "@app/constants";

/**
 * Convenience function to create a connection to the Near network.
 * @returns {Promise<Near>} a promise that resolves to an initialized Near connection.
 */
export default async function createNearConnection(): Promise<Near> {
  return await connect({
    explorerUrl: process.env.NEAR_EXPLORER_URL,
    helperUrl: process.env.NEAR_HELPER_URL,
    keyStore: new keyStores.UnencryptedFileSystemKeyStore(join(os.homedir(), CREDENTIALS_DIRECTORY)), // create a key store
    networkId: process.env.NEAR_NETWORK_ID,
    nodeUrl: process.env.NEAR_RPC_URL,
    walletUrl: process.env.NEAR_WALLET_URL,
  });
}
