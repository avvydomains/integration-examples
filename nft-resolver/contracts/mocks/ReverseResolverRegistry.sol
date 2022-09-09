// SPDX-License-Identifier: stfu warnings

import "@avvy/contracts/ReverseResolverAuthenticatorInterface.sol";

contract ReverseResolverRegistryV1Mock {
  ReverseResolverAuthenticatorInterface authenticator;

  function canWrite(uint256 name, uint256[] memory path, address sender) external view returns (bool) {
    return authenticator.canWrite(name, path, sender);
  }   

  constructor(ReverseResolverAuthenticatorInterface _authenticator) {
    authenticator = _authenticator;
  }
}

