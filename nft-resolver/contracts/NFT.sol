pragma solidity ^0.8.9;


import "@openzeppelin/contracts/token/ERC721/ERC721.sol";


contract NFT is ERC721 {
  uint256 tokenId = 1;

  function mint() external {
    _mint(msg.sender, tokenId);
    tokenId += 1;
  }

  constructor(string memory name, string memory symbol) ERC721(name, symbol) {
    
  }
}
