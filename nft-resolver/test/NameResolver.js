const { expect } = require('chai')
const ethers = hre.ethers
const circom = require('circomlibjs')
const contracts = {}
let signers
let avvy

describe("NameResolver", () => {
  beforeEach(async () => {
    const _AVVY = await import('@avvy/client')
    const AVVY = _AVVY.default
    signers = await ethers.getSigners()
    avvy = new AVVY(ethers.provider)
    inputs = {
      'a_hash': await avvy.utils.nameHash('one.nftproject.avax'),
      'a_sigs': await avvy.utils.encodeNameHashInputSignals('one.nftproject.avax'),
      'b_hash': await avvy.utils.nameHash('two.nftproject.avax'),
      'b_sigs': await avvy.utils.encodeNameHashInputSignals('two.nftproject.avax'),
    }

    /* 
      These are mock contracts for testing.

      On mainnet, these contracts already exist & the
      official Avvy Domains ones need to be used.
    */
    const ContractRegistry = await ethers.getContractFactory('ContractRegistryV1')
    contracts.registry = await ContractRegistry.deploy(signers[0].address)
    await contracts.registry.deployed()
    await contracts.registry.grantRole(ethers.utils.keccak256(ethers.utils.toUtf8Bytes('MANAGER')), signers[0].address)

    const poseidonDeployTx = await signers[0].sendTransaction({
      data: circom.poseidonContract.createCode(3)
    })
    const poseidonDeployReceipt = await poseidonDeployTx.wait()
    await contracts.registry.set('Poseidon', poseidonDeployReceipt.contractAddress)

    const RainbowTable = await ethers.getContractFactory('RainbowTableV1')
    contracts.rainbowTable = await RainbowTable.deploy(contracts.registry.address)
    await contracts.rainbowTable.deployed()
    await contracts.registry.set('RainbowTable', contracts.rainbowTable.address)

    const ReverseResolverRegistry = await ethers.getContractFactory('ReverseResolverRegistryV1')
    contracts.reverseResolverRegistry = await ReverseResolverRegistry.deploy(contracts.registry.address)
    await contracts.registry.set('ReverseResolverRegistry', contracts.reverseResolverRegistry.address)
    /*
      End Avvy mock contracts
    */

    const NFT = await ethers.getContractFactory('NFT')
    contracts.nft = await NFT.deploy('nft', 'nft')
    await contracts.nft.deployed()

    const NameResolver = await ethers.getContractFactory('NameResolver')
    contracts.nameResolver = await NameResolver.deploy(contracts.nft.address, contracts.registry.address)
    await contracts.nameResolver.deployed()
  })

  describe('claimName', () => {
    it('should fail if user does not hold nft', async () => {
      await expect(contracts.nameResolver.claimName(inputs.a_sigs, inputs.a_hash)).to.be.reverted
    })

    it('should succeed if user holds nft', async () => {
      await contracts.nft.mint()
      await contracts.nameResolver.claimName(inputs.a_sigs, inputs.a_hash)
    })

    it('should allow user to claim a different name', async () => {
      await contracts.nft.mint()
      await contracts.nameResolver.claimName(inputs.a_sigs, inputs.a_hash)
      await contracts.nameResolver.claimName(inputs.b_sigs, inputs.b_hash)
    })

    it('should fail if user tries to claim a name that another user holds', async () => {
      await contracts.nft.mint()
      await contracts.nft.connect(signers[1]).mint()
      await contracts.nameResolver.claimName(inputs.a_sigs, inputs.a_hash)
      await expect(contracts.nameResolver.connect(signers[1]).claimName(inputs.a_sigs, inputs.a_hash)).to.be.reverted
    })

    it('should emit the correct event when a name is registered', async () => {
      await contracts.nft.mint()
      const tx = await contracts.nameResolver.claimName(inputs.a_sigs, inputs.a_hash)
      const receipt = await tx.wait()
      expect(receipt.events.length).to.equal(2)
      const e = receipt.events[1]
      expect(e.event).to.equal('StandardEntrySet')
      const args = e.args
      expect(args.datasetId).to.equal(0)
      expect(args.hash.toString()).to.equal(inputs.a_hash.toString())
      expect(args.path.length).to.equal(0)
      expect(args.key).to.equal(3)
      expect(args.data).to.equal(signers[0].address.toLowerCase())
    })

    it('should emit a clear event when a name is changed', async () => {
      await contracts.nft.mint()
      await contracts.nameResolver.claimName(inputs.b_sigs, inputs.b_hash)
      const tx = await contracts.nameResolver.claimName(inputs.a_sigs, inputs.a_hash)
      const receipt = await tx.wait()
      expect(receipt.events.length).to.equal(3)
      const e = receipt.events[1]
      expect(e.event).to.equal('StandardEntrySet')
      const args = e.args
      expect(args.datasetId).to.equal(0)
      expect(args.hash.toString()).to.equal(inputs.b_hash.toString())
      expect(args.path.length).to.equal(0)
      expect(args.key).to.equal(3)
      expect(args.data).to.equal('')
    })
  })

  describe('resolveStandard', () => {
    it('should fail if name is not found', async () => {
      const output = await contracts.nameResolver.resolveStandard(1, inputs.a_hash, 3)
      expect(output).to.equal('')
    })

    it('should function if user holds nft', async () => {
      await contracts.nft.mint()
      await contracts.nameResolver.claimName(inputs.a_sigs, inputs.a_hash)
      const resolved = await contracts.nameResolver.resolveStandard(1, inputs.a_hash, 3)
      await expect(resolved).to.equal(signers[0].address.toLowerCase())
    })

    it('should fail if user has transferred nft to another', async () => {
      await contracts.nft.mint()
      await contracts.nameResolver.claimName(inputs.a_sigs, inputs.a_hash)
      await contracts.nft['safeTransferFrom(address,address,uint256)'](signers[0].address, signers[1].address, 1)
      await expect(contracts.nameResolver.resolveStandard(1, inputs.a_hash, 3)).to.be.reverted
    })
  })

  describe('canWrite', () => {
    it('should succeed if user owns nft and has claimed name', async () => {
      await contracts.nft.mint()
      await contracts.nameResolver.claimName(inputs.a_sigs, inputs.a_hash)
    })

    it('should fail if user does not own nft', async () => {
      await expect(contracts.nameResolver.claimName(inputs.a_sigs, inputs.a_hash)).to.be.reverted
    })
  })
})
