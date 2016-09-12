MP.Add(function() {
  MP.InstallMetamask = Backbone.View.extend({
    tagName: "div",
    className: "",
    events: {
    },
    initialize: function() {
      this.listenTo(this.model, "change", this.render);
      this.render();
    },
    linkTemplate: _.template('<a href="<%= extensionLink %>"><%= browser %> Store</a>'),
    link: function(browserName) {
      return {
        "Chrome": "https://chrome.google.com/webstore/detail/nkbihfbeogaeaoehlefnkodbefgpgknn"
      }[browserName]
    },
    alreadyEnabledTemplate: _.template('<div>You already have a web3 enabled browser, you\'re all set!</div>'),
    render: function() {
      if (this.model.get('enabled')) {
        this.renderWeb3();
      } else {
        this.renderNoWeb3();
      }
    },
    renderNoWeb3: function() {
      var b = detect.parse(navigator.userAgent).browser;
      var browser = _.find(["Chrome"], function(regex) { return b.name.match(new RegExp(regex)); } );
      if (!!browser) {
        this.$el.find("#install-extension-link").html(this.linkTemplate({browser: browser, extensionLink: this.link(browser)}));
        this.$el.find(".enabled").show();
        this.$el.find(".disabled").hide();
      } else {
        this.$el.find(".enabled").hide();
        this.$el.find(".disabled").show();
      }
      return this;
    },
    renderWeb3: function() {
      this.$el.html(this.alreadyEnabledTemplate());
      $('#step-install-metamask .step-indicator').html('<i class="large material-icons">done</i>')
    }
  });

});
