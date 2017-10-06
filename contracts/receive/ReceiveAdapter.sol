pragma solidity ^0.4.11;

/**
 * @dev This adapter helps to receive tokens. It has some subcontracts for different tokens:
 *   ERC20ReceiveAdapter - for receiving simple ERC20 tokens
 */
contract ReceiveAdapter {

    /**
     * @dev Receive tokens from someone. Owner of the tokens should approve first
     */
    function onReceive(address _token, address _from, uint256 _value, bytes _data) internal;
}