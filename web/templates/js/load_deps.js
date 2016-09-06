
// No JQ required, everything else requires it.
var _LoadDep = function(src, cb) {
  var s = document.createElement('script');
  s.src = src;
  s.onload = function() {
    cb();
  };
  document.head.appendChild(s);
}

var _LoadDepPromise = function(checkFn, src) {
  var dfd = $.Deferred();

  if (checkFn() == undefined) {
      _LoadDep(src, function() { return dfd.resolve(); });
  } else {
    dfd.resolve();
  }

  return dfd.promise();
}

var LoadDeps = function () {
  var deps = [
    {
      checkFn: function() { return window.jQuery; },
      src: "https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"
    },
    {
      checkFn: function() { return window.jQuery; },
      src: "https://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.3.3/backbone.js"
    },
  ];

  var promise;
  for (var i = 0; i < deps.length; i++) {
    if (promise) {
      promise.then(_LoadDepPromise(deps[i].checkFn, deps[i].src));
    } else {
      promise = _LoadDepPromise(deps[i].checkFn, deps[i].src);
    }
  }
  promise.then(MicropayInit);
}

// APP ENTRY POINT
if (window.jQuery === undefined) {
    _LoadDep("https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js", function() {
      LoadDeps();
    });
} else {
  LoadDeps();
}
