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
  })

  describe('signUp', function() {
    it("Should allow sign up if there is no existing account.", function(done) {
      contract.signUp("my.fake.domain", 100, {from: clientWallet1})
        .then(() => { done(); })
        .catch((err) => { done("Registration failed: " + err); });
    });

    it("Should not allow sign up if the domain is < 4 chars.", function() {
      contract.signUp("huh", clientWallet1)
        .then(() => { done("Registration was supposed to fail"); })
        .catch((err) => { done(); })
    });

    it("Should not allow sign up if there is an existing confirmed account.", function() {
      assert.fail(1, 2, "write a test");
    });

    it("Should allow sign up if there is an existing unconfirmed account.", function() {
      assert.fail(1, 2, "write a test");
    });
  });

  describe('ConfirmClient', function() {
    it("Should only allow creators wallet to call ConfirmClient.", function() {
      assert.fail(1, 2, "write a test");
    });

    it("Should emit ClientConfirmed event when ConfirmClient succeeds.", function() {
      assert.fail(1, 2, "write a test");
    });
  });

  describe('getPaymentContractForDomain', function() {
    it("Should not return a contract from GetPaymentContractForDomain until the client is confirmed.", function() {
      assert.fail(1, 2, "write a test");
    });

    it("Should return a contract from GetPaymentContractForDomain after the client is confirmed.", function() {
      assert.fail(1, 2, "write a test");
    });
  });


  describe('withdraw', function() {
    it("Should not allow anyone but micropayWallet to withdraw funds.", function() {
      assert.fail(1, 2, "write a test");
    });

    it("Should not allow overdrawing from the contract.", function() {
      assert.fail(1, 2, "write a test");
    });
  });

});
