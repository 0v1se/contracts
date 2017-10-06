pragma solidity ^0.4.11;


import './StandardToken.sol';
import './ERC667.sol';


contract NotifyToken is StandardToken, ERC667 {
    function transferAndCall(address _to, uint256 _value, bytes _data) returns (bool){
        require(_to != address(0));
        require(_value <= balances[msg.sender]);

        // SafeMath.sub will throw if there is not enough balance.
        balances[msg.sender] = balances[msg.sender].sub(_value);
        balances[_to] = balances[_to].add(_value);
        Transfer(msg.sender, _to, _value, _data);
        require(_to.call(bytes4(bytes32(sha3("onTokenTransfer(address,uint256,bytes)"))), msg.sender, _value, _data));
        return true;
    }
}