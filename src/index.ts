import BN from "bn.js";
import "dotenv/config";
import inquirer from "inquirer";
import { Account, connect, Contract, keyStores } from "near-api-js";
import { PublicKey } from "near-api-js/lib/utils";
import { appendFile, readFile, writeFile } from 'node:fs/promises';
import os from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { CREDENTIALS_DIRECTORY, ERROR_DIRECTORY, FINISHED_DIRECTORY } from "@app/constants";
import type { AccessKeyResponse, TokenContract } from "@app/types";
import { isAccountValid, transferToAccount } from "@app/utils";

(async () => {
  const contractId = "jumptoken.jumpfinance.near";
  const credentialsPath = join(os.homedir(), CREDENTIALS_DIRECTORY);
	const nearConnection = await connect({
    networkId: "mainnet",
    keyStore: new keyStores.UnencryptedFileSystemKeyStore(credentialsPath), // first create a key store
    nodeUrl: "https://rpc.mainnet.near.org",
    walletUrl: "https://wallet.mainnet.near.org",
    helperUrl: "https://helper.mainnet.near.org",
    explorerUrl: "https://explorer.mainnet.near.org",
  });
  let account: Account;
  let accountsFile: string;
  let accessKey: AccessKeyResponse;
  let nonce: number;
  let accounts: Record<string, string>;
  let completedAccounts: Record<string, string>;
  let contract: TokenContract;
  let nekoAmount: BN;
  let pwd: string;
  let signerPublicKey: PublicKey;

  const { accountId } = await inquirer.prompt<Record<'accountId', string>>([{
    message: "Enter Account Id used for shooting Token:",
    name: "accountId",
    type: "input",
  }]);

  account = await nearConnection.account(accountId);
  signerPublicKey = await account.connection.signer.getPublicKey(
		accountId,
		"mainnet"
	);
  contract = new Contract(account, contractId, {
		viewMethods: ["ft_balance_of", "storage_balance_of"],
		changeMethods: ["ft_transfer", "storage_deposit"],
	}) as TokenContract;

	const { listName } = await inquirer.prompt<Record<'listName', string>>([{
    message: "Enter the json file name:",
    name: "listName",
    type: "input",
  }]);
	const { amount } = await inquirer.prompt<Record<'amount', string>>([{
    message: "Enter the amount of TOKEN per NFT to shoot:",
    name: "amount",
    type: "input",
  }]);
	const { confirm } = await inquirer.prompt<Record<'confirm', boolean>>([
		{
      message: `Start Shooting Token to the list [ ${listName} ]?`,
			name: "confirm",
      type: "confirm",
		},
	]);

  if (!confirm) {
    console.log("Okay Bye");

    return;
  }

	nekoAmount = new BN(amount);

	console.log("NEKO AMOUNT:", nekoAmount.toString());

  pwd = dirname(fileURLToPath(import.meta.url));
  accountsFile = await readFile(
    join(pwd, "..", "data", `${listName}.json`),
    "utf-8"
  );

  accounts = JSON.parse(accountsFile);
  accessKey = await account.connection.provider.query<AccessKeyResponse>(
    `access_key/${account.accountId}/${signerPublicKey.toString()}`,
    ""
  );
  completedAccounts = {};
  nonce = ++accessKey.nonce;

  for (let index = 0; index < Object.entries(accounts).length; index++) {
    const [receiverAccountId, amount] = Object.entries(accounts)[index];
    const holdAmount = new BN(amount);
    const transferAmount = holdAmount.mul(nekoAmount);
    let success: boolean;

    console.log("Transfer Amount:", transferAmount.toString());

    // if the account id is not valid, log the invalid account and move on
    if (!(await isAccountValid(receiverAccountId, { nearConnection }))) {
      console.log("Invalid receiver account Id:", receiverAccountId);

      await appendFile(
        join(pwd, "..", ERROR_DIRECTORY, `${listName}.txt`),
        `${receiverAccountId}:${transferAmount.toString()}\r\n`
      );

      continue;
    }

    console.log("Valid receiver account Id: ", receiverAccountId);

    success = await transferToAccount(receiverAccountId, {
      blockHash: accessKey.block_hash,
      contract,
      holdAmount,
      nonce,
      nekoAmount,
      signerPublicKey,
      signerAccount: account,
    });

    // if the transfer was unsuccessful, log the error account
    if (!success) {
      await appendFile(
        join(pwd, "..", ERROR_DIRECTORY, `${listName}.txt`),
        `${receiverAccountId}:${transferAmount.toString()}\r\n`
      );

      continue;
    }

    completedAccounts[receiverAccountId] = holdAmount.toString();

    console.log(
      "==========================Partially Done=============================="
    );
  }

  await writeFile(
    join(pwd, "..", FINISHED_DIRECTORY, `${listName}.json`),
    JSON.stringify(completedAccounts),
  );

  console.log("✔️✔️✔️✔️✔️✔️✔️✔️✔️DONE✔️✔️✔️✔️✔️✔️✔️✔️✔️");
})();
