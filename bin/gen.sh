#!/bin/bash

command -v solc >/dev/null 2>&1 || (echo "Missing 'solc' compiler, see README.md"; exit)

#
# Make temp dir and delete on exit
#

TDIR=$(mktemp -d 2>/dev/null || mktemp -d -t 'mp')
trap "rm -rf $TDIR" EXIT

#
# Generate .abi files
#

pushd $(dirname $(dirname $0))
trap "popd" EXIT

echo "Compile contracts..."
cat eth/contracts/* | \
  sed -e 's/_$/_;/g' | \
  sed -e 's/import ".*";//g' | \
  sed -e '1s/^/pragma solidity ^0.4.0;/' | \
  solc --add-std -o $TDIR --abi --optimize --bin
echo "Done."

#
# Generate JSON files from .sol files
#

echo "Generate JSON bindings..."
cat eth/contracts/* | \
  sed -e 's/_$/_;/g' | \
  sed -e 's/import ".*";//g' | \
  sed -e '1s/^/pragma solidity ^0.4.0;/' | \
  solc --combined-json abi,bin 2> /dev/null | jq .contracts  >| oracles/gen_contracts.json
echo "Done."

