pragma solidity ^0.4.11;

/**
 * @dev This adapter helps to receive tokens. It has some subcontracts for different tokens:
 *   ERC20ReceiveAdapter - for receiving simple ERC20 tokens
 *   ERC223ReceiveAdapter - for receiving ERC223 tokens
 *   ReceiveApprovalAdapter - for receiving ERC20 tokens when token notifies receiver with receiveApproval
 *   CompatReceiveApproval - implements all these adapters
 */
contract ReceiveAdapter {

    /**
     * @dev Receive tokens from someone. Owner of the tokens should approve first
     */
    function onReceive(address _token, address _from, uint256 _value, bytes _data) internal;
}