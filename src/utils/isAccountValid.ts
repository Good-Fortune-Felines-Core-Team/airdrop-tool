import { Near } from "near-api-js";

interface Options {
  nearConnection: Near;
}

/**
 * Checks if the account, specified at the account ID, exists on the network.
 * @param {string} accountId - the ID of the account to check.
 * @param {Options} options - options that include the Near network connection.
 * @returns {Promise<boolean>} a Promise that resolves to true if the account is valid, false otherwise.
 */
export default async function isAccountValid(accountId: string, { nearConnection }: Options): Promise<boolean> {
  try {
    await nearConnection.connection.provider
      .query(`account/${accountId}`, "");

    return true;
  } catch (error) {
    return false;
  }
}
