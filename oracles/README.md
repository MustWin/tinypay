## Oracles

### Development

This project uses [gb](getgb.io) to build the Oracles artifacts.

To build this project first make sure you have [Go](golang.org) installed, then install [gb](getgb.io) with: `go get github.com/constabulary/gb`

Additionally you should have the [`solc`](http://solidity.readthedocs.io/en/develop/installing-solidity.html) compiler and the [`abigen`](https://github.com/ethereum/go-ethereum/wiki/Native-DApps:-Go-bindings-to-Ethereum-contracts#go-binding-generator) code generator installed.

Once those have been installed use `make` to build the library and binaries, which will appear in the `pkg` and `bin` folders respectively.
