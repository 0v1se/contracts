pragma solidity ^0.4.15;


import "./AbstractSale.sol";


/**
 * @title This Sale accepts ETH and ERC-223 tokens and does nothing. It only logs payments
 */
contract LoggingSale is AbstractSale {
    function doPurchase(address buyer, uint256 amount) internal {

    }
}
