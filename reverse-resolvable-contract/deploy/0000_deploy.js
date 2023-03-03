module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments
  const { deployer } = await getNamedAccounts()
  const registryAddress = process.env.CONTRACT_REGISTRY_ADDRESS

  await deploy('ReverseResolvableContract', {
    from: deployer,
    log: true,
    args: [registryAddress]
  })

  await deploy('ReverseResolverAuthenticator', {
    from: deployer,
    log: true,
    args: []
  })
}
module.exports.tags = ['Deploy']

