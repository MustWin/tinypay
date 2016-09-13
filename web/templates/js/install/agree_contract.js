MP.Add(function() {
  MP.AgreeContract = Backbone.View.extend({
    tagName: "div",
    className: "",
    events: {
      "submit #signup-form": "handleSignupForm",
    },
    initialize: function() {
      _.extend(this, MP.FormMixin);
      this.listenTo(this.model, "change", this.render);
      this.micropayContract = DomainMicropay.deployed();
      startWatches();
      this.render();
    },
    startWatches: function() {
      var self = this;
      var clientCreations = this.micropayContract.ClientCreated({fromBlock: "latest"});
      clientCreations.watch(function(err, client) {
        if (err) {
          console.log(err);
          return;
        }
        console.log(client);
        if (client.domain == this.domain) {
          self.renderSuccess(client.contractAddr);
          clientCreations.stopWatching(watchFn);
        }
      });
    },
    handleSignupForm: function(evt) {
      var self = this;
      this._disableForm(evt);
      try {
        this._handleFormEvt(evt, function(form) {
          this.domain = form.domain;
          // TODO: Domain validation
          micropayContract.signUp(form.domain, form.amount)
            .then(() => { /* This triggers an event on success that we're listening for */})
            .catch((err) => { self._showError(evt, "signup-form", err); });
          });
        });
      } catch(err) {
          self._showError(evt, "signup-form", err);
      }
      return false;
    },
    successTemplate: "<p>Your contract has been created and is available at this address. " +
                      "Save it somewhere safe, you'll need it to withdraw your funds.</p>" +
                      "<code><%= contractAddr %></code>",
    renderSuccess: function(contractAddr) {
      this.$el.find("#signup-form").hide();
      this.$el.find("#signup-success").html(_.template(this.successTemplate, {contractAddr: contractAddr}))
      // TODO: Fix checkmark
    }
  });

});
