MP.Add(function() {
  MP.Capabilities = Backbone.Model.extend({
    initialize: function() {
      this.startTime = Date.now();
      this.web3Poll();
    },
    hasWeb3: function() {
      return window.web3 && window.web3.eth && window.web3.eth.getAccounts;
    },
    web3Poll: function() {
      // Try for 30 seconds
      if (this.hasWeb3()) {
        this.set({enabled: true}); // emits event
      } else if (Date.now() - this.startTime < 30000) {
        setTimeout(this.web3Poll, 10);
      }
    }
  });
});
