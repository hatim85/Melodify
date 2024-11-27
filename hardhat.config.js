require('@nomiclabs/hardhat-waffle');
require('dotenv').config();

module.exports = {
  // networks: {
  //   hardhat: {
  //     chainId: 1337,
  //   },
  // },
  solidity: '0.8.4',
  networks: {
    // sepolia: {
    //   url: ALCHEMY_API_KEY_URL,
    //   accounts: [privateKey],
    // },
    crossfi: {
      url: `https://crossfi-testnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
      chainId: 4157,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
