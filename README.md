# airdrop-tool
Airdrop tool for nep-141 tokens designed to shoot a number of tokens to an NFT whitelist (or any list) with the baility to shoot multiple allocations to specific addresses.

1. Install Visual studio

- https://code.visualstudio.com/ 

2. Install Near CLI

- Run npm install -g near-cli

3. Make sure you are on mainnet

- Run the Export to mainnet command
- Windows: Run  set NEAR_NETWORK=mainnet
- Mac: Run export NEAR_ENV=mainnet

4. Log into the Near wallet you will wish to airdrop tokens from to store private key on computer (this allows you to run calls, make sure you understand security risks). 

- Make sure you have the token you wish to send on this account.

- Run **near login** 

- Run **near login --walletUrl https://app.mynearwallet.com/**

- Can login with meteor wallet if you prefer

- Run **near login --walletUrl https://wallet.meteorwallet.app/**  

5. Download the zip from this github repository and unzip.

- Select the airdrop-tool-windows folder for windows or the airdrop-tool-mac folder for Mac then place it in a location you can easily navigate to.

6. To change token that the airdrop tool sends, navigate to:

- airdrop-tool>Src

- Open the index.ts file with vscode.

- Go to line 58 and input token address of the token you wish to send (it's set to JUMP token currently)

7. Create a new text file to compose the list the tool will airdrop tokens to and, place into data folder.

- Make sure the parsing of the list is named appropriately, and looks like this:

- {"test.near":1,"test2.near":1}

- The 1 denotes how many airdrops they get, if you put 2 and in the token amount later, it will send them 2 X TOKEN AMOUNT

- When you run the name of the list, it will move to the finished folder, send to all addresses and record errors in the error folder.

- List needs to be less than 500-1000 names. It could possibly error if transaction is too big.

8. Cd into airdrop-tool or airdrop-tool-mac folder we just unzipped (put in desktop for easy access)

- **cd desktop** (cd .. to go back)

- **cd airdrop-tool-mac** (or whatever the folder name is)

9. Once successfully navigated to folder, run the following code into terminal to download node modules, and start the script which deploys token and sets the meta data:

- Run **npm install**

- Then

- Run **npm run dev**

10. Follow the prompts, when you enter the token amount, MAKE SURE YOU USE PROPER DECIMAL AMOUNTS

- If JUMP token has 18 decimals, then 1 Jump is inputted as 1000000000000000000

- This rule applies for whatever token you are using as long as you use correct decimals for that token

NOTE: MAKE SURE TOKENS ARE ENTERED CORRECTLY.
