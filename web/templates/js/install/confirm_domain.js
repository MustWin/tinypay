MP.Add(function() {
  MP.ConfirmDomain = Backbone.View.extend({
    tagName: "div",
    className: "",
    events: {
    },
    initialize: function() {
      _.extend(this, MP.FormMixin);
      this.listenTo(this.model, "change", this.render);
      this.micropayContract = DomainMicropay.deployed();
      startWatches();
      this.render();
    },
    startWatches: function() {
      var clientConfirmations = this.micropayContract.ClientConfirmed({fromBlock: "latest"});
      clientConfirmations.watch(function(err, conf) {
        if (err) {
          console.log(err);
          return;
        }
        console.log(conf);
        TIE IN DOMAIN
        if (client.domain == this.domain) {
          self.renderSuccess(conf);
          clientConfirmations.stopWatching(watchFn);
        }
      });
    },
    successTemplate: "<p>Your contract has been created and is available at this address. " +
                      "Save it somewhere safe, you'll need it to withdraw your funds.</p>" +
                      "<code><%= contractAddr %></code>",
    renderSuccess: function(contractAddr) {
      this.$el.find("#domain-form").hide();
      this.$el.find("#confirm-success").html(_.template(this.successTemplate, {contractAddr: contractAddr}))
      // TODO: Fix checkmark
    }
  });

});
