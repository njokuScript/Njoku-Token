pragma solidity >=0.4.20 <0.7.0;


contract NjokuToken {
    string public name = "Njoku Token";
    string public symbol = "NTok";
    string public standard = "NjokuToken v1.0";
    uint256 public totalSupply;
    //transfer event
    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    //aprroval event
    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    constructor(uint256 _initialSupply) public {
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
    }

    //transfer function
    function transfer(address _to, uint256 _value)
        public
        returns (bool success)
    {
        //checks if sender has up 2 the amount that wants to be sent
        require(
            balanceOf[msg.sender] >= _value,
            "you dont have enough ether in account"
        );
        //deduct token from sender
        balanceOf[msg.sender] -= _value;

        //add token to reciever
        balanceOf[_to] += _value;

        //call event
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    //approval function
    function approve(address _spender, uint256 _value)
        public
        returns (bool success)
    {
        allowance[msg.sender][_spender] = _value;
        //call event
        emit Approval(msg.sender, _spender, _value);

        return true;
    }

    //transferFrom function
    function transferFrom(address _from, address _to, uint256 _value)
        public
        returns (bool success)
    {
        require(_value <= balanceOf[_from], "error");
        require(_value <= allowance[_from][msg.sender], "error");

        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;

        allowance[_from][msg.sender] -= _value;

        emit Transfer(_from, _to, _value);

        return true;
    }
}
