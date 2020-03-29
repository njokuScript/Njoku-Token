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
        return tokenInstace.symbol();
      })
      .then(symbol => {
        assert.equal(symbol, "NTok", "has the correct symbol");
        return tokenInstace.standard();
      })
      .then(standard => {
        assert.equal(standard, "NjokuToken v1.0", "has the correct standard");
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
  it("transfer token ownership", () => {
    return NjokuToken.deployed()
      .then(instance => {
        tokenInstace = instance;
        return tokenInstace.transfer
          .call(accounts[1], 250000, {
            from: accounts[0]
          })
          .then(success => {
            assert.equal(success, true, "it returns true");
          });
        return tokenInstace.transfer.call(accounts[1], 88989899999999);
      })
      .then(assert.fail)
      .catch(error => {
        assert(
          error.message.indexOf("revert") >= 0,
          "error message must contain value"
        );
        return tokenInstace.transfer(accounts[1], 250000, {
          from: accounts[0]
        });
      })
      .then(receipt => {
        assert.equal(receipt.logs.length, 1, "triggers one event");
        assert.equal(
          receipt.logs[0].event,
          "Transfer",
          'should be the "Transfer" event'
        );
        assert.equal(
          receipt.logs[0].args._from,
          accounts[0],
          "logs the account the tokens are transferred from"
        );
        assert.equal(
          receipt.logs[0].args._to,
          accounts[1],
          "logs the account the tokens are transferred to"
        );
        assert.equal(
          receipt.logs[0].args._value,
          250000,
          "logs the transfer amount"
        );
        return tokenInstace.balanceOf(accounts[1]);
      })
      .then(balance => {
        assert.equal(balance.toNumber(), 250000, "Send 25000 to account 1");
        return tokenInstace.balanceOf(accounts[0]);
      })
      .then(balance => {
        assert.equal(balance.toNumber(), 750000, "deducted token");
      });
  });
});
