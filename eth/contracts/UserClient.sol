contract UserClient {
  uint256 pricePerHit;
  address user;
  address userClientMicropayContract;

  function UserClient(uint256 _price, address _userClientMicropayContract) {
    user = msg.sender;
    userClientMicropayContract = _userClientMicropayContract;
    pricePerHit = _price;
  }

  function registerHit() {
    if (msg.sender != user) {
      throw;
    }
    if (!userClientMicropayContract.send(pricePerHit)) {
      throw;
    }
  }
}
