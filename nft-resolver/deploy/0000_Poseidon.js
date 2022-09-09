const circom = require('circomlibjs')

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments
  const { deployer } = await getNamedAccounts()

  await deploy('Poseidon', {
    from: deployer,
    log: true,
    contract: {
      abi: circom.poseidonContract.generateABI(3),
      bytecode: circom.poseidonContract.createCode(3)
    }
  })
}
module.exports.tags = ['Local']
