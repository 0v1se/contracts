pragma solidity ^0.4.11;


import '../../contracts/token/NotifyToken.sol';


// mock class using BasicToken
contract NotifyTokenMock is NotifyToken {

  function NotifyTokenMock(address initialAccount, uint256 initialBalance) {
    balances[initialAccount] = initialBalance;
    totalSupply = initialBalance;
  }

}
