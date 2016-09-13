MP.Add(function() {
  MP.WithdrawForm = Backbone.View.extend({
    tagName: "div",
    className: "",
    events: {
      "submit #address-form": "handleAddressForm",
      "submit #withdraw-form": "handleWithdrawForm"
    },
    initialize: function() {
      _.extend(this, MP.FormMixin);
      this.listenTo(this.model, "change", this.render);
      this._showStep(1);
      this.render();
    },
    _showStep: function(num) {
      this.$el.find(".step").hide();
      this.$el.find("#step-" + num).show();
    },
    handleAddressForm: function(evt) {
      var self = this;
      this._disableForm(evt);
      try {
        this._handleFormEvt(evt, function(form) {
          self.contract = UserClientMicropay.at(form.address);
          web3.eth.getBalance(form.address, "latest", function(err, balance) {
            if (err) {
              console.log("Error: " + err);
              self._showError(evt, "step-1", err);
            } else {
              console.log("Balance: " + balance);
              self._showStep(2);
              self.$el.find("#withdraw-max").html(balance.toString());
            }
          });
        });
      } catch(err) {
          self._showError(evt, "step-1", err);
      }
      return false;
    },
    handleWithdrawForm: function(evt) {
      var self = this;
      this._disableForm(evt);
      this._handleFormEvt(evt, function(form) {
        try {
          self.contract.withdraw(form.withdraw_amount)
            .then(function() {
              self._showStep(3);
            })
            .catch(function(err) {
              self._showError(evt, "step-2", err);
            })

        } catch (err) {
          self._showError(evt, "step-2", err);
        }

      });
      return false;
    }
  });

});
