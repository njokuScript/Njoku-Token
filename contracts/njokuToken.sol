pragma solidity >=0.4.20 <0.7.0;


contract NjokuToken {
    //constructor
    //set the total number of tokens
    //get the total number of tokn
    uint256 public totalSupply;

    constructor() public {
        totalSupply = 1000000;
    }
}
