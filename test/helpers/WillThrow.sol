pragma solidity ^0.4.11;

contract WillThrow {
    uint256 public state;
    uint256 public stateAfter;

    function changeAndThrow(uint256 _state) {
        state = _state;
        revert();
    }

    function change(uint256 _state) {
        state = _state;
    }
}