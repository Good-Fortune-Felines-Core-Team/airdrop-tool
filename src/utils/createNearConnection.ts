import { connect, keyStores, Near } from "near-api-js";
import os from "node:os";
import { join } from "node:path";

import { CREDENTIALS_DIRECTORY } from "@app/constants";
import type { Configuration } from "@app/types";

/**
 * Convenience function to create a connection to the Near network.
 * @param {Configuration} config - customizes the connection.
 * @returns {Promise<Near>} a promise that resolves to an initialized Near connection.
 */
export default async function createNearConnection({ explorerUrl, helperUrl, networkId, rpcUrl: nodeUrl, walletUrl }: Configuration): Promise<Near> {
  return await connect({
    explorerUrl,
    helperUrl,
    keyStore: new keyStores.UnencryptedFileSystemKeyStore(join(os.homedir(), CREDENTIALS_DIRECTORY)), // create a key store
    networkId,
    nodeUrl,
    walletUrl,
  });
}
