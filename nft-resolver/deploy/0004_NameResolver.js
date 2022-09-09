const hre = require('hardhat')

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments
  const { deployer } = await getNamedAccounts()
  const _AVVY = await import('@avvy/client')
  const AVVY = _AVVY.default

  let nftAddress, registryAddress

  if (hre.network.config.chainId === 43114) {
    let avvy = new AVVY(hre.ethers.provider)
    nftAddress = process.env.NFT_CONTRACT_ADDRESS
    if (!nftAddress) throw "Set NFT_CONTRACT_ADDRESS environment variable."
    registryAddress = avvy.contracts.ContractRegistryV1.address
  } else {
    let nft = await deployments.get('NFT')
    let registry = await deployments.get('ContractRegistryV1')
    nftAddress = nft.address
    registryAddress = registry.address
  }

  await deploy('NameResolver', {
    from: deployer,
    log: true,
    args: [nftAddress, registryAddress]
  })
}
module.exports.tags = ['NameResolver']
