module.exports = function(deployer) {
  deployer.deploy(ConvertLib);
  deployer.autolink();
  deployer.deploy(DomainMicropay);
  deployer.deploy(UserClientMicropay);
  deployer.deploy(UserClient);
};
