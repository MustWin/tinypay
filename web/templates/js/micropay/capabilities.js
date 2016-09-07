MP.Add(function() {
  MP.Capabilities = Backbone.Model.extend({
    initialize: function() {
      this.startTime = Date.now();
      this.web3Poll();
    },
    hasWeb3: function() {
      return window.web3 && window.web3.eth && window.web3.eth.getAccounds;
    },
    web3Poll: function() {
      var self = this;
      // Try for 30 seconds
      if (!this.hasWeb3()) {
          setTimeout(function() {
            if (!self.hasWeb3()) {
              self.web3Poll();
            } else {
                self.set({enabled: true}); // emits event
            }
          }, 10);
      }
    }
  });
});
