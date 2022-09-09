module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments
  const { deployer } = await getNamedAccounts()

  await deploy('ContractRegistryV1', {
    from: deployer,
    log: true,
    args: [deployer]
  })
}
module.exports.tags = ['Mock']
