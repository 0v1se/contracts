pragma solidity ^0.4.0;


import '../token/ExternalToken.sol';


contract BitcoinToken is ExternalToken {
    string public constant name = "Bitcoin";
    string public constant symbol = "BTCT";
    uint8 public constant decimals = 8;

    uint256 public minimalBurn;

    function BtcToken(uint256 _minimalBurn) {
        minimalBurn = _minimalBurn;
    }

    function checkBuyBackData(uint256 _value, bytes _data) internal {
        require(_value >= minimalBurn);
    }
}
