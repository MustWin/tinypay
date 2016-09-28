MP.Add(function() {
  MP.SwitchTestnet = Backbone.View.extend({
    tagName: "div",
    className: "",
    events: {
    },
    initialize: function() {
      this.listenTo(this.model, "change", this.render);
      this.render();
    },
    render: function() {
      var self = this;
      if (this.model.get('network') != "test") {
        this.$el.find(".not-using-testnet").show();
        this.$el.find(".using-testnet").hide();
      } else {
        this.$el.find(".not-using-testnet").hide();
        this.$el.find(".using-testnet").show();
        $('#step-switch-testnet .step-indicator').html('<i class="large material-icons">done</i>');
      }
    }
  });

});
