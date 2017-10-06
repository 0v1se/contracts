pragma solidity ^0.4.11;


import '../../contracts/receive/ERC667ReceiveAdapter.sol';
import './ReceiveAdapterMock.sol';


contract ERC667ReceiveAdapterMock is ERC667ReceiveAdapter, ReceiveAdapterMock {
}