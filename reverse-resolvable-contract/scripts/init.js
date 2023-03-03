// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const AVVY = require('@avvy/client/index.cjs')

async function main() {

  // only execute this on mainnet
  const name = process.env.DOMAIN_NAME
  const avvy = new AVVY(hre.ethers.provider)
  const signers = await hre.ethers.getSigners()
  const DOMAIN_HASH = await avvy.utils.nameHash(name)
  const ReverseResolvableContract = await hre.ethers.getContractFactory('ReverseResolvableContract')
  const ReverseResolverAuthenticator = await hre.ethers.getContractFactory('ReverseResolverAuthenticator')
  const reverseResolvableContract = await ReverseResolvableContract.attach(process.env.REVERSE_RESOLVABLE_CONTRACT)
  const reverseAuthenticator = await ReverseResolvableContract.attach(process.env.REVERSE_RESOLVER_AUTHENTICATOR)

  await avvy.contracts.ReverseResolverRegistryV1.connect(signers[0]).setAuthenticator(DOMAIN_HASH, reverseAuthenticator.address)
  await reverseResolvableContract.connect(signers[0]).setEVMReverse(DOMAIN_HASH, [])
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
