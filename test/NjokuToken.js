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

        return tokenInstace.transfer.call(accounts[1], 88989899999999);
        return tokenInstace.transfer
          .call(accounts[1], 250000, {
            from: accounts[0]
          })
          .then(success => {
            assert.equal(success, true, "it returns true");
          });
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
  it("approves delegatd transfer", () => {
    return NjokuToken.deployed().then(instance => {
      tokenInstace = instance;
      return tokenInstace.approve
        .call(accounts[1], 100)
        .then(success => {
          assert.equal(success, true, "it returns true");
          return tokenInstace.approve(accounts[1], 100, { from: accounts[0] });
        })
        .then(receipt => {
          assert.equal(receipt.logs.length, 1, "triggers one event");
          assert.equal(
            receipt.logs[0].event,
            "Approval",
            'should be the "Approval" event'
          );
          assert.equal(
            receipt.logs[0].args._owner,
            accounts[0],
            "logs the account the tokens are authorized by"
          );
          assert.equal(
            receipt.logs[0].args._spender,
            accounts[1],
            "logs the account the tokens are authorized to"
          );
          assert.equal(
            receipt.logs[0].args._value,
            100,
            "logs the transfer amount"
          );
          return tokenInstace.allowance(accounts[0], accounts[1]);
        })
        .then(allowance => {
          assert.equal(
            allowance.toNumber(),
            100,
            "stores the allowance for the delegated token"
          );
        });
    });
  });
  it("handles delegated token transfers", function() {
    return NjokuToken.deployed()
      .then(function(instance) {
        tokenInstance = instance;
        fromAccount = accounts[2];
        toAccount = accounts[3];
        spendingAccount = accounts[4];
        // Transfer some tokens to fromAccount
        return tokenInstance.transfer(fromAccount, 100, { from: accounts[0] });
      })
      .then(function(receipt) {
        // Approve spendingAccount to spend 10 tokens form fromAccount
        return tokenInstance.approve(spendingAccount, 10, {
          from: fromAccount
        });
      })
      .then(function(receipt) {
        // Try transferring something larger than the sender's balance
        return tokenInstance.transferFrom(fromAccount, toAccount, 9999, {
          from: spendingAccount
        });
      })
      .then(assert.fail)
      .catch(function(error) {
        assert(
          error.message.indexOf("revert") >= 0,
          "cannot transfer value larger than balance"
        );
        // Try transferring something larger than the approved amount
        return tokenInstance.transferFrom(fromAccount, toAccount, 20, {
          from: spendingAccount
        });
      })
      .then(assert.fail)
      .catch(function(error) {
        assert(
          error.message.indexOf("revert") >= 0,
          "cannot transfer value larger than approved amount"
        );
        return tokenInstance.transferFrom.call(fromAccount, toAccount, 10, {
          from: spendingAccount
        });
      })
      .then(function(success) {
        assert.equal(success, true);
        return tokenInstance.transferFrom(fromAccount, toAccount, 10, {
          from: spendingAccount
        });
      })
      .then(function(receipt) {
        assert.equal(receipt.logs.length, 1, "triggers one event");
        assert.equal(
          receipt.logs[0].event,
          "Transfer",
          'should be the "Transfer" event'
        );
        assert.equal(
          receipt.logs[0].args._from,
          fromAccount,
          "logs the account the tokens are transferred from"
        );
        assert.equal(
          receipt.logs[0].args._to,
          toAccount,
          "logs the account the tokens are transferred to"
        );
        assert.equal(
          receipt.logs[0].args._value,
          10,
          "logs the transfer amount"
        );
        return tokenInstance.balanceOf(fromAccount);
      })
      .then(function(balance) {
        assert.equal(
          balance.toNumber(),
          90,
          "deducts the amount from the sending account"
        );
        return tokenInstance.balanceOf(toAccount);
      })
      .then(function(balance) {
        assert.equal(
          balance.toNumber(),
          10,
          "adds the amount from the receiving account"
        );
        return tokenInstance.allowance(fromAccount, spendingAccount);
      })
      .then(function(allowance) {
        assert.equal(
          allowance.toNumber(),
          0,
          "deducts the amount from the allowance"
        );
      });
  });
});
