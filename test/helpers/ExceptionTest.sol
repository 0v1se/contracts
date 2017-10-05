pragma solidity ^0.4.11;

import '../../contracts/token/ERC20Basic.sol';

contract ExceptionTest {
    uint256 public state;
    uint256 public stateInternal;

    function callWillThrow(uint256 _state, address addr, string name) {
        state = _state;
        addr.call(bytes4(sha3(strConcat(name, "(uint256)"))), _state);
    }

    function changeInternalAndThrow(uint256 _stateInternal) {
        stateInternal = _stateInternal;
        revert();
    }

    function changeInternal(uint256 _stateInternal) {
        stateInternal = _stateInternal;
    }

    function strConcat(string _a, string _b) internal returns (string){
        bytes memory _ba = bytes(_a);
        bytes memory _bb = bytes(_b);
        string memory ab = new string(_ba.length + _bb.length);
        bytes memory bab = bytes(ab);
        uint k = 0;
        for (uint i = 0; i < _ba.length; i++) bab[k++] = _ba[i];
        for (i = 0; i < _bb.length; i++) bab[k++] = _bb[i];
        return string(bab);
    }
}