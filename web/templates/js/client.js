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

/** Setup the micropay configuration for your application:
  Options is a hash with the following required keys:
    pricePerView: the number of wei to charge per view. Must be numerical, string values are accepted.
    userClientContractAddress: The hexadecimal address of the UserClient contract relevant to this pageview, should begin with 0x...
    callback: The callback function to call when the payment has been received
*/
MP.Configure = function(opts) {
  MP._configuration = opts;
  return MP; // for chaining
}

MP._doInit = function() {
  console.log("MicropayInit");
  MP.state = {};
  MP.state.capabilities = new MP.Capabilities({enabled: false});
  MP.state.buttonModel = new MP.MicropayButtonModel(_.extend(MP._configuration, {capabilities: MP.state.capabilities}));
  MP.state.button = new MP.MicropayButton({
    el: $("#micropay-button"),
    model: MP.state.buttonModel
  });
}

/*
  Fill in an element with id="micropay-button" with our payment button.
  This is called by client code, so may be executed before dependencies have loaded, so we queue it up within a promise
*/
MP.Init = function() {
  if (MP._buildComplete) {
    MP._doInit();
  }
  MP._initCalled = true;
}
