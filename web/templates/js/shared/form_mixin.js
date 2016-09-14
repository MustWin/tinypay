MP.Add(function() {
  MP.FormMixin = {
    render: function() {
      if ((this.model.get('capabilities') && this.model.get('capabilities').get('enabled'))
          || this.model.get('enabled')) {
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
      this._showStep && this._showStep(1); // Used on withdraw_form
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
    }
  };
});
