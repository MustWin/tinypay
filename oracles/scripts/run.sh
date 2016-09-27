#!/bin/bash

node index.js \
  --rpchost=${ETHEREUM_SERVICE_HOST:-localhost} \
  --rpcport=${ETHEREUM_SERVICE_PORT:-8545} \
  --secrets=${ETHEREUM_SECRETS_DIR:-.}
