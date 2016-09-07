MP.Add(function() {
  MP.MicropayButton = Backbone.View.extend({
    tagName: "button",
    className: "",
    events: {
      //"click .classname":  fn()
    },
    initialize: function() {
      this.listenTo(this.model, "change", this.render);
    },
    enabledTemplate: _.template('<button>Ether Micropay</button>'),
    disabledTemplate: _.template('<button>Learn about Ether Micropay</button>'),
    render: function() {
      if (this.model.capabilities.enabled) {
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
