(function (global) {
  'use strict';
  var Oracles = (function () {

    var Web3 = require('web3');
    var web3 = new Web3();
    var moment = require('moment');
    var Promise = require('promise');
    var resolveTxt = Promise.denodeify(require('dns').resolveTxt);

    var DomainMicropay = require(require('path').join(__dirname, 'DomainMicropay.sol.js'));
    var contract = DomainMicropay.deployed();

    var password = '';
    var txtPrefix = 'tinypay-site-verification';
    var store = {};
    var eventOpts = function () {
      return {
        address: DomainMicropay.address,
        fromBlock: '0x0',
        toBlock: 'latest'
      };
    };
    var txnOpts = function () {
      return {
        from: web3.eth.coinbase
      };
    };

    function errFn(msgPrefix) {
      return function (err) {
        if (err.Error) {
          err = err.Error;
        }
        console.error(msgPrefix + ': ', err);
      }
    }

    function logFn(msgPrefix) {
      return function (data) {
        console.log(msgPrefix + ': ', data);
      }
    }

    function checkRecord(records) {
      while (records.length > 0) {
        var record = records.shift() || '';
        var s = record[0].split('=', 2);
        if (s[0] === txtPrefix) {
          return Promise.resolve(s[1]);
        }
      }
      return Promise.reject('TXT record not found');
    }

    function getBlockHashesUntil(lastHash, count) {
      var max = (count || 200) - 1;
      var key = lastHash + max;
      if (key in store) {
        console.log('use cached hashes');
        return store[key];
      }
      var hash = lastHash;
      var hashes = [hash];
      var b, ix;
      for (ix = 0; ix < 200; ix++) {
        b = web3.eth.getBlock(hash, false);
        hash = b.parentHash;
        hashes.push(hash);
      }
      store[key] = hashes;
      return hashes;
    }

    function verifyHash(eventData) {
      var hashes = getBlockHashesUntil(eventData.blockHash);
      return function (got) {
        for (var ix in hashes) {
          if (hashes[ix] === got) {
            return Promise.resolve(got);
          }
        }
        return Promise.reject('incorrect TXT value ' + txtPrefix + '=' + got);
      };
    }

    function notifySuccess(eventData) {
      return function (hash) {
        if (web3.personal.unlockAccount(web3.eth.coinbase, password)) {
          return Promise.resolve(contract.confirmClient(
            eventData.args.domain,
            eventData.args.client,
            eventData.args._pricePerHit, txnOpts()
          ).then(
            logFn('\nsent confirmClient transaction for "' + eventData.args.domain + '"'),
            errFn('\nerror sending confirmClient transaction for "' + eventData.args.domain + '"')
          ));
        }
        return Promise.reject('unable to unlock account');
      };
    }

    function retryLaterMaybe(eventData, until) {
      return function (err) {
        if (until.isBefore(moment())) {
          console.log('giving up verification; domain: "' + eventData.args.domain + '". timed out and: ', err);
          return;
        }

        if (err.Error) {
          err = err.Error;
        }
        console.log('still waiting for domain "' + eventData.args.domain + '" to be set up... will give up ' + until.fromNow() + '\nDetails: ', err);

        setTimeout(function () {
          checkDomain(eventData, until);
        }, 37 * 1000);
      };
    }

    function checkDomain(eventData, until) {
      resolveTxt(eventData.args.domain)
        .then(checkRecord)
        .then(verifyHash(eventData))
        .then(notifySuccess(eventData))
        .catch(retryLaterMaybe(eventData, until));
    }

    function beginDomainVerification(eventData) {
      return function (blockAddress) {
        if (blockAddress.length < 10) {
          // blockAddress '0x' or something shorter than a full address
          // indicates that the domain has not yet been verified.
          checkDomain(eventData, moment().add(60, 'minutes'));
        }
        // else already confirmed
      }
    }

    function onClientCreated(err, eventData) {
      if (err) {
        console.error('onClientCreated: ', err);
        return;
      }
      console.log('ClientCreated: ', eventData.args.domain, eventData.transactionHash);
      contract.getPaymentContractForDomain
        .call(eventData.args.domain)
        .then(beginDomainVerification(eventData))
        .catch(errFn('Unhandled Error: '));
    }

    function onClientConfirmed(err, eventData) {
      if (err) {
        console.error('onClientConfirmed: ', err);
        return;
      }
      console.log('ClientConfirmed: ', eventData.args.domain, eventData.transactionHash);
    }

    return {
      startWatcher: function (rpcUrl, unlockPass) {
        password = unlockPass || password;

        web3.setProvider(new web3.providers.HttpProvider(rpcUrl));
        DomainMicropay.setProvider(web3.currentProvider);

        contract.ClientCreated({}, eventOpts(), onClientCreated);
        contract.ClientConfirmed({}, eventOpts(), onClientConfirmed);
      }
    };

  })();
  global.Oracles = Oracles;
})(this);
