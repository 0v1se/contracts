pragma solidity ^0.4.11;

import "../math/SafeMath.sol";
import '../ownership/Ownable.sol';
import '../token/ERC20.sol';

contract Sale is Ownable {
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

    function () payable {
        buyTokens();
    }

    function buyTokens() payable {
        uint256 amount = msg.value;

        // calculate token amount to be created
        uint256 tokens = getAmount(0x0, amount);

        token.transferFrom(seller, msg.sender, tokens);
        Purchase(msg.sender, 0x0, amount, tokens);
    }

    function getAmount(address _address, uint256 _amount) constant returns (uint256) {
        uint256 price = getPrice(_address);
        require(price > 0);
        return _amount.div(price);
    }

    function getPrice(address _address) constant returns (uint256) {
        return prices[_address];
    }

    function setPrice(address _address, uint256 _price) onlyOwner {
        prices[_address] = _price;
    }
}