pragma solidity ^0.4.11;


import '../../contracts/receive/ERC20ReceiveAdapter.sol';
import '../../contracts/receive/ReceiveAdapterMock.sol';


contract ERC20ReceiveAdapterMock is ERC20ReceiveAdapter, ReceiveAdapterMock {
}