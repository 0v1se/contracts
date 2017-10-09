pragma solidity ^0.4.11;


import '../../contracts/receive/CompatReceiveAdapter.sol';
import './ReceiveAdapterMock.sol';


contract CompatReceiveAdapterMock is CompatReceiveAdapter, ReceiveAdapterMock {
}