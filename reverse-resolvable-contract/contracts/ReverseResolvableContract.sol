// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "@avvy/contracts/ContractRegistryInterface.sol";
import "@avvy/contracts/ReverseResolverRegistryInterface.sol";
import "@avvy/contracts/reverse-resolvers/EVMReverseResolverInterface.sol";
      
contract ReverseResolvableContract {
  ContractRegistryInterface public immutable _contractRegistry;
  uint256 constant EVM_STANDARD_KEY = 3;
      
  /**
   * WARNING
   *
   * DO NOT LEAVE THIS PUBLIC!
   *
   * Anyone who can call this method can set the reverse record for your
   * domain. Make sure you properly authenticate the caller.
   */
  function setEVMReverse(uint256 name, uint256[] calldata path) public {
    ReverseResolverRegistryInterface reverseResolverRegistry = ReverseResolverRegistryInterface(_contractRegistry.get('ReverseResolverRegistry'));
    EVMReverseResolverInterface evmReverseResolver = EVMReverseResolverInterface(reverseResolverRegistry.getResolver(EVM_STANDARD_KEY));
    evmReverseResolver.set(name, path);
  }   
      
  constructor(ContractRegistryInterface contractRegistry) {
    _contractRegistry = contractRegistry;
  }   
}     
