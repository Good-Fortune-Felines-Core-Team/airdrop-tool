import process from "node:process";

import type { Configuration } from "@app/types";

/**
 * Parses the environment variables and returns them as an object.
 * @returns {Configuration} a parsed configuration object.
 * @throws {Error} if any of the required environment variables are undefined.
 */
export default function parseConfiguration(): Configuration {
  if (!process.env.NEAR_EXPLORER_URL) {
    throw new Error("ConfigurationError: no explorer url found");
  }

  if (!process.env.NEAR_NETWORK_ID) {
    throw new Error("ConfigurationError: no network id found");
  }

  if (!process.env.NEAR_HELPER_URL) {
    throw new Error("ConfigurationError: no helper url found");
  }

  if (!process.env.NEAR_RPC_URL) {
    throw new Error("ConfigurationError: no rpc url found");
  }

  if (!process.env.NEAR_WALLET_URL) {
    throw new Error("ConfigurationError: no wallet url found");
  }

  return {
    explorerUrl: process.env.NEAR_EXPLORER_URL,
    networkId: process.env.NEAR_NETWORK_ID,
    helperUrl: process.env.NEAR_HELPER_URL,
    rpcUrl: process.env.NEAR_RPC_URL,
    walletUrl: process.env.NEAR_WALLET_URL,
  };
}
