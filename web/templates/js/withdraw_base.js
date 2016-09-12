

/**
  Initialize the installer application
*/
MP._doInit = function() {
  console.log("InstallerInit");
  MP.state = {};
  MP.state.capabilities = new MP.Capabilities({enabled: false});
  MP.state.withdrawForm = new MP.WithdrawForm({
    el: $("#withdraw-form"),
    model: MP.state.capabilities
  });
};

MP.Init();
