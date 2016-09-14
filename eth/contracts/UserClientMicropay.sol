contract UserClientMicropay {
    address client;
    address micropay;
    address domainMicropayContract;
    uint256 public pricePerHit;

    function UserClientMicropay(address _domainMicropayContract, address _micropay, address _client, uint256 _pricePerHit) {
        client = _client;
        micropay = _micropay;
        pricePerHit = _pricePerHit;
        domainMicropayContract = _domainMicropayContract;
    }

    event DispatchAmount(uint256);

    // Can only be called by us and client. Sends 1% to us 99% to client
    function withdraw(uint256 amount) {

        if (msg.sender != micropay && msg.sender != client) {
            throw;
        }

        var clientAmount = amount * 99 / 100;
        var micropayAmount = amount / 100;

        if (clientAmount + micropayAmount > this.balance) {
            throw;
        }

        if (amount < 1 ether) {
            throw;
        }

        if (!domainMicropayContract.send(micropayAmount)) {
            throw;
        }

        if (!client.send(clientAmount)) {
            throw;
        }

    }

    function registerHit() public {
        if (msg.value < pricePerHit) {
            throw;
        }

        if (!this.send(pricePerHit)) {
            throw;
        }
    }

}
