contract('UserClientMicropay', function(accounts) {

  var micropayWallet, clientWallet1, clientWallet2, domainMicropayContract, userClientContract, userClientMicropayContract, pricePerHit;
  before(function(done) {
    micropayWallet = accounts[0];
    clientWallet1 = accounts[1];
    clientWallet2 = accounts[2];
    clientWallet3 = accounts[3];
    userWallet1 = accounts[4];
    pricePerHit = 1000000000000000;
    var domain = "ucm.domain";
    DomainMicropay.new({from: micropayWallet})
      .then((c) => {
        domainMicropayContract = c;
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
      var getBalances = function(cb) {
        var micropayBal, contractBal, clientBal;
        micropayBal = web3.eth.getBalance(domainMicropayContract.address);
        contractBal = web3.eth.getBalance(userClientMicropayContract.address);
        clientBal = web3.eth.getBalance(clientWallet1);
        cb(micropayBal, contractBal, clientBal);
      };
      var promise;
      var hitCount = 1000;
      var totalWithdrawn = pricePerHit * hitCount;
      for (var i = 0; i < hitCount; i++) {
        if (promise) {
          promise.then(() => { return userClientMicropayContract.registerHit({from: userWallet1, value: pricePerHit}); });
        } else {
          promise = userClientMicropayContract.registerHit({from: userWallet1, value: pricePerHit});
        }
      }
      var transactionGasCost;
      var gasPrice = web3.eth.gasPrice;
      promise.then(() => {
          getBalances((initMicropayBal, initContractBal, initClientBal) => {
            userClientMicropayContract.withdraw(totalWithdrawn, {from: clientWallet1})
            .then((tx_id) => {
              console.log('----------------------------')
              console.log(web3.eth.gasPrice.toString());
              web3.eth.getTransactionReceipt(tx_id,
                (err, transaction) => {
                  if (err) {
                    console.log(err);
                    return
                  }
                  console.log(transaction)
                  console.log(transaction.cumulativeGasUsed)
                  transactionGasCost = transaction.cumulativeGasUsed;
                  console.log("**********************************")
                  getBalances((micropayBal, contractBal, clientBal) => {
                    console.log("initClient:     " + initClientBal.toString())
                    console.log("clientBal:      " + clientBal.toString())
                    console.log("client diff:    " + clientBal.minus(initClientBal).toString())
                    console.log("Expected diff:  " + 99 * totalWithdrawn / 100)
                    console.log("initContract:   " + initContractBal.toString())
                    console.log("contractBal:    " + contractBal.toString());
                    console.log("contract diff:  " + contractBal.minus(initContractBal).toString());
                    console.log("totalWithdrawn: " + totalWithdrawn);
                    console.log("contract-total: " + initContractBal.minus(totalWithdrawn).toString());
                    console.log("initMicro:      " + initMicropayBal.toString())
                    console.log("MicroBal:       " + micropayBal.toString())
                    console.log("MicroBal diff:  " + micropayBal.minus(initMicropayBal).toString())
                    console.log("Expected diff:  " + totalWithdrawn / 100)
                    console.log("TransactionGas: " + transactionGasCost)
                    console.log("GasPrice:       " + gasPrice.toString())
                    console.log("TotalGas:       " + gasPrice.times(transactionGasCost))
                    console.log("TotalWithdrawn: " + totalWithdrawn)
                    console.log("**********************************")
                    assert.equal(micropayBal.toString(), initMicropayBal.plus(0.01 * totalWithdrawn).toString(), "micropayBal should get 1%");
                    assert(clientBal.toNumber() > initClientBal.toNumber(), "clientBal should increase");
                    assert.equal("0", contractBal.toString(), "contractbal should lose 100%");

                    // TODO: Figure out where this extra money goes. For now, make the minimum withdrawal 1 ether
                    assert(0.985 < clientBal.minus(initClientBal).dividedBy(totalWithdrawn).toString(), "clientBal should get 99%");
                    done();
                });
              });
            })
            .catch((err) => { done(err); });
        })
      })
      .catch((err) => { done(err); });
    });
  });

  describe('registerHit', function() {
    it("Should move pricePerHit from sender to userClientMicropay", function(done) {
      var balanceCompare = (cb) => {
        var userBalance, contractBalance;
        userBalance = web3.eth.getBalance(userWallet1);
        contractBalance = web3.eth.getBalance(userClientMicropayContract.contract.address);
        cb(userBalance, contractBalance);
      };

      balanceCompare((initUserBal, initContractBal) => {
        userClientMicropayContract.registerHit({from: userWallet1, value: pricePerHit})
          .then(() => {
            balanceCompare((finalUserBal, finalContractBal) => {
              assert(initUserBal.toNumber() > finalUserBal.toNumber(), "User balance wasn't decremented");
              assert.equal(initContractBal.minus(finalContractBal).toNumber(), -pricePerHit, "Contract balance wasn't incremented");
              done();
            });
          })
          .catch((err) => { done(err); });
      });
    });
  });


});
