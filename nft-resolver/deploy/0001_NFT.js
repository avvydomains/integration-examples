
module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments
  const { deployer } = await getNamedAccounts()

  await deploy('NFT', {
    from: deployer,
    log: true,
    args: ['AvvyRegistryNFT', 'AvvyRegistryNFT']
  })
}
module.exports.tags = ['NFT']
