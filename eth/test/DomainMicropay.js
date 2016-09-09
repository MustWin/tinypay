contract('DomainMicropay', function(accounts) {

  var micropayWallet, clientWallet1, clientWallet2, contract;
  before(function(done) {
    micropayWallet = accounts[0];
    clientWallet1 = accounts[1];
    clientWallet2 = accounts[2];
    DomainMicropay.new({from: micropayWallet})
      .then((c) => {
        contract = c;
        done();
      })
      .catch((err) => { done("Contract initialization failed"); });
  });

  describe('signUp', function() {
    var unconfirmedDomain = "signup.unconfirmed.domain";
    var confirmedDomain = "signup.confirmed.domain";
    it("Should allow sign up if there is no existing account.", function(done) {
      contract.signUp(unconfirmedDomain, 100, {from: clientWallet1})
        .then(() => { done(); })
        .catch((err) => { done("Registration failed: " + err); });
    });

    it("Should not allow sign up if the domain is < 4 chars.", function(done) {
      contract.signUp("huh", clientWallet1)
        .then(() => { done("Registration was supposed to fail"); })
        .catch((err) => { done(); })
    });

    it("Should not allow sign up if there is an existing confirmed account.", function(done) {
      contract.signUp(confirmedDomain, 100, {from: clientWallet1})
        .then(() => {
          contract.confirmClient(confirmedDomain, clientWallet1, 100, {from: micropayWallet}).then(() => {
            contract.signUp(confirmedDomain, 200, {from: clientWallet1})
              .then(() => { done("Signup should have failed: " + err); })
              .catch((err) => {  done(); });
           })
          })
        .catch((err) => { done("Signup failed: " + err); });

    });

    it("Should allow sign up if there is an existing unconfirmed account.", function(done) {
      var newCost = 200
      contract.signUp(unconfirmedDomain, newCost, {from: clientWallet1})
        .then(() => {
          contract.confirmClient(unconfirmedDomain, clientWallet1, newCost, {from: micropayWallet})
            .then(() => {
              contract.getPaymentContractForDomain.call(unconfirmedDomain)
                .then((userClientMicropayContract) => {
                  UserClientMicropay.at(userClientMicropayContract).pricePerHit.call().then((contractCost) => {
                    assert.equal(contractCost, newCost);
                    done();
                  })
                })
                .catch((err) => {
                    done(err);
                });
            })
            .catch((err) => { done("Confirmation failed: " + err); });
        })
        .catch((err) => { done("Signup failed: " + err); });
    });
  });

  describe('confirmClient', function() {
    var unconfirmedDomain = "confirm.unconfirmed.domain";
    it("Should only allow creators wallet to call ConfirmClient.", function(done) {
      contract.signUp(unconfirmedDomain, 100, {from: clientWallet1})
        .then(() => {
          contract.confirmClient(unconfirmedDomain, clientWallet1, 100, {from: clientWallet1})
            .then(() => {
              done("confirmation should've failed");
            })
            .catch((err) => {
              done();
            });
          });
    });

    it("Should emit ClientConfirmed event when ConfirmClient succeeds.", function(done) {
      var clientConfirmations = contract.ClientConfirmed({fromBlock: "latest"});
      var watchFn = (err, conf) => {
        clientConfirmations.stopWatching(watchFn);
        if (err) {
          done(err);
        } else {
          done();
        }
      };
      clientConfirmations.watch(watchFn);
      contract.signUp(unconfirmedDomain, 100, {from: clientWallet1})
        .then(() => {
          contract.confirmClient(unconfirmedDomain, clientWallet1, 100, {from: micropayWallet})
            .catch((err) => {});
        });
    });
  });

  describe('getPaymentContractForDomain', function() {
    var unconfirmedDomain = "getPaymentContractForDomain.unconfirmed.domain";
    it("Should not return a contract from getPaymentContractForDomain until the client is confirmed.", function(done) {
      contract.signUp(unconfirmedDomain, 100, {from: clientWallet1})
        .then(() => {
          contract.getPaymentContractForDomain.call(unconfirmedDomain)
            .then((err) => {
              done("getPaymentContractForDomain should have failed")
            })
            .catch((err) => {
                done();
            });
        })
        .catch((err) => { done("Signup failed: " + err); });
    });

    it("Should return a contract from GetPaymentContractForDomain after the client is confirmed.", function(done) {
      contract.signUp(unconfirmedDomain, 100, {from: clientWallet1})
        .then(() => {
          contract.confirmClient(unconfirmedDomain, clientWallet1, 100, {from: micropayWallet})
            .then(() => {
              contract.getPaymentContractForDomain.call(unconfirmedDomain)
                .then((userClientMicropayContract) => {
                  UserClientMicropay.at(userClientMicropayContract).pricePerHit.call().then((contractCost) => {
                    done();
                  })
                })
                .catch((err) => {
                    done(err);
                });
            })
            .catch((err) => { done("Confirmation failed: " + err); });
        })
        .catch((err) => { done("Signup failed: " + err); });
    });
  });

/*
  describe('withdraw', function() {
    it("Should not allow anyone but micropayWallet to withdraw funds.", function(done) {
      assert.fail(1, 2, "write a test");
    });

    it("Should not allow overdrawing from the contract.", function(done) {
      assert.fail(1, 2, "write a test");
    });
  });
*/
});
