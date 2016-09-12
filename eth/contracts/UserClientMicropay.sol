import "./UserClient.sol";// as UserClient

contract UserClientMicropay {
  address client;
  address micropay;
  address domainMicropayContract;
  uint256 public pricePerHit;
  mapping(address => UserClient ) userToContract;

  function UserClientMicropay(address _domainMicropayContract, address _micropay, address _client, uint256 _pricePerHit) {
    client = _client;
    micropay = _micropay;
    pricePerHit = _pricePerHit;
    domainMicropayContract = _domainMicropayContract;
  }

  // Can only be called by us and client. Sends 1% to us 99% to client
  function withdraw(uint256 amount) {

    if (msg.sender != micropay && msg.sender != client) {
      throw;
    }
/*
    if (amount > this.balance) {
      throw;
    }

    if (!domainMicropayContract.send( amount / 100 )) {
      throw;
    }
    if (!client.send( amount * 99 / 100 )) {
      throw;
    }*/

  }

  // Register the sending user, creating and saving a new contract
  function registerUser() returns (UserClient) {
    var userClientContract = new UserClient(pricePerHit, this, msg.sender);
    userToContract[msg.sender] = userClientContract;
    return userClientContract;
  }

  // Get contract for sending user
  function getContract() returns (UserClient) {
    var userClientContract = userToContract[msg.sender];
    if (userClientContract == address(0x0)) {
      throw;
    }
    return userClientContract;
  }
}
