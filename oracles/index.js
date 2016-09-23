#!/usr/bin/env node

var Web3 = require('web3');
var web3 = new Web3();

var program = require('commander');

var path = require('path');
var fs = require('fs');

var pkg = require(path.join(__dirname, 'package.json'));
var DomainMicropay = require(path.join(__dirname, './DomainMicropay.sol.js'));

program
  .version(pkg.version)
  .option('--secrets <directory>', 'directory containing secrets')
  .option('--rpchost <host>', 'RPC host to connect to')
  .option('--rpcport <port>', 'RPC port to connect to')
  .parse(process.argv);

if (program.rpchost === undefined) {
  program.rpchost = 'localhost';
}
if (program.rpcport === undefined) {
  program.rpcport = 8545;
}
if (program.secrets === undefined) {
  program.secrets = '/var/local/secrets'
}

var secretsFiles = [
  path.join(program.secrets, 'password.txt'),
];

secretsFiles.forEach(function (file) {
  fs.access(file, fs.F_OK, function (err) {
    if (err) {
      console.error('CANNOT READ: ', file, err);
      process.exit();
    }
  });
});

var opts = {
  wallet_password: new Buffer(fs.readFileSync(secretsFiles[0], 'utf8'), 'base64').toString('utf8'),
  rpc_host: program.rpchost,
  rpc_port: program.rpcport
};

// Connect
var provider = new web3.providers.HttpProvider('http://' + opts.rpc_host + ':' + opts.rpc_port);
web3.setProvider(provider);
if (!web3.isConnected()) {
  console.log('Not Connected');
  process.exit();
}
DomainMicropay.setProvider(web3.currentProvider);

console.log('Begin watching for ClientCreated events');

// Initialize to point to deployed contract
var contract = DomainMicropay.deployed();

// helper functions
var clientDomainIsVerified = function (domain, confirmationHash) {
  //TODO: implement domain lookup.
  return true;
};

var doDomainVerification = function (domain, client, price, cfHash) {
  return function () {
    if (clientDomainIsVerified(domain, cfHash)) {
      console.log('sending confirmation: ', domain);
      if (web3.personal.unlockAccount(web3.eth.coinbase, opts.wallet_password)) {
        contract.confirmClient(domain, client, price, {
          from: web3.eth.coinbase
        }).then(function (res) {
          console.log('confirmClient transaction successfully sent: ', domain, res);
        }, function (err) {
          console.error('Error sending confirmClient transaction: ', domain, err);
        });
      }
    } else {
      console.log('cannot confirm client yet: ', domain);
    }
  }
};

// First watch for confirmation events
var ClientConfirmed = contract.ClientConfirmed({}, {
  fromBlock: '0',
  toBlock: 'latest'
}, function (error, result) {
  if (error) {
    console.error('ERROR: ', error);
  } else {
    console.log('Client Confirmed: ', result.args.domain);
  }
});

// Then watch for created events and perform the 'oracle'
var ClientCreated = contract.ClientCreated({}, {
  fromBlock: '0',
  toBlock: 'latest'
}, function (error, result) {
  if (error) {
    console.error('ERROR: ', error);
  } else {
    var domain = result.args.domain;
    var client = result.args.client;
    var price = result.args._pricePerHit;
    var cfHash = result.args.confirmationHash;
    contract.getPaymentContractForDomain.call(domain).then(function (addr) {
      if (addr === '0x') {
        doDomainVerification(domain, client, price, cfHash)();
      } else {
        console.log('client already confirmed: ', domain, addr);
      }
    }).catch(doDomainVerification(domain, client, price, cfHash));
  }
});

var intCounter = 0;

//
// Handle interrupt signals
//
process.on('SIGINT', function () {
  intCounter++;
  console.log('Interrupt ' + (3 - intCounter) + ' more times to forcefully quit.');
  if (intCounter > 2) {
    process.exit();
  }
});
