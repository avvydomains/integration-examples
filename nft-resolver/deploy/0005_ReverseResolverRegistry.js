module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments
  const { deployer } = await getNamedAccounts()
  const nameResolver = await deployments.get('NameResolver')

  await deploy('ReverseResolverRegistryV1Mock', {
    from: deployer,
    log: true,
    args: [nameResolver.address]
  })
}
module.exports.tags = ['Mock']
