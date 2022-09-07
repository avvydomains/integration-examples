import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";


contract NameResolver {
  IERC721 _nft;

  mapping(uint256 => address) owners;
  mapping(address => uint256) ownersReverse;
  mapping(uint256 => mapping(uint256 => string)) standardEntries;
  mapping(uint256 => mapping(string => string)) entries;

  function _verifyOwner(address owner) internal view {
    require(_nft.balanceOf(owner) > 0, "Must be owner");
  }

  function claimName(uint256 name) external {

    // verify sender is owner
    _verifyOwner(msg.sender);

    // if the name is already taken, don't allocate unless that holder doesn't have an NFT anymore
    if (owners[name] != address(0)) {
      require(_nft.balanceOf(owners[name]) == 0, "Name is already owned");
    }

    // each address can only claim one name
    if (ownersReverse[msg.sender] != 0) {
      owners[ownersReverse[msg.sender]] = address(0);
      ownersReverse[msg.sender] = 0;
    }

    // allocate the name
    owners[name] = msg.sender;
    ownersReverse[msg.sender] = name;
  }

  function resolveStandard(uint256 /*datasetId*/, uint256 hash, uint256 key) external view returns (string memory data) {
    if (key == 3) { // EVM address
      address owner = owners[hash];
      if (owner != address(0)) {
        
        // verify ownership again.
        _verifyOwner(owner);
        return Strings.toHexString(uint160(owner), 20);
      }
    }
  }
  
  function resolve(uint256 datasetId, uint256 hash, string memory key) external returns (string memory data) {}

  constructor(IERC721 nft) {
    _nft = nft;
  }
}
