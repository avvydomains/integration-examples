const hre = require("hardhat");
const ethers = hre.ethers

async function main() {
  const signers = await ethers.getSigners()
  
  // fund dev wallet
  await signers[9].sendTransaction({ to: process.env.DEVELOPER_PUBLIC_KEY, value: ethers.utils.parseEther('2000.0') })

  // configure mock contracts
  const registry = await ethers.getContract('ContractRegistryV1')
  const rainbowTable = await ethers.getContract('RainbowTableV1')
  const reverseResolverRegistry = await ethers.getContract('ReverseResolverRegistryV1Mock')
  const evmReverseResolver = await ethers.getContract('EVMReverseResolverV1')
  const poseidon = await ethers.getContract('Poseidon')
  await registry.grantRole(ethers.utils.keccak256(ethers.utils.toUtf8Bytes('MANAGER')), signers[0].address)
  await registry.set('Poseidon', poseidon.address)
  await registry.set('RainbowTable', rainbowTable.address)
  await registry.set('ReverseResolverRegistry', reverseResolverRegistry.address)
  await registry.set('EVMReverseResolver', evmReverseResolver.address)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
