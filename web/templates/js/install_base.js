

/**
  Initialize the installer application
*/
MP._doInit = function() {
  console.log("InstallerInit");
  MP.state = {};
  MP.state.capabilities = new MP.Capabilities({enabled: false});
  MP.state.install = new MP.InstallMetamask({
    el: $("#install-metamask"),
    model: MP.state.capabilities
  });
  MP.state.seed = new MP.SeedWallet({
    el: $("#seed-wallet"),
    model: MP.state.capabilities
  });
}

MP.Init();