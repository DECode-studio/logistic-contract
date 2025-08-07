import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  paths: {
    sources: "./src/contracts",
    tests: "./src/test",
    cache: "./src/cache",
    artifacts: "./src/artifacts"
  },
  mocha: {
    timeout: 40000
  },
  networks: {
    hardhat: {},
    // ethereum_sepolia: {
    //   url: process.env.RPC_ETH_SEPOLIA_URL ?? "",
    //   accounts: [process.env.PRIVATE_KEY ?? ""]
    // },
    // optimism_sepolia: {
    //   url: process.env.RPC_OP_SEPOLIA_URL ?? "",
    //   accounts: [process.env.PRIVATE_KEY ?? ""]
    // },
  }
};

export default config;
