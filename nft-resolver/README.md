# NFT Resolver

This project demonstrates how to hook into the Avvy Domains resolution system via a custom resolver.

We have two contracts in this example: [`NFT`](https://github.com/avvydomains/integration-examples/blob/master/nft-resolver/contracts/NFT.sol) and [`NameResolver`](https://github.com/avvydomains/integration-examples/blob/master/nft-resolver/contracts/NameResolver.sol). 

`NFT` is a mock ERC721 NFT which any user can mint by calling the `mint()` function. In practice, this contract can be replaced by any ERC721 NFT.

`NameResolver` is deployed with a reference to `NFT`. Wallets that hold one or more NFTs can [claim a name on `NameResolver.sol`](https://github.com/avvydomains/integration-examples/blob/master/nft-resolver/contracts/NameResolver.sol#L17). This enables NFT collections to set up a subdomain registry for their holders.

As an example, consider the NFT project `MyNFTProject`:

1. MyNFTProject registers the name `mynftproject.avax` and configures a resolver on the domain.
2. Users with one or more MyNFTProject NFTs in their wallet can register a name like `myawesomename.mynftproject.avax` (replacing `myawesomename` with whatever they want). When they register, `myawesomename.mynftproject.avax will point to their wallet address.
3. If that user transfers all of their MyNFTProject NFTs out of their wallet, `myawesomename.mynftproject.avax` will no longer work.


**Disclaimer: This code has not been audited by security professionals. Use at your own risk.**
