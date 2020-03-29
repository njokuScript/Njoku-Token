const NjokuToken = artifacts.require("NjokuToken");

contract(NjokuToken, accounts => {
  let tokenInstace;
  it("initializes with the correct values", () => {
    return NjokuToken.deployed()
      .then(instance => {
        tokenInstace = instance;
        return tokenInstace.name();
      })
      .then(name => {
        assert.equal(name, "Njoku Token", "has the correct name");
      });
  });
  it("sets the initial supply of token upon deployment", () => {
    return NjokuToken.deployed()
      .then(instance => {
        tokenInstace = instance;
        return tokenInstace.totalSupply();
      })
      .then(totalSupply => {
        assert.equal(
          totalSupply.toNumber(),
          1000000,
          "sets the total supply to 1 million"
        );
        return tokenInstace.balanceOf(accounts[0]);
      })
      .then(adminBalance => {
        assert.equal(
          adminBalance.toNumber(),
          1000000,
          "it allocates initial supply to admin balance"
        );
      });
  });
});
