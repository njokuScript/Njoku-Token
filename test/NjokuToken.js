const NjokuToken = artifacts.require("NjokuToken");

contract(NjokuToken, accounts => {
  it("sets the total supply of token upon deployment", () => {
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
      });
  });
});
