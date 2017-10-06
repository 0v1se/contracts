pragma solidity ^0.4.11;


import '../../contracts/token/ERC20BasicImpl.sol';


// mock class using BasicToken
contract ERC20BasicMock is ERC20BasicImpl {

  function ERC20BasicMock(address initialAccount, uint256 initialBalance) {
    balances[initialAccount] = initialBalance;
    totalSupply = initialBalance;
  }

}
