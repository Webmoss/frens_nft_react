import { getFullnodeUrl } from "@mysten/sui.js/client";
import {
  DEVNET_MINTER_PACKAGE_ID,
  TESTNET_MINTER_PACKAGE_ID,
  MAINNET_MINTER_PACKAGE_ID
} from "./constants.ts";
import { createNetworkConfig } from "@mysten/dapp-kit";

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    devnet: {
      url: getFullnodeUrl("devnet"),
      variables: {
        minterPackageId: DEVNET_MINTER_PACKAGE_ID,
      },
    },
    testnet: {
      url: getFullnodeUrl("testnet"),
      variables: {
        minterPackageId: TESTNET_MINTER_PACKAGE_ID,
      },
    },
    mainnet: {
      url: getFullnodeUrl("mainnet"),
      variables: {
        minterPackageId: MAINNET_MINTER_PACKAGE_ID,
      },
    },
  });

export { useNetworkVariable, useNetworkVariables, networkConfig };
