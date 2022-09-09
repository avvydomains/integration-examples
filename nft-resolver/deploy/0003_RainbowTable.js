module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments
  const { deployer } = await getNamedAccounts()
  const registry = await deployments.get('ContractRegistryV1')

  await deploy('RainbowTableV1', {
    from: deployer,
    log: true,
    args: [registry.address]
  })
}
module.exports.tags = ['Mock']
