pragma solidity ^0.4.11;


import '../../contracts/token/ERC20Impl.sol';


// mock class using StandardToken
contract StandardTokenMock is ERC20Impl {

  function StandardTokenMock(address initialAccount, uint256 initialBalance) {
    balances[initialAccount] = initialBalance;
    totalSupply = initialBalance;
  }

}
