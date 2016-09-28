MP.Add(function() {
  MP.MicropayButton = Backbone.View.extend({
    tagName: "button",
    className: "",
    events: {
      "click":  "payForContent"
    },
    initialize: function() {
      this.paid = false;
      this.listenTo(this.model, "change", this.render);
      this.render();
    },
    enabledTemplate: _.template('<button class="tinypay-btn waves-effect waves-light btn"><i class="material-icons left">flash_on</i>TinyPay</button>'),
    spinnerTemplate: _.template(
      '<div>' +
        '<div class="preloader-wrapper small active">' +
          '<div class="spinner-layer spinner-green-only">' +
            '<div class="circle-clipper left">' +
              '<div class="circle"></div>' +
            '</div><div class="gap-patch">' +
              '<div class="circle"></div>' +
            '</div><div class="circle-clipper right">' +
              '<div class="circle"></div>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<span style="margin-left: 10px; line-height: 40px; vertical-align: bottom;"><%= step %></span>' +
      '</div>'),
    disabledTemplate: _.template(
        '<div>' +
          '<a href="http://tinypay.co/" class="tinypay-btn waves-effect waves-light btn"><i class="material-icons left">info_outline</i>Learn about TinyPay</a>' +
          '</br>' +
          '<span style="font-size:0.75em">Also be sure to switch to the Morden Testnet</span>' +
        '</div>'
        ),
    payForContent: function() {
      var self = this
        , userClientMicropayContract = UserClientMicropay.at(this.model.get('userClientMicropayContractAddress'));
      this.updateStep("Verifying Transaction");
      userClientMicropayContract.registerHit({from: web3.eth.coinbase})
          .then(function() {
            self.updateStep("Transaction Confirmed");
            return self.model.get('callback')();
          })
          .catch(function(err) {
            console.log("PAYMENT FAILED: " + err);
            self.render();
          });
    },
    updateStep: function(step) {
      this.$el.html(this.spinnerTemplate({step: "Sending Transaction"}));
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
  MP.MicropayButtonModel = Backbone.Model.extend({
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
        return "userClientMicropayContractAddress is a required configuration";
      }

    }
  });

});
