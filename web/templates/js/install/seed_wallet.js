MP.Add(function() {
  MP.SeedWallet = Backbone.View.extend({
    tagName: "div",
    className: "",
    events: {
    },
    initialize: function() {
      this.listenTo(this.model, "change", this.render);
      this.render();
    },
    render: function() {
      var self = this;
      if (this.model.get('enabled')) {
        web3.eth.getBalance(web3.eth.coinbase, "latest", function(err, balance) {
          if (!err && balance.toNumber() != 0) {
            self.renderMoney(balance);
          } else {
            self.renderNoMoney();
          }
        });
      } else {
        this.renderNoMoney();
      }
    },
    renderNoMoney: function() {
      this.$el.find(".has-money").hide();
      this.$el.find(".no-money").show();
    },
    renderMoney: function(balance) {
      this.$el.find(".has-money").show();
      this.$el.find(".no-money").hide();
      this.$el.find("#wallet-amount").html(balance.toString(10));
      $('#step-seed-wallet .step-indicator').html('<i class="large material-icons">done</i>');
    }
  });

});
