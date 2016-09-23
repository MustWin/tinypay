'use strict';

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
  program.secrets = '/var/local/secrets';
}

var secretsFiles = [
  path.join(program.secrets, 'password.txt')
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
var confirmClient = function (args) {
  console.log('sending confirmation: ', args.domain);
  if (web3.personal.unlockAccount(web3.eth.coinbase, opts.wallet_password)) {
    contract.confirmClient(args.domain, args.client, args._pricePerHit, {
      from: web3.eth.coinbase
    }).then(function (res) {
      console.log('"confirmClient" transaction successfully sent: ', args.domain, res);
    }, function (err) {
      console.error('Error sending "confirmClient" transaction: ', args.domain, err);
    });
  }
};

var quitChecking = function (args) {
  console.error('updated TXT record not found before timeout; cancelling check: ', args.domain);
};

var clientDomainHasTXTRecord = function (domain, key) {
  return !(!domain || !key);

};

var verifyClientDomain = function (args, onSuccess, onTimeout, expiration) {
  if (clientDomainHasTXTRecord(args.domain, args.confirmationHash)) {
    (onSuccess || confirmClient)(args);
    return;
  }
  if (!expiration) {
    // set expiration to one hour from now by default
    expiration = new Date(new Date().getTime() + 60 * 60 * 1000);
  }
  if (expiration < new Date()) {
    (onTimeout || quitChecking())(args);
    return;
  }

  // keep checking every 30 seconds
  setTimeout(function () {
    verifyClientDomain(args, onSuccess, onTimeout, expiration)
  }, 30 * 1000);
};

// First watch for confirmation events
contract.ClientConfirmed({}, {
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
contract.ClientCreated({}, {
  fromBlock: '0',
  toBlock: 'latest'
}, function (error, result) {
  if (error) {
    console.error('ERROR: ', error);
  } else {
    contract.getPaymentContractForDomain.call(result.args.domain).then(function (addr) {
      if (addr === '0x') {
        verifyClientDomain(result.args);
      } else {
        console.log('client already confirmed: ', result.args.domain, addr);
      }
    });
  }
});

var intCounter = 0;

//
// Handle interrupt signals
//
process.on('SIGINT', function () {
  intCounter += 1;
  console.log('Interrupt ' + (3 - intCounter) + ' more times to forcefully quit.');
  if (intCounter > 2) {
    process.exit();
  }
});
