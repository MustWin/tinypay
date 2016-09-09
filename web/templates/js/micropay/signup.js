MP.Add(function() {
  MP.SignupButton = Backbone.View.extend({
    tagName: "button",
    className: "",
    events: {
      "click":  "signup"
    },
    initialize: function() {
      this.listenTo(this.model, "change", this.render);
      this.render();
    },
    enabledTemplate: _.template('<button class="waves-effect waves-light btn"><i class="material-icons left">flash_on</i>Signup</button>'),
    disabledTemplate: _.template('<button class="waves-effect waves-light btn"><i class="material-icons left">info_outline</i>Login</button>'),
    signup: function() {
      var self = this
        , domainMicropayContract = DomainMicropay.at("0x697e8c46889e29d70f5ca586ae72337076f7921d");

      domainMicropayContract.signUp(self.model.get('domain'), self.model.get('amount'))
        .then(() => { self.model.get('callback')(); })
        .catch((err) => { console.log(err); });
    },
    render: function() {
      if (this.model.get('capabilities').get('enabled')) {
          this.$el.html(this.enabledTemplate(this.model.attributes));
      } else {
        this.$el.html(this.disabledTemplate(this.model.attributes));
      }
      return this;
    }
  });

});

MP.Add(function() {
  MP.SignupButtonModel = Backbone.Model.extend({
    initialize: function() {

    },
    validate: function(attrs, opts) {
      if (!attrs.pricePerView) {
        return "pricePerView is a required configuration";
      }
      if (!isNaN(parseFloat(attrs.pricePerView)) && isFinite(attrs.pricePerView)) {
        return "pricePerView must be numeric";
      }
      if (String(attrs.pricePerView).search("\\.")) {
        return "pricePerView must be a whole number";
      }
      if (!attrs.userClientMicropayContractAddress) {
        return "userClientContractAddress is a required configuration";
      }
      if (attrs.userClientContractMicropayAddress) {
        return "userClientContractAddress is a required configuration";
      }

    }
  });

});
