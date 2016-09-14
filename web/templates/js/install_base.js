

/**
  Initialize the installer application
*/
MP._doInit = function() {
  console.log("InstallerInit");
  MP.state = {};
  MP.state.capabilities = new MP.Capabilities({enabled: false});
  MP.state.signupDomain = new MP.SignupDomain({domain: undefined, capabilities: MP.state.capabilities});
  MP.state.install = new MP.InstallMetamask({
    el: $("#install-metamask"),
    model: MP.state.capabilities
  });
  MP.state.seed = new MP.SeedWallet({
    el: $("#seed-wallet"),
    model: MP.state.capabilities
  });
  MP.state.agreeContract = new MP.AgreeContract({
    el: $("#agree-contract-form"),
    model: MP.state.signupDomain
  });
  MP.state.confirmDomain = new MP.ConfirmDomain({
    el: $("#confirm-domain-form"),
    model: MP.state.signupDomain
  });
}

MP.Init();
