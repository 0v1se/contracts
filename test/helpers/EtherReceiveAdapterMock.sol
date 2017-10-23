pragma solidity ^0.4.11;


import '../../contracts/receive/EtherReceiveAdapter.sol';
import '../../contracts/receive/ReceiveAdapterMock.sol';


contract EtherReceiveAdapterMock is EtherReceiveAdapter, ReceiveAdapterMock {
}