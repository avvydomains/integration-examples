const hre = require("hardhat");
const ethers = hre.ethers

async function main() {
  const signers = await ethers.getSigners()
  
  // fund dev wallet
  /*
  await signers[9].sendTransaction({ to: process.env.DEVELOPER_PUBLIC_KEY, value: ethers.utils.parseEther('2000.0') })
  */

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

    /* 
      These are mock contracts for testing.

      On mainnet, these contracts already exist & the
      official Avvy Domains ones need to be used.
    */
    /*
    const ContractRegistry = await ethers.getContractFactory('ContractRegistryV1')
    contracts.registry = await ContractRegistry.deploy(signers[0].address)
    await contracts.registry.deployed()
    await contracts.registry.grantRole(ethers.utils.keccak256(ethers.utils.toUtf8Bytes('MANAGER')), signers[0].address)

    const poseidonDeployTx = await signers[0].sendTransaction({
      data: circom.poseidonContract.createCode(3)
    })
    const poseidonDeployReceipt = await poseidonDeployTx.wait()
    await contracts.registry.set('Poseidon', poseidonDeployReceipt.contractAddress)

    const RainbowTable = await ethers.getContractFactory('RainbowTableV1')
    contracts.rainbowTable = await RainbowTable.deploy(contracts.registry.address)
    await contracts.rainbowTable.deployed()
    await contracts.registry.set('RainbowTable', contracts.rainbowTable.address)

    const ReverseResolverRegistry = await ethers.getContractFactory('ReverseResolverRegistryV1')
    contracts.reverseResolverRegistry = await ReverseResolverRegistry.deploy(contracts.registry.address)
    await contracts.registry.set('ReverseResolverRegistry', contracts.reverseResolverRegistry.address)
    /*
      End Avvy mock contracts
    */

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
