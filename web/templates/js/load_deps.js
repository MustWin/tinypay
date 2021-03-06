var MP = {name: "micropay"};

(function() {
  var deps = [
    // + jQuery
    {
      checkFn: function() { return window._; },
      src: "https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.15.0/lodash.js"
    },
    {
      checkFn: function() { return window.Backbone; },
      src: "https://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.3.3/backbone.js"
    },
  ];

  // No JQ required, everything else requires it.
  var count = 0;
  var _LoadDep = function(src, cb) {
    var s = document.createElement('script');
    s.src = src;
    s.onload = function() {
      cb();
    };
    document.head.appendChild(s);
  }

  var _when = function(fn, cb) {
    if (fn()) {
      cb();
    } else {
      setTimeout(function() { _when(fn, cb); }, 10);
    }
  };

  var _LoadDepPromise = function(checkFn, src) {
    var dfd = jQuery.Deferred();

    if (checkFn() == undefined) {
        _LoadDep(src, function() {
          return dfd.resolve();
        });
    } else {
      dfd.resolve();
    }

    return dfd.promise();
  };

  var LoadDeps = function () {
    var promise;
    for (var i = 0; i < deps.length; i++) {
      var checkFn = deps[i].checkFn
        , src = deps[i].src;
      if (!promise) {
        promise = _LoadDepPromise(deps[i].checkFn, deps[i].src);
      } else {
        promise.then(function() {
          _LoadDepPromise(checkFn, src);
        });
      }
    }
    return promise;
  }

  // APP ENTRY POINT
  var finish = function() { _when(deps[deps.length-1].checkFn, MP._Build); };
  if (window.$ === undefined) {
      _LoadDep("https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js", function() {
        LoadDeps().then(finish);
      });
  } else {
    LoadDeps().then(finish);
  }
})();

/**
  Add components that will be added to MP after dependencies are loaded
*/
MP.Add = function(fn) {
  if (!this.initFns) {
    this.initFns = [];
  }
  this.initFns.push(fn);
};

/**
  Actually add all the components added with 'Add' to MP.
  This is always called after the deps are loaded. Make sure we trigger the app Init if Init was already called by consumers
*/
MP._Build = function() {
  _.each(MP.initFns, function(fn) {
    fn();
  });
  MP._buildComplete = true;
  if (MP._initCalled) {
    MP.Init();
  }
};

/**
  This is called by client code, so may be executed before dependencies have loaded, so we queue it up within a promise
*/
MP.Init = function() {
  if (MP._buildComplete) {
    MP._doInit();
  }
  MP._initCalled = true;
}
