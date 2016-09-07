
MP.Add = function(fn) {
  if (!this.initFns) {
    this.initFns = [];
  }
  this.initFns.push(fn);
};

MP.Build = function() {
  _.each(MP.initFns, function(fn) {
    fn();
  });
  MP.Init();
};

/** Setup the micropay configuration for your application:
  Options is a hash with the following keys:
    pricePerView: the number of wei to charge per view. Must be numerical, string values are accepted.
    userClientContractAddress: The hexadecimal address of the UserClient contract relevant to this pageview, should begin with 0x...
*/
MP.Configure = function(opts) {
  MP._configuration = opts;
}

/*
  Fill in an element with id="micropay-button" with our payment button
*/
MP.Init = function() {
  console.log("MicropayInit");
  MP.state = {};
  MP.state.capabilities = new MP.Capabilities({enabled: false});
  MP.state.buttonModel = new MP.MicropayButtonModel(_.extend(MP._configuration), {capabilities: MP.state.capabilities});
  MP.state.button = new MP.MicropayButton({
    el: $("#microapy-button"),
    model: MP.state.buttonModel
  });
}
