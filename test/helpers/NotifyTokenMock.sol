pragma solidity ^0.4.11;


import '../../contracts/token/ERC667Impl.sol';


// mock class using BasicToken
contract NotifyTokenMock is ERC667Impl {

  function NotifyTokenMock(address initialAccount, uint256 initialBalance) {
    balances[initialAccount] = initialBalance;
    totalSupply = initialBalance;
  }

}
