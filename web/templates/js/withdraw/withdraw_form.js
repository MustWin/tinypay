MP.Add(function() {
  MP.WithdrawForm = Backbone.View.extend({
    tagName: "div",
    className: "",
    events: {
      "submit #address-form": "handleAddressForm",
      "submit #withdraw-form": "handleWithdrawForm"
    },
    initialize: function() {
      this.listenTo(this.model, "change", this.render);
      this._showStep(1);
      this.render();
    },
    render: function() {
      if (this.model.get('enabled')) {
        this.renderWeb3();
      } else {
        this.renderNoWeb3();
      }
    },
    renderNoWeb3: function() {
      this.$el.find(".has-wallet").hide();
      this.$el.find(".no-wallet").show();
    },
    renderWeb3: function() {
      this.$el.find(".has-wallet").show();
      this.$el.find(".no-wallet").hide();
      this._showStep(1);
    },
    _handleFormEvt: function(evt, cb) {
      console.log(evt)
      evt.preventDefault();
      var form = _.reduce(
        $(evt.target).serializeArray(),
        function(memo, val) { memo[val.name] = val.value; return memo; }, {});
      cb(form);
    },
    _enableForm: function(evt) {
      $(evt.target).find("button").attr('disabled', false);
      $(evt.target).find(".progress").hide();
    },
    _disableForm: function(evt) {
      $(evt.target).find("button").attr('disabled', 'disabled');
      $(evt.target).find(".progress").show();
    },
    _showError: function(evt, stepId, errMsg) {
      this.$el.find("#" + stepId + " .error").show();
      this.$el.find("#" + stepId+ " .errorMsg").html(errMsg);
      this._enableForm(evt);
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
