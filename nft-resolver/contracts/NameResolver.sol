import "@avvy/contracts/ContractRegistryInterface.sol";
import "@avvy/contracts/RainbowTableInterface.sol";
import "@avvy/contracts/ResolverInterface.sol";

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";


contract NameResolver is ResolverInterface {
  IERC721 _nft;
  ContractRegistryInterface _contractRegistry;

  mapping(uint256 => address) owners;
  mapping(address => uint256) ownersReverse;
  mapping(uint256 => mapping(uint256 => string)) standardEntries;
  mapping(uint256 => mapping(string => string)) entries;

  function _verifyOwner(address owner) internal view {
    require(_nft.balanceOf(owner) > 0, "Must be owner");
  }

  function _addressToString(address addy) internal pure returns (string memory) {
    return Strings.toHexString(uint160(addy), 20);
  }

  /*
    Claim
    =====

    ** This is custom functionality. Other resolver implementations 
       do not need to follow this.

    We allow any holder of the NFT to claim a single name for their
    wallet address. Names are represented by their hash.
  */
  function claimName(uint256[] memory preimage, uint256 name) external {
    
    // verify sender is owner
    _verifyOwner(msg.sender);

    // if the name is already taken, don't allocate
    require(owners[name] == address(0), "Name is already owned");

    // save the plaintext of the name (assuming this is desired)
    RainbowTableInterface rainbowTable = RainbowTableInterface(_contractRegistry.get('RainbowTable'));
    if (!rainbowTable.isRevealed(name)) {
      rainbowTable.reveal(preimage, name);
    }

    // each address can only claim one name
    if (ownersReverse[msg.sender] != 0) {
      owners[ownersReverse[msg.sender]] = address(0);
      _clear(ownersReverse[msg.sender]);
    }

    // allocate the name
    uint256[] memory path = new uint256[](0);
    owners[name] = msg.sender;
    ownersReverse[msg.sender] = name;
    emit StandardEntrySet(
      0, // datasetId not used
      name, // hash of the name
      path, // path var not used
      3, // setting EVM address
      _addressToString(msg.sender) // setting to msg.sender
    );
  }

  /*
    Clear
    =====

    ** This is custom functionality. Other resolver implementations 
       do not need to follow this.

    If the owner of a name no longer holds an NFT from the collection
    any user can clear their name.
  */
  function clear(uint256 name) external {
    require(_nft.balanceOf(owners[name]) == 0, "Owner still holds token");
    _clear(name);
  }

  function _clear(uint256 name) internal {
    uint256[] memory path = new uint256[](0);

    // clear the previously used name
    emit StandardEntrySet(
      0, // datasetId not used
      name, // hash of the name
      path, // path var not used
      3, // setting EVM address
      '' // clear the name
    );
    ownersReverse[msg.sender] = 0;
  }

  /*
    Resolution Methods
    ==================

    resolve() and resolveStandard() are overrides for ResolverInterface. 
    These methods are used when transforming a .avax name into a 
    value like an 0x address.
  */

  function resolveStandard(uint256 /*datasetId*/, uint256 hash, uint256 key) external view returns (string memory data) {
    if (key == 3) { // EVM address
      address owner = owners[hash];
      if (owner != address(0)) {
        
        // verify ownership again.
        _verifyOwner(owner);
        return _addressToString(owner);
      }
    }
  }
  
  function resolve(uint256 datasetId, uint256 hash, string memory key) external returns (string memory data) {}

  constructor(IERC721 nft, ContractRegistryInterface contractRegistry) {
    _nft = nft;
    _contractRegistry = contractRegistry;
  }
}
