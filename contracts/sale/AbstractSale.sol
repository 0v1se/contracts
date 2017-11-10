pragma solidity ^0.4.15;


import '../receive/CompatReceiveAdapter.sol';
import '../math/SafeMath.sol';
import "./TokenReceiver.sol";
import '../ownership/Ownable.sol';
import '../token/ExternalToken.sol';
import '../token/ERC20.sol';


contract AbstractSale is CompatReceiveAdapter, Ownable {
    using SafeMath for uint256;

    event BonusChange(uint256 bonus);
    event RateChange(address token, uint256 rate);
    event Purchase(address indexed buyer, address token, uint256 value, uint256 amount);

    event Test(uint256 value);

    mapping (address => uint256) rates;
    uint256 public bonus;

    function onReceive(address _token, address _from, uint256 _value, bytes _data) internal {
        Test(_value);
        uint256 tokens = getAmount(_token, _value);
        address buyer;
        if (_data.length == 20) {
            buyer = address(toBytes20(_data, 0));
        } else {
            require(_data.length == 0);
            buyer = _from;
        }
        Purchase(buyer, _token, _value, tokens);
        doPurchase(buyer, tokens);
    }

    function doPurchase(address buyer, uint256 amount) internal;

    function toBytes20(bytes b, uint256 _start) internal returns (bytes20 result) {
        require(_start + 20 <= b.length);
        assembly {
            let from := add(_start, add(b, 0x20))
            result := mload(from)
        }
    }

    function getAmount(address _token, uint256 _value) constant returns (uint256) {
        uint256 rate = getRate(_token);
        require(rate > 0);
        uint256 beforeBonus = _value.mul(rate);
        Test(_value);
        Test(beforeBonus);
        return beforeBonus.add(beforeBonus.mul(bonus).div(100)).div(10**18);
    }

    function getRate(address _token) constant returns (uint256) {
        return rates[_token];
    }

    function setRate(address _token, uint256 _rate) onlyOwner public {
        rates[_token] = _rate;
        RateChange(_token, _rate);
    }

    function setBonus(uint256 _bonus) onlyOwner public {
        bonus = _bonus;
        BonusChange(_bonus);
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
