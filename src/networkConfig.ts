import { getFullnodeUrl } from "@mysten/sui.js/client";
import {
  DEVNET_COUNTER_PACKAGE_ID,
  DEVNET_MINTER_PACKAGE_ID,
  TESTNET_COUNTER_PACKAGE_ID,
  TESTNET_MINTER_PACKAGE_ID,
  MAINNET_COUNTER_PACKAGE_ID,
  MAINNET_MINTER_PACKAGE_ID,
} from "./constants.ts";
import { createNetworkConfig } from "@mysten/dapp-kit";

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    devnet: {
      url: getFullnodeUrl("devnet"),
      variables: {
        counterPackageId: DEVNET_COUNTER_PACKAGE_ID,
        minterPackageId: DEVNET_MINTER_PACKAGE_ID,
      },
    },
    testnet: {
      url: getFullnodeUrl("testnet"),
      variables: {
        counterPackageId: TESTNET_COUNTER_PACKAGE_ID,
        minterPackageId: TESTNET_MINTER_PACKAGE_ID,
      },
    },
    mainnet: {
      url: getFullnodeUrl("mainnet"),
      variables: {
        counterPackageId: MAINNET_COUNTER_PACKAGE_ID,
        minterPackageId: MAINNET_MINTER_PACKAGE_ID,
      },
    },
  });

export { useNetworkVariable, useNetworkVariables, networkConfig };
