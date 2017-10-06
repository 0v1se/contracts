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

    event Purchase(address indexed buyer, address paid, uint256 value, uint256 amount);

    function Sale(address _token, uint256 _price) {
        token = ERC20(_token);
        seller = msg.sender;
        prices[0x0] = _price;
    }

    function onReceive(address _token, address _from, uint256 _value, bytes _data) internal {
        uint256 tokens = getAmount(_token, _value);
        token.transferFrom(seller, _from, tokens);
        Purchase(_from, _token, _value, tokens);
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
    }
}