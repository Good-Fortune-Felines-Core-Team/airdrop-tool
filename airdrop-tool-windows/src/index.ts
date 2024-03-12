import { connect, Contract, keyStores, utils, transactions } from "near-api-js";
import inquirer from "inquirer";
import fs from "fs/promises";
import { join } from "path";
import os from "os";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import BN from "bn.js";
const homedir = os.homedir();
const CREDENTIALS_DIR = ".near-credentials";
const credentialsPath = join(homedir, CREDENTIALS_DIR);
const myKeyStore = new keyStores.UnencryptedFileSystemKeyStore(credentialsPath);
type TokenMethod = {
	ft_balance_of: (args: { account_id: string }) => Promise<string>;
	storage_balance_of: (args: { account_id: string }) => Promise<any>;
	ft_transfer: (args: {
		args: { receiver_id: string; amount: string };
		amount: string;
	}) => Promise<void>;
	storage_deposit: (args: {
		args: { account_id: string; registration_only: boolean };
		amount: string;
	}) => Promise<string>;
};

type TokenContract = Contract & TokenMethod;
const accountIdQuestion = {
	type: "input",
	name: "accountId",
	message: "Enter Account Id used for shooting Token:",
};

const listNameQuestion = {
	type: "input",
	name: "listName",
	message: "Enter the json file name:",
};

const NekoAmountQuestion = {
	type: "input",
	name: "amount",
	message: "Enter the amount of TOKEN per NFT to shoot:",
};

const connectionConfig = {
	networkId: "mainnet",
	keyStore: myKeyStore, // first create a key store
	nodeUrl: "https://rpc.mainnet.near.org",
	walletUrl: "https://wallet.mainnet.near.org",
	helperUrl: "https://helper.mainnet.near.org",
	explorerUrl: "https://explorer.mainnet.near.org",
};
(async () => {
	const nearConnection = await connect(connectionConfig);
	const accountId = (await inquirer.prompt([accountIdQuestion])).accountId;
	const account = await nearConnection.account(accountId);
	const contractId = "ftv2.nekotoken.near";
	const signerPubKey = await account.connection.signer.getPublicKey(
		accountId,
		"mainnet"
	);

	const contract = new Contract(account, contractId, {
		viewMethods: ["ft_balance_of", "storage_balance_of"],
		changeMethods: ["ft_transfer", "storage_deposit"],
	}) as TokenContract;
	const listName = (await inquirer.prompt([listNameQuestion])).listName;

	const nekoAmount = (await inquirer.prompt([NekoAmountQuestion])).amount;
	const confirmFile = await inquirer.prompt([
		{
			type: "confirm",
			name: "confirm",
			message: `Start Shooting Token to the list [ ${listName} ]?`,
		},
	]);
	runMain();

	const nekoAmountBig = new BN(nekoAmount);

	console.log("NEKO AMOUNT:", nekoAmountBig.toString());

	async function runMain() {
		if (!confirmFile.confirm) {
			console.log("Okay Bye");
			return;
		}
		await new Promise((resolve) => setTimeout(resolve, 500));
		const listFile = await fs.readFile(
			join(__dirname, "..", "data", listName + ".json"),
			"utf-8"
		);
		const list: List = JSON.parse(listFile);
		let promiseArray: Promise<void>[] = [];
		const accessKey: any = await account.connection.provider.query(
			`access_key/${accountId}/${signerPubKey.toString()}`,
			""
		);

		let nonce = ++accessKey.nonce;
		let index = 1;
		for (const data of Object.entries(list)) {
			const promiseNonce = nonce + index;
			const promise = new Promise<void>(async (resolve) => {
				const id = data[0];
				const holdAmount = new BN(data[1]);
				const transferAmount = holdAmount.mul(nekoAmountBig);
				console.log("Transfer Amount:", transferAmount.toString());
				try {
					let isAccountValid = false;
					//validate account Id first
					const accountData = await nearConnection.connection.provider
						.query(`account/${id}`, "")
						.catch(async (_accountError) => {
							console.log("Invalid account Id:", id);
							await fs.appendFile(
								join(__dirname, "..", "error", listName + ".txt"),
								`${id}:${transferAmount.toString()}\r\n`
							);
							delete list[id];
							await fs.writeFile(
								join(__dirname, "..", "data", listName + ".json"),
								JSON.stringify(list)
							);
						});

					if (!accountData) {
						resolve();
						return;
					}
					console.log("Valid account Id:", id);
					console.log("Checking Storage Balance....");
					const storageBalance = await contract.storage_balance_of({
						account_id: id,
					});
					let actions: any = [];
					if (!storageBalance) {
						console.log("Registering Storage", id);
						actions.push(
							transactions.functionCall(
								"storage_deposit",
								{
									account_id: id,
									registration_only: true,
								},
								new BN("30000000000000"),
								new BN(utils.format.parseNearAmount("0.00125")!)
							)
						);
					}

					actions.push(
						transactions.functionCall(
							"ft_transfer",
							{
								receiver_id: id,
								amount: transferAmount.toString(),
							},
							new BN("30000000000000"),
							new BN("1")
						)
					);

					const recentBlockHash = utils.serialize.base_decode(
						accessKey.block_hash
					);
					const transaction = transactions.createTransaction(
						accountId,
						signerPubKey,
						contractId,
						promiseNonce,
						actions,
						recentBlockHash
					);
					console.log("Transferring to ", id);
					const signedTransaction = await transactions.signTransaction(
						transaction,
						account.connection.signer,
						accountId,
						"mainnet"
					);
					await account.connection.provider.sendTransaction(
						signedTransaction[1]
					);
					//remove wallet from list
					delete list[id];
					await fs.writeFile(
						join(__dirname, "..", "data", listName + ".json"),
						JSON.stringify(list)
					);

					resolve();
				} catch (e) {
					console.log("Retrying Transfer to ", id);
					resolve();
				}
			});
			index++;
			promiseArray.push(promise);
		}

		await Promise.all(promiseArray);
		//move file to finished folder
		if (Object.keys(list).length === 0) {
			await fs.rename(
				join(__dirname, "..", "data", listName + ".json"),
				join(__dirname, "..", "finished", listName + ".json")
			);
			console.log("✔️✔️✔️✔️✔️✔️✔️✔️✔️DONE✔️✔️✔️✔️✔️✔️✔️✔️✔️");
		} else {
			console.log(
				"==========================Partially Done=============================="
			);
			runMain();
		}
	}
})();
type List = {
	[walletId: string]: number;
};
