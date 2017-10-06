pragma solidity ^0.4.11;


import './ERC20.sol';


contract ERC667 is ERC20 {
    event Transfer(address indexed owner, address indexed spender, uint256 value, bytes data);
    function transferAndCall(address _to, uint256 _value, bytes _data) returns (bool);
}