# Reverse Resolvable Contracts

A reverse-resolvable contract is a contract who's address can be reverse resolved into a .avax domain.

This repo provides an example on how this can be implemented. The contracts that are in this repository need to be customized for your individual situation.

**THESE CONTRACTS LACK AUTHENTICATION FOR CRITICAL FUNCTIONALITY**. If you fail to lock them down, others will be either to (a) set reverse records using your domain; or (b) set the reverse record for your contract.

## Contracts

There are two contracts inside of the [`contracts`](https://github.com/avvydomains/integration-examples/tree/master/reverse-resolvable-contract/contracts) folder:

- [`ReverseResolvableContract.sol`](https://github.com/avvydomains/integration-examples/blob/master/reverse-resolvable-contract/contracts/ReverseResolvableContract.sol) is the contract that you want to map it's address to a .avax domain
- [`ReverseResolverAuthenticator.sol`](https://github.com/avvydomains/integration-examples/blob/master/reverse-resolvable-contract/contracts/ReverseResolverAuthenticator.sol) handles authentication for requests to set reverse records on your domain

These contracts are insecure examples, and need to be customized for your individual solution.


## Setup

[`scripts/init.js`](https://github.com/avvydomains/integration-examples/blob/master/reverse-resolvable-contract/scripts/init.js) demonstrates how the ReverseResolvableContract can be configured, after deployment, to reverse resolve to your domain name. 

Optionally, you can use `init.js` to configure your contract, however this requires providing the private key for the wallet that holds the domain you want to set up.

### Setup Steps

(These steps must be executed *after* you deploy your contracts)

1. On the Avvy `ReverseResolverRegistry`, you need to call the `.setAuthenticator` function to configure your authenticator contract to be used for the domain. ([see this line for more details](https://github.com/avvydomains/integration-examples/blob/master/reverse-resolvable-contract/scripts/init.js#L22))
2. Your `ReverseResolvableContract` (i.e. the one you want to label with the domain) needs to make a call to the Avvy contract which handles reverse resolution for EVM addresses. ([see this function for details on how your contract can make that call](https://github.com/avvydomains/integration-examples/blob/master/reverse-resolvable-contract/contracts/ReverseResolvableContract.sol#L21))



