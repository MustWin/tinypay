'use strict';

var program = require('commander');

var fs = require('fs');
var path = require('path');

var pkg = require(path.join(__dirname, 'package.json'));
var lib = require(path.join(__dirname, 'oracles.js'));

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

var secretsFiles = [path.join(program.secrets, 'password.txt')];

secretsFiles.forEach(function (file) {
  fs.access(file, fs.F_OK, function (err) {
    if (err) {
      console.error('CANNOT READ: ', file, err);
      process.exit();
    }
  });
});

var wallet_password = new Buffer(fs.readFileSync(secretsFiles[0], 'utf8'), 'base64').toString('utf8');
var rpcUrl = 'http://' + program.rpchost + ':' + program.rpcport;

console.log('STARTING: ', rpcUrl);

//
// Main Entry Point... start watchers
//
lib.Oracles.startWatcher(rpcUrl, wallet_password);

//
// Prevent early exit while event watchers loop.
//
function tick() {
  process.stdout.write(".");
  setTimeout(tick, 11 * 1000);
}
tick();
