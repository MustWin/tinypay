# Micropay


## Required reading

* [Newb Intro](https://medium.com/@ConsenSys/a-101-noob-intro-to-programming-smart-contracts-on-ethereum-695d15c1dab4#.9bb4syvvq)
* [Solidity docs](https://solidity.readthedocs.io/en/latest/introduction-to-smart-contracts.html)
* [Truffle Docs](http://truffle.readthedocs.io/en/latest/)
* [Punch Docs](http://laktek.github.io/punch/)
* [Metamask development with Truffle](https://blog.metamask.io/developing-for-metamask-with-truffle/)

## Dev environment

1. Install [Metamask](https://metamask.io/) Browser Plugin

2. Install [Truffle](http://truffle.readthedocs.io/en/latest/getting_started/installation/)
`npm install -g truffle`

3. Install [testrpc](https://github.com/ethereumjs/testrpc) 
`npm install -g ethereumjs-testrpc`

4. Install [punch](http://laktek.github.io/punch/)

[Browser-solidity](https://ethereum.github.io/browser-solidity/) may also be useful for compiling/editing contracts


## Deployment on Google Container Engine

1. Make sure you have permissions on our GCE account on the tinypay project
2. [Download](https://cloud.google.com/sdk/downloads) and Install GCE SDK
3. `gcloud init`, use `us-central-1b` when asked
4. `gcloud components install kubectl`
5. `gcloud container clusters get-credentials tinypay --zone us-central1-b --project tinypay-143322`

Now you can use the kubernetes consul:
`kubectl proxy`

Or you can run deploymnents: (TODO: there is probably a better feature for this)
`kubectl delete pod web; kubectl create -f web_pod.yaml`
