MP.Add(function() {
  MP.ConfirmDomain = Backbone.View.extend({
    tagName: "div",
    className: "",
    events: {
    },
    initialize: function() {
      _.extend(this, MP.FormMixin);
      this.listenTo(this.model, "change", this.setDomain);
      this.micropayContract = DomainMicropay.deployed();
      this.clientConfirmations = this.micropayContract.ClientConfirmed({fromBlock: "latest"});
      this.startWatches();
      this.render();
    },
    checkConfig: function(config) {
      var self = this;
      console.log(conf);
      if (client.domain == this.model.get('domain')) {
        self.renderSuccess(conf);
        self.clientConfirmations.stopWatching(watchFn);
      }
    },
    startWatches: function() {
      var self = this;
      this.clientConfirmations.watch(function(err, conf) {
        if (err) {
          console.log(err);
          return;
        }
        self.checkConfig(conf);
      });
    },
    renderSuccess: function(contractAddr) {
      this.$el.find("#domain-form").hide();
      this.$el.find("#confirm-success").show();
      $('#step-confirm-domain .step-indicator').html('<i class="large material-icons">done</i>');
    }
  });

});
