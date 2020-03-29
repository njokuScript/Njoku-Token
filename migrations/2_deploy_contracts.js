const TokenMigrations = artifact.require("njokuToken");

module.exports = function(deployer) {
  deployer.deploy("TokenMigrations");
};
