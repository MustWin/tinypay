
//import "./DomainMicropay.sol";// as DomainMicropay
import "./UserClient.sol";// as UserClient

contract UserClientMicropay {
  address client;
  address domainMicropayContract;
  mapping(address => UserClient ) userToContract;

  function UserClientMicropay(address _domainMicropayContract, address _client) {
    client = _client;
    domainMicropayContract = _domainMicropayContract;
  }

  // Can only be called by us and client. Sends 1% to us 99% to client
  function withdraw(uint256 amount) {
    if (!(msg.sender == domainMicropayContract || msg.sender == client)) {
      throw;
    }

    if (amount > this.balance) {
      throw;
    }

    if (!domainMicropayContract.send( amount / 100 )) {
      throw;
    }
    if (!client.send( amount * 99 / 100 )) {
      throw;
    }
  }

  // Register the sending user, creating and saving a new contract
  function registerUser(uint256 pricePerHit) returns (UserClient) {
    var userClientContract = new UserClient(pricePerHit, this);
    userToContract[msg.sender] = userClientContract;
    return userClientContract;
  }

  // Get contract for sending user
  function getContract() returns (address) {
    return userToContract[msg.sender];
  }
}
