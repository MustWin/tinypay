When you're ready to collect money from your contract, it's as easy as calling the `withdraw` function on your contract. This can be done super easily from the [Withdraw](/withdraw) page.

For advanced users, any Ethereum client (typically a web3 enabled browser) using the wallet you used to setup the contract can withdraw funds by doing something like the below. 99% of the contract balance will go to your wallet, and 1% will go to Tinypay.
```
var myUserClientMicropayAddress = "0xblahblah";
web3.eth.getBalance(myUserClientMicropayAddress)
  .then(function(balance) {
      return UserClientMicropay.at(myUserClientMicropayAddress).withdraw(balance);
  })
  .catch(function(err) {
    console.log(err);
  });
```
