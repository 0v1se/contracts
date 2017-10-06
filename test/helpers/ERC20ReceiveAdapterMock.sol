pragma solidity ^0.4.11;


import '../../contracts/receive/ERC20ReceiveAdapter.sol';
import './ReceiveAdapterMock.sol';


contract ERC20ReceiveAdapterMock is ERC20ReceiveAdapter, ReceiveAdapterMock {
}