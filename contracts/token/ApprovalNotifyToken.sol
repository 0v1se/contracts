pragma solidity ^0.4.11;


import './ERC20Impl.sol';


/**
 * @dev This token notifies contract when it receives approval from the user
 */
contract ApprovalNotifyToken is ERC20Impl {
    function approveAndCall(address _spender, uint256 _value, bytes _data) returns (bool success) {
        approve(_spender, _value);
        require(_spender.call(bytes4(bytes32(sha3("receiveApproval(address,uint256,address,bytes)"))), msg.sender, _value, this, _data));
        return true;
    }
}