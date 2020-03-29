const NjokuToken = artifacts.require("njokuToken");

module.exports = function(deployer) {
  deployer.deploy(NjokuToken, 1000000);
};
