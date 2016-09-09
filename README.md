# Micropay


## Required reading

* [Newb Intro](https://medium.com/@ConsenSys/a-101-noob-intro-to-programming-smart-contracts-on-ethereum-695d15c1dab4#.9bb4syvvq)
* [Solidity docs](https://solidity.readthedocs.io/en/latest/introduction-to-smart-contracts.html)
* [Truffle Docs](http://truffle.readthedocs.io/en/latest/)
* [Punch Docs](http://laktek.github.io/punch/)
* [Metamask development with Truffle](https://blog.metamask.io/developing-for-metamask-with-truffle/)

## Dev environment

1. Install [Metamask](https://metamask.io/)
2. Install [Truffle](http://truffle.readthedocs.io/en/latest/getting_started/installation/)
3. Install [testrpc](https://github.com/ethereumjs/testrpc) `npm install -g ethereumjs-testrpc`
4. Install [punch](http://laktek.github.io/punch/)

The `oracles` sub-project is built with [Go](https://golang.org), and expects that the project is checked out in a valid `GOPATH`, for example: `go get github.com/MustWin/micropay/...`

[Browser-solidity](https://ethereum.github.io/browser-solidity/) may also be useful for compiling/editing contracts
