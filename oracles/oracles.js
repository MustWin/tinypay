(function (global) {
  'use strict';
  var Oracles = (function () {

    var Web3 = require('web3');
    var web3 = new Web3();

    var Promise = require('promise');

    var moment = require('moment');
    var path = require('path');

    var DomainMicropay = require(path.join(__dirname, 'DomainMicropay.sol.js'));

    var contract = DomainMicropay.deployed();

    var password = '';
    var eventOpts = {
      address: DomainMicropay.address,
      fromBlock: '0x0',
      toBlock: 'latest'
    };
    var txnOpts = function () {
      return {
        from: web3.eth.coinbase
      };
    };

    function errFn(msgPrefix) {
      return function (err) {
        console.error(msgPrefix + ': ', err);
      }
    }

    function logFn(msgPrefix) {
      return function (data) {
        console.log(msgPrefix + ': ', data);
      }
    }

    function domainIsSetUp(eventData) {
      return !!(eventData.args.domain && eventData.args.confirmationHash);
    }

    function notifyBlockChain(eventData) {
      if (web3.personal.unlockAccount(web3.eth.coinbase, password)) {
        contract.confirmClient(
          eventData.args.domain,
          eventData.args.client,
          eventData.args._pricePerHit, txnOpts()
        ).then(
          logFn('\nsent confirmClient transaction for "' + eventData.args.domain + '"'),
          errFn('\nerror sending confirmClient transaction for "' + eventData.args.domain + '"')
        );
      }
    }

    function checkDomain(eventData, until) {
      if (domainIsSetUp(eventData)) {
        notifyBlockChain(eventData);
        return;
      }

      if (until.isBefore(moment())) {
        console.error('giving up on verification of client domain "' + eventData.args.domain + '"');
        return;
      }

      console.log('client domain "' + eventData.args.domain + '" not yet set up.  trying again ' + until.fromNow());

      setTimeout(function () {
        checkDomain(eventData, until);
      }, 37 * 1000);
    }

    function beginDomainVerification(eventData) {
      return function (blockAddress) {
        if (blockAddress.length < 10) {
          // blockAddress '0x' or something shorter than a full address
          // indicates that the domain has not yet been verified.
          checkDomain(eventData, moment().add(60, 'seconds'));
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
      console.log('verification hash: ', eventData.args.confirmationHash);
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

        contract.ClientCreated({}, eventOpts, onClientCreated);
        contract.ClientConfirmed({}, eventOpts, onClientConfirmed);
      }
    };

  })();
  global.Oracles = Oracles;
})(this);
