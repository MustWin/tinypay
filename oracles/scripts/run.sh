#!/bin/bash

node index.js \
  --rpchost=${ETHEREUM_SERVICE_HOST:-localhost} \
  --secrets=${ETHEREUM_SECRETS_DIR:-.}
