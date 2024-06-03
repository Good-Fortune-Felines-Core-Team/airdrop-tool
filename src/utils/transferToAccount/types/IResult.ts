/**
 * @property {number} nonce - the incremented nonce including the successful transaction and any retries.
 * @property {string | null} transactionID - the successful transaction ID or null if the transfer was ultimately
 * unsuccessful.
 */
interface IResult {
  nonce: number;
  transactionID: string | null;
}

export default IResult;
