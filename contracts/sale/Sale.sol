pragma solidity ^0.4.11;

import '../math/SafeMath.sol';
import '../ownership/Ownable.sol';
import '../receive/CompatReceiveAdapter.sol';
import '../token/ERC20.sol';

/**
 * @dev Sells someone's tokens. Can accept ether or any token.
 */
contract Sale is CompatReceiveAdapter, Ownable {
    using SafeMath for uint256;

    ERC20 token;
    address public seller;
    mapping(address => uint256) prices;
    address[] tokens;

    event Purchase(address indexed buyer, address paid, uint256 value, uint256 amount);

    function Sale(address _token, uint256 _price) {
        token = ERC20(_token);
        seller = msg.sender;
        setPrice(address(0), _price);
    }

    function onReceive(address _token, address _from, uint256 _value, bytes _data) internal {
        uint256 tokens = getAmount(_token, _value);
        if (_data.length != 0) {
            token.transferFrom(seller, toAddress(_data), tokens);
        } else {
            token.transferFrom(seller, _from, tokens);
        }
        Purchase(_from, _token, _value, tokens);
    }

    function getAmount(address _token, uint256 _amount) constant returns (uint256) {
        uint256 price = getPrice(_token);
        require(price > 0);
        return _amount.div(price);
    }

    function toBytes(address a) constant returns (bytes b){
        assembly {
            let m := mload(0x40)
            mstore(add(m, 20), xor(0x140000000000000000000000000000000000000000, a))
            mstore(0x40, add(m, 52))
            b := m
        }
    }

    event Test(uint256 size, bytes test);

    function toAddress(bytes b) constant returns (address) {
        uint result = 0;
        Test(b.length, b);
        for (uint i = 0; i < b.length; i++) {
            uint c = uint(b[i]);
            if (c >= 48 && c <= 57) {
                result = result * 16 + (c - 48);
            }
            if (c >= 65 && c<= 90) {
                result = result * 16 + (c - 55);
            }
            if (c >= 97 && c<= 122) {
                result = result * 16 + (c - 87);
            }
        }
        return address(result);
    }

    function getPrice(address _token) constant returns (uint256) {
        return prices[_token];
    }

    function getTokens() constant returns (address[]) {
        return tokens;
    }

    function setPrice(address _token, uint256 _price) onlyOwner {
        if (_price == 0) {
            removeFromTokens(_token);
        } else {
            addToTokens(_token);
        }
        prices[_token] = _price;
    }

    function addToTokens(address _token) internal {
        if (prices[_token] == 0) {
            tokens.push(_token);
        }
    }

    function removeFromTokens(address _token) internal {
        if (prices[_token] != 0) {
            for (uint256 i = 0; i < tokens.length-1; i++) {
                if (tokens[i] == _token) {
                    if (i != tokens.length - 1) {
                        tokens[i] = tokens[tokens.length - 1];
                    }
                }
            }
            delete tokens[tokens.length - 1];
            tokens.length--;
        }
    }
}