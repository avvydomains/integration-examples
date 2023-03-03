const { expect } = require("chai");
const AVVY = require('@avvy/client/index.cjs')
const hre = require('hardhat')
const ethers = hre.ethers

const DOMAIN_HASH = process.env.DOMAIN_HASH
const CONTRACT_REGISTRY_ADDRESS = process.env.CONTRACT_REGISTRY_ADDRESS

describe("Reverse", function () {
  let provider
  let avvy
  let contracts
  let signers

  // these tests rely on you already having deployed a local instance of the Avvy contracts.
  // you also need to set environment variables for the contract addresses.
  // 
  // we also expect a domain to be minted to this address.
  // you can set this up by running `npx hardhat run --network localhost scripts/init-reverse-resolvable-contracts-testing.js`
  // on the main avvy contracts repo.

  beforeEach(async () => {
    provider = new ethers.providers.JsonRpcProvider('http://localhost:8545')
    avvy = new AVVY(provider)
    signers = await ethers.getSigners()
    const _contracts = avvy.contracts
    const contractRegistry = _contracts.ContractRegistryV1.attach(CONTRACT_REGISTRY_ADDRESS)
    const REVERSE_RESOLVER_REGISTRY_ADDRESS = await contractRegistry.get('ReverseResolverRegistry')
    const ReverseResolvableContract = await ethers.getContractFactory('ReverseResolvableContract')
    const ReverseResolverAuthenticator = await ethers.getContractFactory('ReverseResolverAuthenticator')
    const reverseResolverRegistry = _contracts.ReverseResolverRegistryV1.attach(REVERSE_RESOLVER_REGISTRY_ADDRESS)
    const EVM_REVERSE_RESOLVER_ADDRESS = await reverseResolverRegistry.getResolver(3)

    contracts = {
      reverseResolverRegistry,
      evmReverseResolver: _contracts.EVMReverseResolverV1.attach(EVM_REVERSE_RESOLVER_ADDRESS),
      authenticator: await ReverseResolverAuthenticator.deploy(),
      reverseResolvableContract: await ReverseResolvableContract.deploy(CONTRACT_REGISTRY_ADDRESS),
    }
    await contracts.authenticator.deployed()
    await contracts.reverseResolvableContract.deployed()
  })

  it('should allow contract to set reverse', async () => {
    await contracts.reverseResolverRegistry.connect(signers[0]).setAuthenticator(DOMAIN_HASH, contracts.authenticator.address)
    await contracts.reverseResolvableContract.connect(signers[0]).setEVMReverse(DOMAIN_HASH, [])
    const result = await contracts.evmReverseResolver.get(contracts.reverseResolvableContract.address)
    expect(result[0]).to.equal(DOMAIN_HASH)
    expect(result[1]).to.equal(DOMAIN_HASH)
  })
});
