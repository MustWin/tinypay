#!/bin/bash

command -v solc >/dev/null 2>&1 || (echo "Missing 'solc' compiler, see README.md"; exit)
command -v abigen >/dev/null 2>&1 || (echo "Missing 'abigen' tool, see README.md"; exit)

#
# Make temp dir and delete on exit
#

TDIR=$(mktemp -d 2>/dev/null || mktemp -d -t 'mp')
trap "rm -rf $TDIR" EXIT

#
# Generate .abi files
#

cat eth/contracts/* | \
  sed -e 's/_$/_;/g' | \
  sed -e 's/import ".*";//g' | \
  sed -e '1s/^/pragma solidity ^0.4.0;/' | \
  solc --add-std -o $TDIR --abi

#
# Generate Go files from .abi files
#

for abifile in $TDIR/*.abi
do
  # bash trickery to build various names
  trunc=${abifile%.abi}
  typename=${trunc#$TDIR/}
  filename="oracles/src/oracles/gen_$(echo $typename | tr '[:upper:]' '[:lower:]').go"

  abigen --out ${filename} --pkg oracles --type ${typename} --abi $abifile
done