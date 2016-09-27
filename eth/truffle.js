var host = process.env.ETHEREUM_SERVICE_HOST || 'localhost';
var port = process.env.ETHEREUM_SERVICE_PORT || 8545;

module.exports = {
  build: {
    "index.html": "index.html",
    "app.js": [],
    "app.css": [],
    "images/": "images/"
  },
  rpc: {
    host: host,
    port: port
  },
  "live": {
    network_id: 1, // Ethereum public network
  },
  "morden": {
    network_id: 2, // Official Ethereum test network
  },
  "staging": {
    network_id: 1337 // custom private network
  },
  "development": {
    network_id: "default" // Development network
  }
};
