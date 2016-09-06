contract('UserClientMicropay', function(accounts) {

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
      /*...*/
  })

  describe('withdraw', function() {
    it("Should only be callable by micropayWallet and the client", function() {
      assert.fail(1, 2, "write a test");
    });

    it("should give micropayWallet 1% and the client 99%", function() {
      assert.fail(1, 2, "write a test");
    });
  });


  describe('registerUser', function() {
    it("Should succeed", function() {
      assert.fail(1, 2, "write a test");
    });
  });


  describe('getContract', function() {
    it("Should succeed for existing users", function() {
      assert.fail(1, 2, "write a test");
    });
    
    it("Should fail for non-existing users", function() {
      assert.fail(1, 2, "write a test");
    });
  });

});
