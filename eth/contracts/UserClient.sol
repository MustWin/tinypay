contract UserClient {
  uint256 pricePerHit;
  address user;
  address userClientMicropayContract;

  function UserClient(uint256 _price, address _userClientMicropayContract, address _user) {
    user = _user;
    userClientMicropayContract = _userClientMicropayContract;
    pricePerHit = _price;
  }

  function registerHit() public {
/*
    if (msg.sender != user) {
      throw;
    }
    */
    if (msg.value < pricePerHit) {
      throw;
    }

    if (!userClientMicropayContract.send(pricePerHit)) {
      throw;
    }
  }
}
