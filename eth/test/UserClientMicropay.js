contract('UserClientMicropay', function(accounts) {

  var micropayWallet, clientWallet1, clientWallet2, userClientMicropayContract, pricePerHit;
  before(function(done) {
    micropayWallet = accounts[0];
    clientWallet1 = accounts[1];
    clientWallet2 = accounts[2];
    clientWallet3 = accounts[3];
    pricePerHit = 100;
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
        var count = 0
          , promiseCount = 3;
        var finish = function() {
          count++;
          if (count == promiseCount) {
            cb();
          }
        };
        web3.eth.getBalance(micropayWallet).then((mpVal) => { micropayBal = mpVal; finish(); });
        web3.eth.getBalance(userClientMicropayContract).then((ucmBal) => { contractBal = ucmBal; finish(); });
        web3.eth.getBalance(clientWallet1).then((cBal) => { clientBal = cBal; finish(); })
      };
      getBalances(() => {
        userClientMicropayContract.withdraw(100, {from: micropayWallet})
          .then(() => {
            var initMicropayBal = micropayBal
              , initContractBal = contractBal
              , initClientBal = clientBal;
            getBalances(() => {
              assert.equal(micropayBal, initMicropayBal + 1, "micropayBal should get 1%");
              assert.equal(clientBal, initClientBal + 99, "clientBal should get 99%");
              assert.equal(contractBal, initContractBal - 100, "contractbal should lose 100%");
              done();
            })
            ;
          })
          .catch((err) => { done(err); });
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
