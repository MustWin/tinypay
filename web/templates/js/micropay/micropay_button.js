MP.Add(function() {
  MP.MicropayButton = Backbone.View.extend({
    tagName: "button",
    className: "",
    events: {
      //"click .classname":  fn()
    },
    initialize: function() {
      this.listenTo(this.model, "change", this.render);
      this.render();
    },
    enabledTemplate: _.template('<button class="waves-effect waves-light btn"><i class="material-icons left">flash_on</i>TinyPay</button>'),
    disabledTemplate: _.template('<button class="waves-effect waves-light btn"><i class="material-icons left">info_outline</i>Learn about TinyPay</button>'),
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
      if (!attrs.userClientContractAddress) {
        return "userClientContractAddress is a required configuration";
      }
      if (attrs.userClientContractAddress) {
        return "userClientContractAddress is a required configuration";
      }

    }
  });

});
