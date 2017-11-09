pragma solidity ^0.4.11;


import './AbstractSale.sol';
import '../token/ERC20.sol';


/**
 * @dev Sells someone's tokens. Can accept ether or any token
 */
contract Sale is AbstractSale {
    ERC20 public token;

    address public seller;

    function Sale(address _token) {
        token = ERC20(_token);
        seller = msg.sender;
    }

    function doPurchase(address buyer, uint256 amount) internal {
        token.transferFrom(seller, buyer, amount);
    }

    function getTotal() public constant returns (uint256) {
        return token.allowance(seller, this);
    }
}