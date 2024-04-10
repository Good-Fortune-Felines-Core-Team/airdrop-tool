import BN from "bn.js";
import "dotenv/config";
import inquirer from "inquirer";
import { Account, Contract, Near } from "near-api-js";
import { PublicKey } from "near-api-js/lib/utils";
import { appendFile, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { ERROR_DIRECTORY, FINISHED_DIRECTORY } from "@app/constants";
import type { AccessKeyResponse, Configuration, TokenContract } from "@app/types";
import { createNearConnection, isAccountValid, parseConfiguration, transferToAccount } from "@app/utils";


(async () => {
  const date: Date = new Date()
  let account: Account;
  let accountsFile: string;
  let accessKey: AccessKeyResponse;
  let configuration: Configuration;
  let nearConnection: Near;
  let nonce: number;
  let accounts: Record<string, string>;
  let completedAccounts: Record<string, string>;
  let contract: TokenContract;
  let nekoAmount: BN;
  let pwd: string;
  let signerPublicKey: PublicKey;

  configuration = parseConfiguration();
  nearConnection = await createNearConnection(configuration);

  const { accountId } = await inquirer.prompt<Record<'accountId', string>>([{
    message: "Enter account ID used for shooting tokens:",
    name: "accountId",
    type: "input",
  }]);
  const { contractId } = await inquirer.prompt<Record<'contractId', string>>([{
    message: "Enter the address of the token:",
    name: "contractId",
    type: "input",
  }]);
  const { listName } = await inquirer.prompt<Record<'listName', string>>([{
    message: "Enter the name of the JSON file that contains the list of receiver accounts:",
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
      message: `Start shooting tokens to the list [ ${listName} ]?`,
			name: "confirm",
      type: "confirm",
		},
	]);

  if (!confirm) {
    console.log("Okay Bye!");

    return;
  }

  // TODO: handle errors
  account = await nearConnection.account(accountId);
  signerPublicKey = await account.connection.signer.getPublicKey(
    accountId,
    configuration.networkId,
  );
  accessKey = await account.connection.provider.query<AccessKeyResponse>(
    `access_key/${account.accountId}/${signerPublicKey.toString()}`,
    ""
  );
  contract = new Contract(account, contractId, {
    viewMethods: ["ft_balance_of", "storage_balance_of"],
    changeMethods: ["ft_transfer", "storage_deposit"],
  }) as TokenContract;

	nekoAmount = new BN(amount);

	console.log("NEKO AMOUNT:", nekoAmount.toString());

  pwd = dirname(fileURLToPath(import.meta.url));

  // attempt to get the contents of the file
  try {
    accountsFile = await readFile(
      join(pwd, "..", "data", `${listName}.json`),
      "utf-8"
    );
  } catch (error) {
    console.error(`List does not exist at ${join(pwd, "..", "data", `${listName}.json`)}`);

    return;
  }

  accounts = JSON.parse(accountsFile);
  completedAccounts = {};
  nonce = ++accessKey.nonce;

  for (let index = 0; index < Object.entries(accounts).length; index++) {
    const [receiverAccountId, receiverHoldAmount] = Object.entries(accounts)[index];
    const holdAmount = new BN(receiverHoldAmount);
    const transferAmount = holdAmount.mul(nekoAmount);
    let success: boolean;

    console.log("Transfer Amount:", transferAmount.toString());

    // if the account id is not valid, log the invalid account and move on
    if (!(await isAccountValid(receiverAccountId, { nearConnection }))) {
      console.error(`Invalid receiver account ID ${receiverAccountId}`);

      await appendFile(
        join(pwd, "..", ERROR_DIRECTORY, `${date.getTime()}-${listName}.txt`),
        `${receiverAccountId}:${transferAmount.toString()}\r\n`
      );

      console.log(
        `==========================Transfer failed for ${receiverAccountId}==============================`
      );

      continue;
    }

    console.log("Valid receiver account Id: ", receiverAccountId);

    success = await transferToAccount(receiverAccountId, {
      amount: transferAmount,
      blockHash: accessKey.block_hash,
      contract,
      nearConnection,
      nonce,
      signerPublicKey,
      signerAccount: account,
    });

    // if the transfer was unsuccessful, log the error account
    if (!success) {
      await appendFile(
        join(pwd, "..", ERROR_DIRECTORY, `${date.getTime()}-${listName}.txt`),
        `${receiverAccountId}:${transferAmount.toString()}\r\n`
      );

      console.log(
        `==========================Transfer failed for ${receiverAccountId}==============================`
      );

      continue;
    }

    completedAccounts[receiverAccountId] = holdAmount.toString();
    nonce++;

    console.log(
      `==========================Transfer complete for ${receiverAccountId}==============================`
    );
  }

  await writeFile(
    join(pwd, "..", FINISHED_DIRECTORY, `${listName}.json`),
    JSON.stringify(completedAccounts),
  );

  console.log("✔️✔️✔️✔️✔️✔️✔️✔️✔️DONE✔️✔️✔️✔️✔️✔️✔️✔️✔️");
})();
