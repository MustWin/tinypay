MP._doInit = function() {
  console.log("MicropayInit");
  MP.state = {};
  MP.state.capabilities = new MP.Capabilities({enabled: false});
  MP.state.signupForm = new MP.SignupForm({
    el: $("#signup-form"),
    model: MP.state.buttonModel
  });
}

MP.Add(function() {
  MP.SignupForm = Backbone.View.extend({
    el: $("#signup-form"),
    className: "",
    events: {
      "submit":  "signup"
    },
    initialize: function() {

    },
    signup: function(e) {
      var self = this
        , domainMicropayContract = DomainMicropay.at("0x5fb42a0963aab547db613f02f0e37f15aa26797c");

      var domain = $("#domain").val();
      var pricePerHit = $("price-per-hit").val();

      pricePerHit = (pricePerHit !== null && pricePerHit !== '')?parseInt(pricePerHit):0;
      
      domainMicropayContract.signUp(domain, pricePerHit, {from: "0xC76bC5f9180795751CDdf1427dadeA97E7912Bf0"})
        .then((result) => { console.log(result) })
        .catch((err) => { console.log(err); });

      e.preventDefault();

      return false;
    }
  });

});

MP.Add(function() {
  MP.SignupModel = Backbone.Model.extend({
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
