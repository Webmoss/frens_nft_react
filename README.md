# Frens Sui NFT Mint

The Frens NFT Mint was created for the ThinkSui: Builders and Content Creators contest. For more information [visit](https://twitter.com/ThinkSui/status/1755260232413188333?s=20)

The Frens mint features some fun handdrawn art by [LOR3LORD](https://twitter.com/LOR3LORD) and the dApp was developed by [WebMoss](https://twitter.com/WebMoss).

The base dApp was created using the `@mysten/create-dapp` kit which sets up a basic React
Client dApp that communicates with your Sui Wallet.

A Move package was developed for the Frens mint which allows for dynamic fields, the description, trait and url of the NFTs can be updated via the Smart Contract. A one time witness is used to estalish the Publisher of the collection.

The NFT smart contract utilises the Sui Object Display standard which is a template engine that enables on-chain management of off-chain representation (display) for a type. [More info](https://docs.sui.io/standards/display)

This project was my first attempt at working with Sui, Move and React.js so includes a very simple frontend that integrates with the Sui Network. All in all it was a fun learning experience and I look forward to exploring Sui more in the future.

ARTWORK
All artwork is stored on IPFS via Pinata and was created by [LOR3LORD](https://twitter.com/LOR3LORD).

Regards WebMoss

## Deploying the Project

If you would like to install the application please follow the directions below. To view the published Move contracts for the Frens mint visit constants.ts

### Install Sui cli

Before deploying your move code, ensure that you have installed the Sui CLI. You
can follow the [Sui installation instruction](https://docs.sui.io/build/install)
to get everything set up.

This template uses `devnet` by default, so we'll need to set up a devnet
environment in the CLI:

```bash
sui client new-env --alias devnet --rpc https://fullnode.devnet.sui.io:443
sui client switch --env devnet
```

If you haven't set up an address in the sui client yet, you can use the
following command to get a new address:

```bash
sui client new-address secp256k1
```

This well generate a new address and recover phrase for you. You can mark a
newly created address as you active address by running the following command
with your new address:

```bash
sui client switch --address 0xYOUR_ADDRESS...
```

We can ensure we have some Sui in our new wallet by requesting Sui from the
faucet (make sure to replace the address with your address):

```bash
curl --location --request POST 'https://faucet.devnet.sui.io/gas' \
--header 'Content-Type: application/json' \
--data-raw '{
    "FixedAmountRequest": {
        "recipient": "<YOUR_ADDRESS>"
    }
}'
```

### Publishing the move package

The move code for this template is located in the `move` directory. To publish
it, you can enter the `move` directory, and publish it with the Sui CLI:

```bash
cd move
sui client publish --gas-budget 100000000 counter
```

In the output there will be an object with a `"packageId"` property. You'll want
to save that package ID to the `src/constants.ts` file as `PACKAGE_ID`:

```ts
export const DEVNET_COUNTER_PACKAGE_ID = "<YOUR_PACKAGE_ID>";
```

Now that we have published the move code, and update the package ID, we can
start the app.

## Starting your dApp

To install dependencies you can run

```bash
pnpm install
```

To start your dApp in development mode run

```bash
pnpm dev
```

## Building

To build your app for deployment you can run

```bash
pnpm build
```
