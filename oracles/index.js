#!/usr/bin/env node

var path = require('path');
var pkg = require(path.join(__dirname, 'package.json'));
var program = require('commander');

var rpc = require('json-rpc2');
var ABI = require('ethereumjs-abi');

program
  .version(pkg.version)
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

var opts = {
  rpc_port: program.rpcport,
  rpc_host: program.rpchost,
  check_interval: (program.interval || 10) * 1000,
};

console.log('Connecting to rpc host: ' + program.rpchost + ':' + program.rpcport);

var client = rpc.Client.$create(opts.rpc_port, opts.rpc_host);

function confirmClient(sender, domain, clientAddr, price) {
  var data =
    ABI.methodID('confirmClient', ['string', 'address', 'uint256']).toString('hex') +
    ABI.rawEncode(['string', 'address', 'uint256'], [domain, clientAddr, price]).toString('hex');

  // TODO: not sure about the address parameters here... need to double
  // and triple check sender, receiver, contract, etc. addresses.
  client.call('eth_sendTransaction', [{
    from: sender,
    to: clientAddr,
    data: data
  }], function (err, result) {
    if (err) {
      console.error('problem confirming client: ', err);
      return;
    }
    console.log('success confirming client: ', result);
  });
  // TODO: make this synchronous maybe so we can return a meaningful
  // value, or else rethink the signalling of success.
  return true;
}

function verifyDomain(domain, hash) {
  // TODO: lookup domain TXT record and verify hash
  return true;
}

//
// ClientCreated event handler
//
function handleClientCreated(ev) {
  var data = ABI.rawDecode(['string', 'address', 'uint256', 'bytes32', 'address'], new Buffer(ev.data.slice(2), 'hex'));

  var x_domain = data[0];
  var x_client = '0x' + data[1].toString('hex');
  var x_priceh = data[2];
  var x_cfHash = data[3].toString('hex');
  var x_ctAddr = '0x' + data[4].toString('hex');

  console.log('ClientCreated: ' + x_domain);
  console.log('     confHash: ' + x_cfHash);
  console.log('       client: ' + x_client);
  console.log(' contractAddr: ' + x_ctAddr);

  if (verifyDomain(x_domain, x_cfHash)) {
    if (confirmClient(ev.address, x_domain, x_ctAddr, x_priceh)) {
      console.log('Client Confirmed!');
    }
  }
}

//
// polling loop function
//
function pollForEvents(filterId) {
  client.call('eth_getFilterChanges', [filterId], function (err, result) {
    if (err) {
      console.error('error: ' + err);
    }
    console.log(result.length + ' results');
    for (var i in result) {
      var ev = result[i];
      if (ev.topics[0] !== ('0x' + ABI.eventID('ClientCreated', ['string', 'address', 'uint256', 'bytes32', 'address']).toString('hex'))) {
        continue;
      }
      handleClientCreated(ev);
    }
  });
}

var intCounter = 0;
var eventId;

//
// Set up filter and initiate loop
//
client.call('eth_newFilter', [{}], function (err, result) {
  if (err) {
    throw err;
  }
  eventId = result;
  setInterval(pollForEvents, opts.check_interval, result);
});

//
// Handle interrupt signals
//
process.on('SIGINT', function () {
  intCounter++;
  console.log('Interrupt ' + (3 - intCounter) + ' more times to forcefully quit.');
  if (intCounter > 3) {
    process.exit();
  }
  if ((intCounter === 1) && (eventId !== undefined)) {
    console.log('Cleaning up. Removing filter.');
    client.call('eth_uninstallFilter', [{
      eventId
    }], function (err, result) {
      if (err) {
        console.error('error on cleanup: ' + err);
      }
      process.exit();
    });
  }
});
