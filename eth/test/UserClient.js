contract('UserClient', function(accounts) {

  var micropayWallet, clientWallet1, userWallet1, userClientMicropayContract, userClientContract, pricePerHit;
  before(function(done) {
    micropayWallet = accounts[0];
    clientWallet1 = accounts[1];
    userWallet1 = accounts[2];
    userWallet2 = accounts[3];
    pricePerHit = 100;
    var domain = "fake.domain";
    DomainMicropay.new({from: micropayWallet})
      .then((c) => {
        c.signUp(domain, pricePerHit, {from: clientWallet1})
          .then(() => {
            return c.confirmClient(domain, clientWallet1, pricePerHit, {from: micropayWallet});
          })
          .then(() => {
            return c.getPaymentContractForDomain.call(domain);
          })
          .then((ucmContract) => {
            userClientMicropayContract = UserClientMicropay.at(ucmContract);
            return userClientMicropayContract.registerUser({from: userWallet1})
          })
          .then(() => {
            return userClientMicropayContract.getContract.call({from: userWallet1})
          })
          .then((ucContract) => {
            userClientContract = UserClient.at(ucContract);
            done();
          })
          .catch((err) => { done("Contract initialization failed: " + err); });
      })
      .catch((err) => { done("Contract initialization failed"); });
  });

  it("Should move pricePerHit from sender to userClientMicropay", function(done) {
    var balanceCompare = (cb) => {
      var userBalance, contractBalance;
      userBalance = web3.eth.getBalance(userWallet1);
      contractBalance = web3.eth.getBalance(userClientMicropayContract.contract.address);
      cb(userBalance, contractBalance);
    };

    balanceCompare((initUserBal, initContractBal) => {
      userClientContract.registerHit({from: userWallet1, value: pricePerHit})
        .then(() => {
          balanceCompare((finalUserBal, finalContractBal) => {
            assert(initUserBal.toNumber() > finalUserBal.toNumber(), pricePerHit, "User balance wasn't decremented");
            assert.equal(initContractBal.minus(finalContractBal).toNumber(), -pricePerHit, "Contract balance wasn't incremented");
            done();
          });
        })
        .catch((err) => { done(err); });
    });
  });

  it("Should only RegisterHit for the created user", function(done) {
    userClientContract.registerHit({from: userWallet2})
      .then(() => { done("RegisterHit from different wallet should fail"); })
      .catch((err) => { done(); })
  });

});
