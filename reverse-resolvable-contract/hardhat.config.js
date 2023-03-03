require("@nomicfoundation/hardhat-toolbox");
require('hardhat-deploy')

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  namedAccounts: {
    deployer: 0
  },
  networks: {
    fuji: {
      url: 'https://api.avax-test.network/ext/bc/C/rpc',
      chainId: 43113,
      accounts: [
        process.env.DEVELOPER_PRIVATE_KEY
      ]
    },
    mainnet: {
      url: 'https://api.avax.network/ext/bc/C/rpc',
      chainId: 43114,
      accounts: [
        process.env.DEVELOPER_PRIVATE_KEY
      ]
    }
  }
};
