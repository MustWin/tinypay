

/**
  Initialize the installer application
*/
MP._doInit = function() {
  console.log("InstallerInit");
  MP.state = {};
  MP.state.capabilities = new MP.Capabilities({enabled: false});
  MP.state.install = new MP.InstallMetamask({
    el: $("#install-metamask")
  });
}

MP.Init();
