const hre = require("hardhat");
const ethers = hre.ethers

async function main() {
  const signers = await ethers.getSigners()
  const _AVVY = await import('@avvy/client')
  const AVVY = _AVVY.default
  const avvy = new AVVY(signers[0])
  const nameResolver = await ethers.getContract('NameResolver')

  // configure name
  const registryName = process.env.REGISTRY_DOMAIN_NAME
  if (!registryName) throw "You must set the REGISTRY_DOMAIN_NAME environment variable."
  const registryNameHash = await avvy.utils.nameHash(registryName)
  console.log('Configuring forward resolution')
  let tx
  tx = await avvy.contracts.ResolverRegistryV1.set(registryNameHash, [], nameResolver.address, 0)
  await tx.wait()
  console.log('Configuring reverse resolution')
  tx = await avvy.contracts.ReverseResolverRegistryV1.setAuthenticator(registryNameHash, nameResolver.address)
  await tx.wait()
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
