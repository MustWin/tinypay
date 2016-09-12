import "./UserClientMicropay.sol";

/** @title DomainMicropay */
contract DomainMicropay {
  struct Client {
    string domain;
    address addr;
    bool confirmed;
    uint256 pricePerHit;
    UserClientMicropay contractAddr;
  }
  mapping(string => Client) private domainToClient;
  address private micropayWallet;

  event ClientCreated(string domain, address client, uint256 _pricePerHit);
  event ClientConfirmed(string domain, address client, address clientContract);

  modifier onlyMicropay {
      if (msg.sender != micropayWallet){
          throw;
      }
      _
  }

  function DomainMicropay() {
    micropayWallet = msg.sender;
  }

  /**@dev Create a client record for a given domain. Unconfirmed addresses are overwriteable by calling this function again.
          This function emits ClientCreated if a new client is added.
  * @param domain The domain to associate with this contract. This should be a FQDN matching the regex: /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/
  */
  function signUp(string domain, uint256 _pricePerHit) public {
    // Validate domain
    if (bytes(domain).length < 4) { // e.g. a.co
      throw;
    }

    Client existingClient = domainToClient[domain];

    // Fail if we have a confirmed client for this domain
    if (bytes(existingClient.domain).length != 0 && existingClient.confirmed) {
      throw;
    }

    var newClient = Client({domain: domain, addr: msg.sender, confirmed: false, pricePerHit: _pricePerHit, contractAddr: new UserClientMicropay(this, micropayWallet, msg.sender, _pricePerHit)});
    domainToClient[domain] = newClient;
    ClientCreated(domain, msg.sender, _pricePerHit);
  }

  /**@dev Mark this client as approved for a given domain, this should only accept messages from our trusted wallet.
  *  It should emit a ClientConfirmed event.
  *  @param clientDomain The domain we're confirming
  *  @param clientAddr The wallet address we're confirming
  */
  function confirmClient(string clientDomain, address clientAddr, uint256 pricePerHit) onlyMicropay public returns (bool)  {
    Client client = domainToClient[clientDomain];
    if (!client.confirmed && client.addr == clientAddr && client.pricePerHit == pricePerHit) {
      client.confirmed = true;
      ClientConfirmed(client.domain, client.addr, client.contractAddr);
    }
    return client.confirmed;
  }

  /** @dev Retrieve the UserClientPayment contract address for a confirmed domain
  * @param domain This should be a FQDN matching the regex: /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/
  */
  function getPaymentContractForDomain(string domain) public returns (UserClientMicropay) {
    Client c = domainToClient[domain];
    if (!c.confirmed) {
      throw;
    }
    return c.contractAddr;
  }

  // Only callable by micropay
  function withdraw(uint256 amount) onlyMicropay  public {
    if (this.balance < amount) {
      throw;
    }
    if (!micropayWallet.send( amount )) {
      throw;
    }
  }
}
