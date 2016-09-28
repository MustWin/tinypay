MP.Add(function() {
  MP.Capabilities = Backbone.Model.extend({
    initialize: function() {
      this.startTime = Date.now();
      this.web3Poll();
    },
    hasWeb3: function() {
      try {
        return window.web3 && web3.eth && web3.eth.accounts && !!web3.eth.accounts.length;
      } catch(e) {
        return false;
      }
    },
    web3Poll: function() {
      // Try for 30 seconds
      if (this.hasWeb3()) {
        this.set({enabled: true}); // emits event
        this.getNetwork();
      } else if (Date.now() - this.startTime < 30000) {
        setTimeout(this.web3Poll, 10);
      }
    },
    getNetwork: function() {
      web3.eth.getBlock(0, function(err, block) {
        if (err) {
          console.log(err);
          return;
        }
        if (block.hash == "0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3") {
          this.set({network: "main"});
        } else if (block.hash == "0x0cd786a2425d16f152c658316c423e6ce1181e15c3295826d7c9904cba9ce303") {
          this.set({network: "test"});
        } else {
          this.set({network: "private"});
        }
      });
    }
  });
});
