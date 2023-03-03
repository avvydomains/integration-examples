// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "@avvy/contracts/ReverseResolverAuthenticatorInterface.sol";

contract ReverseResolverAuthenticator is ReverseResolverAuthenticatorInterface {

  /**
  * WARNING
  * 
  * Make sure you write your own logic to authenticate the sender. If you return
  * true, the sender is able to write records to your domain name at the
  * provided name & path.
  */
  function canWrite(uint256 /* name */, uint256[] memory /* path */, address /* sender */) external pure override returns (bool) {
    return true;
  }   
}     
