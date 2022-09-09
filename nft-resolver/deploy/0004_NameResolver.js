module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments
  const { deployer } = await getNamedAccounts()
  const nft = await deployments.get('NFT')
  const registry = await deployments.get('ContractRegistryV1')
  const nftAddress = nft.address
  const registryAddress = registry.address

  await deploy('NameResolver', {
    from: deployer,
    log: true,
    args: [nftAddress, registryAddress]
  })
}
module.exports.tags = ['NameResolver']
