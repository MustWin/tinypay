/** Setup the micropay configuration for your application:
  Options is a hash with the following required keys:
    pricePerView: the number of wei to charge per view. Must be numerical, string values are accepted.
    userClientMicropayContractAddress: The hexadecimal address of the UserClientMicropay contract relevant to this pageview, should begin with 0x...
    callback: The callback function to call when the payment has been received
    targetId (Optional): The css selector of the div to fill with the tinypay button
*/
MP.Configure = function(opts) {
  MP._configuration = opts;
  return MP; // for chaining
}

/**
  Fill in an element with id="tinypay-button" with our payment button.
*/
MP._doInit = function() {
  console.log("MicropayInit");
  MP.state = {};
  MP.state.capabilities = new MP.Capabilities({enabled: false});
  MP.state.buttonModel = new MP.MicropayButtonModel(_.extend(MP._configuration, {capabilities: MP.state.capabilities}));
  MP.state.button = new MP.MicropayButton({
    el: $(MP._configuration.targetId || "#tinypay-button"),
    model: MP.state.buttonModel
  });
}
