const { expect } = require('chai')
const ethers = hre.ethers
const contracts = {}
let signers

describe("NameResolver", () => {
  beforeEach(async () => {
    signers = await ethers.getSigners()

    const NFT = await ethers.getContractFactory('NFT')
    contracts.nft = await NFT.deploy('nft', 'nft')
    await contracts.nft.deployed()

    const NameResolver = await ethers.getContractFactory('NameResolver')
    contracts.nameResolver = await NameResolver.deploy(contracts.nft.address)
    await contracts.nameResolver.deployed()
  })

  describe('claimName', () => {
    it('should fail if user does not hold nft', async () => {
      await expect(contracts.nameResolver.claimName(1)).to.be.reverted
    })

    it('should succeed if user holds nft', async () => {
      await contracts.nft.mint()
      await contracts.nameResolver.claimName(1)
    })
  })

  describe('resolveStandard', () => {
    it('should fail if name is not found', async () => {
      const output = await contracts.nameResolver.resolveStandard(1, 1, 3)
      expect(output).to.equal('')
    })

    it('should function if user holds nft', async () => {
      await contracts.nft.mint()
      await contracts.nameResolver.claimName(1)
      const resolved = await contracts.nameResolver.resolveStandard(1, 1, 3)
      await expect(resolved).to.equal(signers[0].address.toLowerCase())
    })

    it('should fail if user has transferred nft to another', async () => {
      await contracts.nft.mint()
      await contracts.nameResolver.claimName(1)
      await contracts.nft['safeTransferFrom(address,address,uint256)'](signers[0].address, signers[1].address, 1)
      await expect(contracts.nameResolver.resolveStandard(1, 1, 3)).to.be.reverted
    })
  })
})
