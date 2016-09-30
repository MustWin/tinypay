(function (global) {
  'use strict';
  global.Oracles = (function () {
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
    var eventOpts = function () { return {address: DomainMicropay.address, fromBlock: '0x0', toBlock: 'latest'}; };
    var txnOpts = function () { return {from: web3.eth.coinbase}; };

    function logFn(msgPrefix) {
      return function (data) {
        console.log(msgPrefix + ': ', data);
        Promise.resolve(data);
      }
    }

    function errFn(msgPrefix) {
      return function (err) {
        if (err.Error) { err = err.Error; }
        console.error(msgPrefix + ': ', err);
        Promise.reject(err);
      }
    }

    function checkRecord(records) {
      while (records.length > 0) {
        var record = records.shift() || '';
        var s = record[0].split('=', 2);
        if (s[0] === txtPrefix) { return Promise.resolve(s[1]); }
      }
      return Promise.reject('TXT record not found');
    }

    function getBlockHashesUntil(lastHash, count) {
      var max = (count || 200) - 1;
      var key = lastHash + max;
      if (!(key in store)) {
        var hash = lastHash;
        var hashes = [hash];
        for (var ix = 0; ix < max; ix++) {
          hash = web3.eth.getBlock(hash, false).parentHash;
          hashes.push(hash);
        }
        store[key] = hashes;
      }
      return store[key];
    }

    function verifyHash(eventData) {
      var hashes = getBlockHashesUntil(eventData.blockHash);
      return function (got) {
        for (var ix in hashes) { if (hashes[ix] === got) { return Promise.resolve(got); } }
        return Promise.reject('incorrect TXT value ' + txtPrefix + '=' + got);
      };
    }

    function notifySuccess(eventData) {
      var args = eventData.args;
      return function () {
        if (web3.personal.unlockAccount(web3.eth.coinbase, password)) {
          return Promise.resolve(
            contract.confirmClient(args.domain, args.client, args._pricePerHit, txnOpts())
              .then(
                logFn('\nsent confirmClient transaction for "' + args.domain + '"'),
                errFn('\nerror sending confirmClient transaction for "' + args.domain + '"')
              ));
        }
        return Promise.reject('unable to unlock account');
      };
    }

    function retryLaterMaybe(eventData, until) {
      return function (err) {
        if (until.isBefore(moment())) {
          console.log('\tgiving up verification; domain: "' + eventData.args.domain + '". timed out and: ', err);
          return;
        }
        if (err.Error) {
          err = err.Error;
        }

        console.log(
          '\tstill waiting for domain "' + eventData.args.domain + '" to be set up... will give up ' + until.fromNow() +
          '\n\tDetails: ', err);

        setTimeout(function () { checkDomain(eventData, until); }, 37 * 1000);
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
          checkDomain(eventData, moment().add(60, 'minutes'));
        }
      }
    }

    return {
      startWatcher: function (rpcUrl, unlockPass) {
        password = unlockPass || password;

        web3.setProvider(new web3.providers.HttpProvider(rpcUrl));
        DomainMicropay.setProvider(web3.currentProvider);

        contract.ClientConfirmed({}, eventOpts(), function (err, data) {
          if (err) {
            console.log('Error ClientConfirmed: ', err);
            Promise.reject(err);
          }
          console.log('Event ClientConfirmed: ', data.args.domain);
          Promise.resolve(data);
        });

        contract.ClientCreated({}, eventOpts(), function (err, data) {
          if (err) {
            console.log('Error ClientCreated: ', err);
            Promise.reject(err);
          }
          console.log('Event ClientCreated: ', data.args.domain);
          contract.getPaymentContractForDomain
            .call(data.args.domain)
            .then(beginDomainVerification(data))
            .catch(errFn('Unhandled Error: '));
        });
      }
    };
  })();
})(this);
