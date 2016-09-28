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
      this.render();
    },
    handleSignupForm: function(evt) {
      var self = this;
      this._disableForm(evt);
      try {
        this._handleFormEvt(evt, function(form) {
          self.model.set({amount: form.amount, domain: form.domain});
          self.renderSuccess();
        });
      } catch(err) {
        self._showError(evt, "signup-form", err);
      }
      return false;
    },
    renderSuccess: function(contractAddr) {
      this.$el.find("#signup-form").hide();
      this.$el.find("#signup-success").html(_.template(this.successTemplate, {contractAddr: contractAddr}));
      $('#step-agree-contract .step-indicator').html('<i class="large material-icons">done</i>');
    }
  });

});
