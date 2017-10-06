pragma solidity ^0.4.11;


import '../../contracts/token/ERC667Impl.sol';


// mock class using StandardToken
contract ERC667Mock is ERC667Impl {

  function ERC667Mock(address initialAccount, uint256 initialBalance) {
    balances[initialAccount] = initialBalance;
    totalSupply = initialBalance;
  }

}
