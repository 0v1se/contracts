pragma solidity ^0.4.11;


import './AbstractSale.sol';
import '../token/ERC20.sol';


/**
 * @dev Sells someone's tokens. Can accept ether or any token
 */
contract Sale is AbstractSale {
    ERC20 public token;

    address public seller;

    function Sale(address _token, uint256 _price) AbstractSale(_price) {
        token = ERC20(_token);
        seller = msg.sender;
    }

    function doPurchase(address buyer, uint256 amount) internal {
        token.transferFrom(seller, buyer, amount);
    }
}