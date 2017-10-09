pragma solidity ^0.4.11;


import './ERC667Impl.sol';
import '../ownership/Ownable.sol';


contract ExternalToken is ERC667Impl, Ownable {
    event Mint(address indexed to, uint256 value, bytes tx);
    event Burn(address indexed burner, uint256 value, bytes data);
    event BurnResponse(bytes32 indexed tx, uint256 indexed logIndex, bytes data);

    function mint(address _to, uint256 _value, bytes _tx) onlyOwner public returns (bool) {
        _mint(_to, _value, _tx);
        Transfer(0x0, _to, _value);
        return true;
    }

    function mintAndCall(address _to, uint256 _value, bytes _tx, bytes _data) onlyOwner public returns (bool) {
        _mint(_to, _value, _tx);
        Transfer(0x0, _to, _value, _data);
        require(_to.call(bytes4(bytes32(sha3("onTokenTransfer(address,uint256,bytes)"))), 0x0, _value, _data));
        return true;
    }

    function _mint(address _to, uint256 _value, bytes _tx) private {
        totalSupply = totalSupply.add(_value);
        balances[_to] = balances[_to].add(_value);
        Mint(_to, _value, _tx);
    }

    function burn(uint256 _value, bytes _data) {
        require(_value > 0);
        require(_value <= balances[msg.sender]);
        checkBuyBackData(_value, _data);

        address burner = msg.sender;
        balances[burner] = balances[burner].sub(_value);
        totalSupply = totalSupply.sub(_value);
        Burn(burner, _value, _data);
    }

    function setBurnResponse(bytes32 _tx, uint256 _logIndex, bytes _data) onlyOwner public {
        BurnResponse(_tx, _logIndex, _data);
    }

    function checkBuyBackData(uint256 _value, bytes _data) internal {

    }
}