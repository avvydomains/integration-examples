module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments
  const { deployer } = await getNamedAccounts()
  const registry = await deployments.get('ContractRegistryV1')
  const registryAddress = registry.address

  await deploy('EVMReverseResolverV1', {
    from: deployer,
    log: true,
    args: [registryAddress]
  })
}
module.exports.tags = ['Mock']
