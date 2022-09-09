const hre = require('hardhat')

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments
  const { deployer } = await getNamedAccounts()

  await deploy('NFT', {
    from: deployer,
    log: true,
    args: ['NFTReg', 'NFTReg']
  })
}
module.exports.tags = ['NFT']
