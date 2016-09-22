#!/usr/bin/env node

var Web3 = require('web3');
var web3 = new Web3();

var program = require('commander');

var path = require('path');
var fs = require('fs');

var pkg = require(path.join(__dirname, 'package.json'));
var contracts = require(path.join(__dirname, 'gen_contracts.json'));

program
  .version(pkg.version)
  .option('--secrets <directory>', 'directory containing secrets')
  .option('--rpchost <host>', 'RPC host to connect to')
  .option('--rpcport <port>', 'RPC port to connect to')
  .option('--interval <seconds>', 'polling frequency')
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
  path.join(program.secrets, 'domainmicropay.txt')
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
  contract_address: new Buffer(fs.readFileSync(secretsFiles[1], 'utf8'), 'base64').toString('utf8'),
  rpc_host: program.rpchost,
  rpc_port: program.rpcport,
  check_interval: (program.interval || 10) * 1000
};

// Connect
console.log('Connecting to rpc host: ' + opts.rpc_host + ':' + opts.rpc_port);
web3.setProvider(new web3.providers.HttpProvider('http://' + opts.rpc_host + ':' + opts.rpc_port));

if (!web3.isConnected()) {
  console.error('Not connected');
  process.exit();
}

var cb = web3.eth.coinbase;
console.log('Coinbase: ', cb);

// Unlock
if (!web3.personal.unlockAccount(cb, opts.wallet_password)) {
  console.error('Could not unlock');
  process.exit();
}

function runLoop(o) {
  var filter = web3.eth.filter({
    address: o.contract_address
  });
  filter.watch(function (err, results) {
    if (err) {
      console.log('WATCH ERROR: ', err);
      process.exit();
    }
    console.debug(results);
  });
}

if (!opts.contract_address) {
  var dmC = web3.eth.contract(JSON.parse(contracts.DomainMicropay.abi));
  var x = {
    from: cb,
    data: contracts.DomainMicropay.bin,
    gas: 1000000
  };
  dmC.new(x, function (err, resp) {
    if (err) {
      console.error('Loading contract', err);
      process.exit();
    }
    var addr = resp.address;
    if (!addr) {
      console.log('Pending tx: ', resp.transactionHash);
    } else {
      console.log('Deployed Address: ', addr);
      opts.contract_address = addr;
      runLoop(opts);
    }
  });
} else {
  runLoop(opts);
}

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
