pragma solidity ^0.4.11;


import '../../contracts/token/ApprovalNotifyToken.sol';


// mock class using StandardToken
contract ApprovalNotifyTokenMock is ApprovalNotifyToken {

  function ApprovalNotifyTokenMock(address initialAccount, uint256 initialBalance) {
    balances[initialAccount] = initialBalance;
    totalSupply = initialBalance;
  }
}
