pragma solidity ^0.4.15;


import '../receive/CompatReceiveAdapter.sol';
import '../math/SafeMath.sol';
import "./TokenReceiver.sol";
import '../ownership/Ownable.sol';
import '../token/ExternalToken.sol';
import '../token/ERC20.sol';


contract AbstractSale is CompatReceiveAdapter, Ownable {
    using SafeMath for uint256;

    event PriceChange(address token, uint256 price);
    event Purchase(address indexed buyer, address paid, uint256 value, uint256 amount);

    mapping (address => uint256) prices;

    function AbstractSale(uint256 _price) {
        setPrice(address(0), _price);
    }

    function onReceive(address _token, address _from, uint256 _value, bytes _data) internal {
        uint256 tokens = getAmount(_token, _value);
        if (_data.length == 20) {
            doPurchase(address(toBytes20(_data, 0)), tokens);
        } else {
            require(_data.length == 0);
            doPurchase(_from, tokens);
        }
        Purchase(_from, _token, _value, tokens);
    }

    function doPurchase(address buyer, uint256 amount) internal;

    function toBytes20(bytes b, uint256 _start) internal returns (bytes20 result) {
        require(_start + 20 <= b.length);
        assembly {
            let from := add(_start, add(b, 0x20))
            result := mload(from)
        }
    }

    function getAmount(address _token, uint256 _amount) constant returns (uint256) {
        uint256 price = getPrice(_token);
        require(price > 0);
        return _amount.div(price);
    }

    function getPrice(address _token) constant returns (uint256) {
        return prices[_token];
    }

    function setPrice(address _token, uint256 _price) onlyOwner {
        prices[_token] = _price;
        PriceChange(_token, _price);
    }

    function withdraw(address _token, address _to, uint256 _amount) onlyOwner public {
        require(_to != address(0));
        if (_token == address(0)) {
            _to.transfer(_amount);
        }
        else {
            ERC20(_token).transfer(_to, _amount);
        }
    }

    function burnWithData(address _token, uint256 _amount, bytes _data) onlyOwner public {
        ExternalToken(_token).burn(_amount, _data);
    }
}
