MP.Add(function() {
  MP.InstallMetamask = Backbone.View.extend({
    tagName: "div",
    className: "",
    events: {
      //"click":  "payForContent"
    },
    initialize: function() {
      this.render();
    },
    linkTemplate: _.template('<a href="<%= extensionLink %>"><%= browser %> Store</a>'),
    link: function(browserName) {
      console.log('lookup browser: ' + browserName)
      return {
        "Chrome": "https://chrome.google.com/webstore/detail/nkbihfbeogaeaoehlefnkodbefgpgknn"
      }[browserName]
    },
    render: function() {
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
    }
  });

});
