pragma solidity >=0.4.20 <0.7.0;


contract NjokuToken {
    string public name = "Njoku Token";
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;

    constructor(uint256 _initialSupply) public {
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
    }
}
