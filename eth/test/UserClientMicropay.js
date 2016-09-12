contract('UserClientMicropay', function(accounts) {

  var micropayWallet, clientWallet1, clientWallet2, userClientContract, userClientMicropayContract, pricePerHit;
  before(function(done) {
    micropayWallet = accounts[0];
    clientWallet1 = accounts[1];
    clientWallet2 = accounts[2];
    clientWallet3 = accounts[3];
    userWallet1 = accounts[4];
    pricePerHit = 100000000000000;
    var domain = "ucm.domain";
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
            userClientContract.registerHit({from: userWallet1});
            done();
          })
          .catch((err) => { done("Contract initialization failed: " + err); });
      })
      .catch((err) => { done("Contract initialization failed"); });
  });

  describe('withdraw', function() {

    it("Should only be callable by micropayWallet and the client", function(done) {
      userClientMicropayContract.withdraw(100, {from: clientWallet2})
        .then(() => { done("Should have failed"); })
        .catch((err) => { done(); });
    });

    it("should give micropayWallet 1% and the client 99%", function(done) {
      var micropayBal, contractBal, clientBal;
      var getBalances = function(cb) {
        micropayBal = web3.eth.getBalance(micropayWallet);
        clientBal = web3.eth.getBalance(clientWallet1);
        contractBal = web3.eth.getBalance(userClientMicropayContract.address);
        cb();
      };
      getBalances(() => {
        userClientMicropayContract.withdraw(pricePerHit, {from: clientWallet1})
          .then(() => {
            var initMicropayBal = micropayBal
              , initContractBal = contractBal
              , initClientBal = clientBal;
            getBalances(() => {
              console.log(initMicropayBal, initContractBal, micropayBal, contractBal);
              assert.equal(micropayBal, initMicropayBal.plus(0.01 * pricePerHit), "micropayBal should get 1%");
              assert.equal(clientBal, initClientBal.plus(0.99 * pricePerHit), "clientBal should get 99%");
              assert.equal(contractBal, initContractBal.minus(pricePerHit), "contractbal should lose 100%");
              done();
            })
            ;
          })
          .catch((err) => {
            done(err);
          });
      });
    });
  });


  describe('registerUser', function() {
    it("Should succeed", function(done) {
      userClientMicropayContract.registerUser({from: clientWallet2})
        .then(() => { done(); })
        .catch((err) => { done(err); })
    });
  });


  describe('getContract', function() {
    it("Should succeed for existing users", function(done) {
      userClientMicropayContract.getContract.call({from: clientWallet2})
        .then(() => { done(); })
        .catch((err) => { done(err); });

    });

    it("Should fail for non-existing users", function(done) {
      userClientMicropayContract.getContract.call({from: clientWallet3})
        .then(() => { done("getContract should fail"); })
        .catch((err) => { done(); });
    });
  });

});
